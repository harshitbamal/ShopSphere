import React, { useState, useEffect } from "react";

const Profile = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log("Fetching profile...");
                const token = localStorage.getItem("token");
                console.log("Token:", token); // Debugging log

                const res = await fetch("http://localhost:5000/api/users/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                console.log("Response status:", res.status); // Debugging log

                if (!res.ok) {
                    throw new Error("Failed to fetch profile. Please log in again.");
                }

                const data = await res.json();
                console.log("Profile data:", data); // Debugging log
                setFormData({ name: data.name, email: data.email, password: "" });
            } catch (err) {
                console.error("Error fetching profile:", err.message); // Debugging log
                setError(err.message);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const body = { ...formData };
            if (!body.password) {
                delete body.password; // Remove password if it's empty
            }

            const res = await fetch("http://localhost:5000/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update profile.");
            }

            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Profile</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="New Password"
                    onChange={handleChange}
                />
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default Profile;
