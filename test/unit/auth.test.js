// Authentication tests must not create database rows or sign real JWTs.
jest.mock("../../config/db", () => ({ query: jest.fn() }));
jest.mock("bcrypt", () => ({ hash: jest.fn(), compare: jest.fn() }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn(), verify: jest.fn() }));

const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signUp, login, refresh, logout } = require("../../controllers/auth");

const response = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    cookie: jest.fn(),
    clearCookie: jest.fn(),
});

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation();
});

afterEach(() => jest.restoreAllMocks());

describe("signUp", () => {
    it("requires an email and password", async () => {
        const res = response();

        await signUp({ body: {} }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "All fields are required." });
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("creates a user and default profile in one transaction", async () => {
        const user = { id: 1, email: "admin@example.com" };
        const profile = { id: 2, user_id: 1, username: "admin_123" };
        // Existing-user check, BEGIN, user insert, profile insert, then COMMIT.
        pool.query
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({ rows: [user] })
            .mockResolvedValueOnce({ rows: [profile] })
            .mockResolvedValueOnce({});
        bcrypt.hash.mockResolvedValueOnce("password-hash");
        const res = response();

        await signUp({ body: { email: user.email, password: "Password1!" } }, res);

        expect(bcrypt.hash).toHaveBeenCalledWith("Password1!", 10);
        expect(pool.query).toHaveBeenCalledWith("BEGIN");
        expect(pool.query).toHaveBeenLastCalledWith("COMMIT");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "You have registered successfully.", user, profile,
        });
    });
});

describe("login", () => {
    it("returns 401 for an unknown email", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });
        const res = response();

        await login({ body: { email: "missing@example.com", password: "Password1!" }, cookies: {} }, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials. Please try again." });
    });

    it("sets access and refresh cookies after valid credentials", async () => {
        const user = { id: 1, email: "admin@example.com", password_hash: "password-hash" };
        pool.query.mockResolvedValueOnce({ rows: [user] }).mockResolvedValueOnce({});
        bcrypt.compare.mockResolvedValueOnce(true);
        jwt.sign.mockReturnValueOnce("access-token").mockReturnValueOnce("refresh-token");
        const res = response();

        await login({ body: { email: user.email, password: "Password1!" }, cookies: {} }, res);

        expect(res.cookie).toHaveBeenCalledWith("accessToken", "access-token", expect.any(Object));
        expect(res.cookie).toHaveBeenCalledWith("refreshToken", "refresh-token", expect.any(Object));
        expect(pool.query).toHaveBeenLastCalledWith("UPDATE users SET refresh_token = $1 WHERE id = $2", ["refresh-token", 1]);
        expect(res.status).toHaveBeenCalledWith(200);
    });
});

describe("refresh", () => {
    it("requires a refresh token", async () => {
        const res = response();

        await refresh({ cookies: {} }, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "No refresh token" });
    });

    it("issues a new access token for a valid stored refresh token", async () => {
        jwt.verify.mockReturnValueOnce({ id: 1 });
        pool.query.mockResolvedValueOnce({ rows: [{ refresh_token: "refresh-token" }] });
        jwt.sign.mockReturnValueOnce("new-access-token");
        const res = response();

        await refresh({ cookies: { refreshToken: "refresh-token" } }, res);

        expect(res.cookie).toHaveBeenCalledWith("accessToken", "new-access-token", expect.any(Object));
        expect(res.json).toHaveBeenCalledWith({ message: "Token refreshed" });
    });
});

describe("logout", () => {
    it("clears both cookies even without a refresh token", async () => {
        const res = response();

        await logout({ cookies: {} }, res);

        expect(pool.query).not.toHaveBeenCalled();
        expect(res.clearCookie).toHaveBeenCalledWith("accessToken");
        expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
    });

    it("revokes a stored refresh token before clearing cookies", async () => {
        jwt.verify.mockReturnValueOnce({ id: 1 });
        pool.query.mockResolvedValueOnce({});
        const res = response();

        await logout({ cookies: { refreshToken: "refresh-token" } }, res);

        expect(pool.query).toHaveBeenCalledWith("UPDATE users SET refresh_token = NULL WHERE id = $1", [1]);
        expect(res.clearCookie).toHaveBeenCalledTimes(2);
        expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
    });
});
