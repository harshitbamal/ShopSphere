import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", {
                name,
                email,
                password,
            });

            if (res.status === 201) {
                alert("Registration successful! Please log in.");
                router.push("/auth/login"); // Redirect to login page
            }
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/auth/login">Login</a></p>
        </div>
    );
};

export default Register;
