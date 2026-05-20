const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign Up
const signUp = async (req, res) => {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    // Password validation
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
        });
    }

    try {
        // Check if user exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Use transaction (VERY important)
        await pool.query("BEGIN");

        // 1. Insert user
        const newUserResult = await pool.query(
            `
            INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email;
            `,
            [email, hashedPassword]
        );

        const user = newUserResult.rows[0];

        // 2. Create default profile
        const usernameBase = email.split("@")[0];

        // ensure uniqueness later if needed
        const defaultUsername = `${usernameBase}_${Date.now()}`;

        const newProfileResult = await pool.query(
            `
            INSERT INTO profiles (
                user_id,
                username,
                display_name,
                bio,
                about,
                profile_photo,
                website,
                twitter,
                linkedin
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
            `,
            [
                user.id,
                defaultUsername,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ]
        );

        await pool.query("COMMIT");

        return res.status(201).json({
            message: "You have registered successfully.",
            user,
            profile: newProfileResult.rows[0],
        });

    } catch (error) {
        await pool.query("ROLLBACK");

        console.error("Registration Error:", error);

        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

//Login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (req.cookies?.accessToken) {
        return res.status(400).json({ message: "You are already logged in." });
    }

    try {
        // Check if tenant exists
        const checkUserQuery = "SELECT * FROM users WHERE email = $1";
        const user = await pool.query(checkUserQuery, [email]);

        if (user.rows.length === 0) {
            return res
                .status(401)
                .json({ message: "Invalid credentials. Please try again." });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.rows[0].password_hash,
        );

        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Invalid credentials. Please try again" });
        }

        // Create JWT - access & refresh tokens
        const accessToken = jwt.sign(
            {
                id: user.rows[0].id,
                role: "Admin",
                email: user.rows[0].email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
        );

        const refreshToken = jwt.sign(
            {
                id: user.rows[0].id,
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" },
        );

        //Set the cookie - access & refresh
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000, //1 Hour
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        });

        await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
            refreshToken,
            user.rows[0].id,
        ]);

        res.status(200).json({
            message: "Sign in successful",
            user: {
                id: user.rows[0].id,
                email: user.rows[0].email,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

//Refresh
const refresh = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const user = await pool.query(
            "SELECT refresh_token FROM users WHERE id = $1",
            [decoded.id],
        );

        if (user.rows.length === 0 || user.rows[0].refresh_token !== token) {
            return res.status(403).json({ message: "Refresh token revoked" });
        }

        const newAccessToken = jwt.sign(
            {
                id: decoded.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000,
        });

        res.json({ message: "Token refreshed" });
    } catch (error) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};

// Admin Logout
const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

            await pool.query(
                "UPDATE users SET refresh_token = NULL WHERE id = $1",
                [decoded.id]
            );
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        console.error("Logout Error:", error.message);

        // Still clear cookies even if token is invalid
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({ message: "Logged out" });
    }
};

module.exports = {
    signUp,
    login,
    refresh,
    logout,
};
