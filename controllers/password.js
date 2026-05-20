const pool = require("../config/db");
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const { passwordResetEmail } = require("./emailService")

//Reset Password
const resetPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        //Confirm if user exists
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];
        // console.log(user)

        if (!user) {
            return res.status(200).json({
                message: "If an account exists, a reset email has been sent."
            });
        }

        //Generate Password Reset Token
        const plainToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(plainToken)
            .digest("hex");
        const expiry = new Date(Date.now() + 2 * 60 * 1000); // 2 mins

        // Store hashed token and expiry in DB
        await pool.query(
            `
             INSERT INTO password_reset_tokens
             (user_id, token_hash, expires_at)
             VALUES ($1, $2, $3)
             `,
            [user.id, hashedToken, expiry]
        )

        // Send email with plain token
        await passwordResetEmail(email, plainToken);

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

//Verify Password Reset Token
const verifyPasswordResetToken = async (req, res) => {
    try {
        const { token } = req.query

        // Check token exists
        if (!token) {
            return res.status(400).json({
                message: "Token is required."
            });
        }

        //Hash Incoming token
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const result = await pool.query(
            `SELECT user_id, expires_at, used
             FROM password_reset_tokens
             WHERE token_hash = $1
             ORDER BY created_at DESC
             LIMIT 1`,
            [hashedToken]
        )

        const resetToken = result.rows[0];

        // Token not found
        if (!resetToken) {
            return res.status(400).json({
                message: "Invalid password reset token."
            });
        }

        // Token already used
        if (resetToken.used) {
            return res.status(400).json({
                message: "This reset link has already been used."
            });
        }

        //Expired Token
        if (new Date(resetToken.expires_at) < new Date()) {
            return res.status(400).json({
                message: "Password reset token expired."
            });
        }

        // Token valid
        return res.status(200).json({
            message: "Token is valid.",
            userId: resetToken.user_id
        });
    } catch (error) {
        console.error("Error verifying password reset token:", error);
        console.log(error)
        res.status(500).json({ message: "Internal server error." });
    }
}

// Reset Password With Token
const resetPasswordToken = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        // Validate input
        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Token, new password, and confirm password are required.",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match.",
            });
        }

        // Password strength check
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: "Password is too weak.",
            });
        }

        // Hash token
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find valid token
        const result = await pool.query(
            `
            SELECT user_id, expires_at, used
            FROM password_reset_tokens
            WHERE token_hash = $1
            `,
            [hashedToken]
        );

        const resetRecord = result.rows[0];

        if (!resetRecord) {
            return res.status(400).json({
                message: "Invalid or expired token.",
            });
        }

        if (resetRecord.used) {
            return res.status(400).json({
                message: "This reset link has already been used.",
            });
        }

        if (new Date(resetRecord.expires_at) < new Date()) {
            return res.status(400).json({
                message: "Reset token expired.",
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        await pool.query(
            `
            UPDATE users
            SET password_hash = $1
            WHERE id = $2
            `,
            [hashedPassword, resetRecord.user_id]
        );

        // Mark token as used
        await pool.query(
            `
            UPDATE password_reset_tokens
            SET used = true
            WHERE token_hash = $1
            `,
            [hashedToken]
        );

        return res.status(200).json({
            message: "Password reset successful.",
        });

    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};


module.exports = { resetPasswordEmail, verifyPasswordResetToken, resetPasswordToken }