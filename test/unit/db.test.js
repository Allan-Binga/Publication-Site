jest.mock("pg", () => ({ Pool: jest.fn() }));
jest.mock("dotenv", () => ({ config: jest.fn() }));

const originalEnv = { ...process.env };
afterEach(() => { process.env = { ...originalEnv }; });

function loadDatabase(env) {
  jest.resetModules();
  process.env = { ...originalEnv, ...env };
  const pool = { on: jest.fn(), query: jest.fn().mockResolvedValue({ rows: [] }) };
  const { Pool } = require("pg");
  Pool.mockImplementation(() => pool);
  const database = require("../../config/db");
  return { Pool, pool, database };
}

test("production uses the hosted URL and releases startup connections through pool.query", () => {
  const url = "postgresql://demo:example@db.example/demo?sslmode=verify-full";
  const { Pool, pool, database } = loadDatabase({ NODE_ENV: "production", DATABASE_URL: url });
  expect(Pool).toHaveBeenCalledWith(expect.objectContaining({ connectionString: url, max: 5 }));
  expect(Pool.mock.calls[0][0]).not.toHaveProperty("ssl");
  expect(pool.query).toHaveBeenCalledWith("SELECT 1");
  expect(pool.on).toHaveBeenCalledWith("error", expect.any(Function));
  expect(database).toBe(pool);
});

test("production rejects a missing hosted URL instead of falling back to localhost", () => {
  expect(() => loadDatabase({ NODE_ENV: "production", DATABASE_URL: "" })).toThrow("DATABASE_URL is required");
});

test("tests retain local settings without opening a database connection", () => {
  const { Pool, pool } = loadDatabase({ NODE_ENV: "test", DB_HOST: "localhost", DB_DATABASE: "demo_test" });
  expect(Pool).toHaveBeenCalledWith(expect.objectContaining({ host: "localhost", database: "demo_test" }));
  expect(pool.query).not.toHaveBeenCalled();
});
