const pool = require("../config/db")

// Fetch Profile
const getProfile = async (req, res) => {
    const userId = req.userId;

    try {
        const query = `
            SELECT p.*, u.email
            FROM profiles p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = $1
        `;

        const result = await pool.query(query, [userId]);

        res.status(200).json({
            profile: result.rows[0]
        });

    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

//Edit Profile
const editProfile = async (req, res) => {
    const { id } = req.params;
    const { username, displayName, bio, about, website, twitter, linkedin } = req.body;

    try {
        const profilePhoto = req.file ? req.file.location : null;

        const query = `
            UPDATE profiles
            SET
                username = COALESCE($1, username),
                display_name = COALESCE($2, display_name),
                bio = COALESCE($3, bio),
                about = COALESCE($4, about),
                profile_photo = COALESCE($5, profile_photo),
                website = COALESCE($6, website),
                twitter = COALESCE($7, twitter),
                linkedin = COALESCE($8, linkedin)
            WHERE id = $9
            RETURNING *;
        `

        const updatedProfile = await pool.query(query, [
            username || null,
            displayName || null,
            bio || null,
            about || null,
            profilePhoto || null,
            website || null,
            twitter || null,
            linkedin || null,
            id
        ])

        if (updatedProfile.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found." });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            profile: updatedProfile.rows[0]
        })
    } catch (error) {
        console.error("Profile Update Error:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    getProfile,
    editProfile
}