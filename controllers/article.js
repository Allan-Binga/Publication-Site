const pool = require("../config/db")

//Create Slug
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
};

//Dashboard Content
const dashboard = async (req, res) => {
    const authorId = req.userId;

    try {
        const totalQuery = `
            SELECT COUNT(*) AS total 
            FROM articles 
            WHERE author_id = $1
        `;

        const publishedQuery = `
            SELECT COUNT(*) AS total 
            FROM articles 
            WHERE author_id = $1 AND status = 'published'
        `;

        const draftsQuery = `
            SELECT COUNT(*) AS total 
            FROM articles 
            WHERE author_id = $1 AND status = 'draft'
        `;

        const categoriesQuery = `
            SELECT COUNT(DISTINCT category) AS total 
            FROM articles 
            WHERE author_id = $1
        `;

        const recentQuery = `
            SELECT id, title, category, status, created_at 
            FROM articles 
            WHERE author_id = $1 
            ORDER BY created_at DESC 
            LIMIT 5
        `;

        const profileQuery = `
            SELECT * 
            FROM profiles 
            WHERE user_id = $1
        `;

        // Run all queries properly (6 results!)
        const [
            totalResult,
            publishedResult,
            draftsResult,
            categoriesResult,
            recentResult,
            profileResult
        ] = await Promise.all([
            pool.query(totalQuery, [authorId]),
            pool.query(publishedQuery, [authorId]),
            pool.query(draftsQuery, [authorId]),
            pool.query(categoriesQuery, [authorId]),
            pool.query(recentQuery, [authorId]),
            pool.query(profileQuery, [authorId])
        ]);

        const profile = profileResult.rows[0];

        // Safety fallback (VERY important)
        if (!profile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Profile completion logic
        const calculateProfileCompletion = (profile) => {
            let score = 0;

            if (profile.username) score += 20;
            if (profile.display_name) score += 15;
            if (profile.bio) score += 15;
            if (profile.about) score += 20;
            if (profile.profile_photo) score += 20;

            const socials =
                (profile.twitter ? 1 : 0) +
                (profile.linkedin ? 1 : 0) +
                (profile.website ? 1 : 0);

            score += (socials / 3) * 10;

            return Math.round(score);
        };

        const completion = calculateProfileCompletion(profile);

        const canPublish = Boolean(
            profile.username &&
            profile.display_name &&
            profile.profile_photo
        );

        return res.status(200).json({
            stats: {
                totalArticles: Number(totalResult.rows[0].total),
                published: Number(publishedResult.rows[0].total),
                drafts: Number(draftsResult.rows[0].total),
                categories: Number(categoriesResult.rows[0].total),
            },

            recentArticles: recentResult.rows,

            profile: {
                ...profile,
                completion,
                canPublish,
            },
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Public Dashboard Content
const publicDashboard = async (req, res) => {
    try {
        const query = `
            SELECT id, title, category, excerpt, cover_image, created_at
            FROM articles
            WHERE status = 'published'
            ORDER BY created_at DESC
            LIMIT 3
        `;

        const result = await pool.query(query);

        return res.status(200).json({
            latestArticles: result.rows
        });

    } catch (error) {
        console.error("Public Dashboard Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

//Post Article
const postArticle = async (req, res) => {
    const { title, excerpt, content, category, status } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required." });
    }

    try {
        const slug = generateSlug(title);
        const authorId = req.userId;

        const coverImage = req.file
            ? req.file.location
            : req.body.cover_image || null;

        const articleStatus = status === "published" ? "published" : "draft";

        const query = `
            INSERT INTO articles
            (title, slug, excerpt, content, cover_image, category, author_id, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *;
        `;

        const newArticle = await pool.query(query, [
            title,
            slug,
            excerpt || null,
            content,
            coverImage || null,
            category || null,
            authorId,
            articleStatus
        ]);

        res.status(201).json({
            message: "Article created successfully",
            article: newArticle.rows[0],
        });

    } catch (error) {
        console.error("Post Article Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get Articles
const getArticles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const offset = (page - 1) * limit;

        const search = req.query.search || "";
        const category = req.query.category || "";

        let filters = [`status = 'published'`];
        let values = [];

        let paramIndex = 1;

        // Search filter
        if (search) {
            filters.push(`
                (
                    title ILIKE $${paramIndex}
                    OR excerpt ILIKE $${paramIndex}
                    OR category ILIKE $${paramIndex}
                )
            `);

            values.push(`%${search}%`);
            paramIndex++;
        }

        // Category filter
        if (category) {
            filters.push(`category = $${paramIndex}`);

            values.push(category);
            paramIndex++;
        }

        const whereClause = `WHERE ${filters.join(" AND ")}`;

        // Count query
        const countQuery = `
            SELECT COUNT(*)
            FROM articles
            ${whereClause}
        `;

        // Articles query
        const articlesQuery = `
            SELECT
                id,
                title,
                slug,
                excerpt,
                cover_image,
                category,
                created_at
            FROM articles
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${paramIndex}
            OFFSET $${paramIndex + 1}
        `;

        values.push(limit, offset);

        const [countResult, articlesResult] = await Promise.all([
            pool.query(countQuery, values.slice(0, paramIndex - 1)),
            pool.query(articlesQuery, values)
        ]);

        const totalArticles = Number(countResult.rows[0].count);

        const totalPages = Math.ceil(totalArticles / limit);

        return res.status(200).json({
            currentPage: page,
            totalPages,
            totalArticles,
            articles: articlesResult.rows
        });

    } catch (error) {
        console.error("Get Articles Error:", error);

        return res.status(500).json({
            message: "Internal server error."
        });
    }
};

//Single Article
const article = async (req, res) => {
    const authorId = req.userId
    const { articleId } = req.params

    try {

        const query = `
            SELECT
                a.*,

                p.display_name,
                p.profile_photo

            FROM articles a

            LEFT JOIN profiles p
            ON a.author_id = p.user_id

            WHERE a.id = $1
            AND a.author_id = $2

            LIMIT 1
        `

        const result = await pool.query(query, [articleId, authorId])

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Article not found"
            })
        }

        const currentArticle = result.rows[0]

        // Related articles
        const relatedQuery = `
            SELECT
                id,
                title,
                slug,
                excerpt,
                cover_image,
                category,
                created_at

            FROM articles

            WHERE category = $1
            AND id != $2
            AND status = 'published'

            ORDER BY created_at DESC
            LIMIT 3
        `

        const relatedResult = await pool.query(relatedQuery, [currentArticle.category, articleId])

        res.status(200).json({
            article: currentArticle,
            relatedArticles: relatedResult.rows
        })

    } catch (error) {
        console.error("Error fetching article:", error.message)

        res.status(500).json({
            message: "Server error"
        })
    }
}

//Public Single Article Details
const getArticle = async (req, res) => {
    const { articleId } = req.params;

    try {
        const query = `
            SELECT
                a.*,
                p.display_name,
                p.profile_photo
            FROM articles a
            LEFT JOIN profiles p
                ON a.author_id = p.user_id
            WHERE a.id = $1
              AND a.status = 'published'
            LIMIT 1
        `;

        const result = await pool.query(query, [articleId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        const article = result.rows[0];

        // Related articles
        const relatedQuery = `
            SELECT
                id,
                title,
                slug,
                excerpt,
                cover_image,
                category,
                created_at
            FROM articles
            WHERE category = $1
              AND id != $2
              AND status = 'published'
            ORDER BY created_at DESC
            LIMIT 3
        `;

        const relatedResult = await pool.query(relatedQuery, [
            article.category,
            articleId
        ]);

        return res.status(200).json({
            article,
            relatedArticles: relatedResult.rows
        });

    } catch (error) {
        console.error("Error fetching article:", error.message);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

// Get User's Articles
const userArticles = async (req, res) => {
    const userId = req.userId;

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const search = req.query.search || "";
        const category = req.query.category || "";
        const status = req.query.status || "";

        let filters = [`author_id = $1`];
        let values = [userId];

        let paramIndex = 2;

        // Search (title + excerpt + category)
        if (search) {
            filters.push(`
                (
                    title ILIKE $${paramIndex}
                    OR excerpt ILIKE $${paramIndex}
                    OR category ILIKE $${paramIndex}
                )
            `);

            values.push(`%${search}%`);
            paramIndex++;
        }

        // Category filter
        if (category) {
            filters.push(`category = $${paramIndex}`);
            values.push(category);
            paramIndex++;
        }

        // Status filter
        if (status) {
            filters.push(`status = $${paramIndex}`);
            values.push(status);
            paramIndex++;
        }

        const whereClause = `WHERE ${filters.join(" AND ")}`;

        // Count query
        const countQuery = `
            SELECT COUNT(*) 
            FROM articles
            ${whereClause}
        `;

        // Data query
        const articlesQuery = `
            SELECT 
                id,
                title,
                slug,
                excerpt,
                cover_image,
                category,
                status,
                created_at
            FROM articles
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        values.push(limit, offset);

        const [countResult, articlesResult] = await Promise.all([
            pool.query(countQuery, values.slice(0, paramIndex - 1)),
            pool.query(articlesQuery, values)
        ]);

        const totalArticles = Number(countResult.rows[0].count);
        const totalPages = Math.ceil(totalArticles / limit);

        res.status(200).json({
            currentPage: page,
            totalPages,
            totalArticles,
            articles: articlesResult.rows
        });

    } catch (error) {
        console.error("Please try again:", error);
        res.status(500).json({ message: "Problem fetching articles" });
    }
};

// Delete Article
const deleteArticle = async (req, res) => {
    const { id } = req.params;

    try {

        const query = `
            DELETE FROM articles
            WHERE id = $1
            RETURNING *;
        `;

        const deleted = await pool.query(query, [id]);

        if (deleted.rows.length === 0) {
            return res.status(404).json({ message: "Article not found." });
        }

        res.status(200).json({
            message: "Article deleted successfully"
        });

    } catch (error) {
        console.error("Delete Article Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Edit Article
const editArticle = async (req, res) => {
    const authorId = req.userId;
    const { id } = req.params;
    const { title, excerpt, content, category, status } = req.body;

    try {
        const slug = title ? generateSlug(title) : null;
        const coverImage = req.file
            ? req.file.location
            : req.body.cover_image || null;

        const articleStatus =
            status === "published"
                ? "published"
                : status === "draft"
                    ? "draft"
                    : null;

        const query = `
            UPDATE articles
            SET
                title = COALESCE($1, title),
                slug = COALESCE($2, slug),
                excerpt = COALESCE($3, excerpt),
                content = COALESCE($4, content),
                cover_image = COALESCE($5, cover_image),
                category = COALESCE($6, category),
                status = COALESCE($7, status)
            WHERE id = $8 AND author_id = $9
            RETURNING *;
        `;

        const updated = await pool.query(query, [
            title || null,
            slug,
            excerpt || null,
            content || null,
            coverImage || null,
            category || null,
            articleStatus,
            id,
            authorId
        ]);

        if (updated.rows.length === 0) {
            return res.status(404).json({ message: "Article not found." });
        }

        res.status(200).json({
            message: "Article updated successfully",
            article: updated.rows[0],
        });

    } catch (error) {
        console.error("Edit Article Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    dashboard,
    publicDashboard,
    postArticle,
    getArticles,
    article,
    getArticle,
    userArticles,
    deleteArticle,
    editArticle,
}