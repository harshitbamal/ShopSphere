import React, { useState, useEffect } from "react";

const Profile = () => {
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch("http://localhost:5000/api/users/profile", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            setUser(data);
            setFormData({ name: data.name, email: data.email, password: "" });
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/api/users/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        alert(data.message);
    };

    return (
        <div>
            <h2>Profile</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="New Password" onChange={handleChange} />
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default Profile;
