const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const User = require("../models/User");

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
    try {
        console.log("User ID from token:", req.user.id); // Debugging log
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching profile:", err.message); // Debugging log
        res.status(500).json({ error: "Server error" });
    }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const updatedFields = { name, email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(req.user.id, updatedFields, {
            new: true,
        }).select("-password");

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
