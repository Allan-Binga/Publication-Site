jest.mock("../../config/db", () => ({ query: jest.fn() }));
jest.mock("bcrypt", () => ({ genSalt: jest.fn(), hash: jest.fn() }));
jest.mock("crypto", () => ({ randomBytes: jest.fn(() => ({ toString: () => "plain-token" })), createHash: jest.fn(() => ({ update: jest.fn().mockReturnThis(), digest: jest.fn(() => "hashed-token") })) }));
jest.mock("../../controllers/emailService", () => ({ passwordResetEmail: jest.fn() }));
const pool = require("../../config/db"); const bcrypt = require("bcrypt"); const { passwordResetEmail } = require("../../controllers/emailService");
const { resetPasswordEmail, verifyPasswordResetToken, resetPasswordToken } = require("../../controllers/password"); const res = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });
beforeEach(() => { jest.clearAllMocks(); jest.spyOn(console, "error").mockImplementation(); jest.spyOn(console, "log").mockImplementation(); }); afterEach(() => jest.restoreAllMocks());
describe("resetPasswordEmail", () => {
 it("requires an email", async () => { const r=res(); await resetPasswordEmail({body:{}},r); expect(r.status).toHaveBeenCalledWith(400); });
 it("stores a reset token and emails an existing user", async () => { pool.query.mockResolvedValueOnce({rows:[{id:1}]}).mockResolvedValueOnce({}); passwordResetEmail.mockResolvedValueOnce(); const r=res(); await resetPasswordEmail({body:{email:"a@b.com"}},r); expect(passwordResetEmail).toHaveBeenCalledWith("a@b.com","plain-token"); expect(r.status).toHaveBeenCalledWith(200); });
});
describe("verifyPasswordResetToken", () => {
 it("requires a token", async () => { const r=res(); await verifyPasswordResetToken({query:{}},r); expect(r.status).toHaveBeenCalledWith(400); });
 it("returns the token owner for a valid unused token", async () => { pool.query.mockResolvedValueOnce({rows:[{user_id:1,used:false,expires_at:"2099-01-01"}]}); const r=res(); await verifyPasswordResetToken({query:{token:"valid"}},r); expect(r.json).toHaveBeenCalledWith({message:"Token is valid.",userId:1}); });
});
describe("resetPasswordToken", () => {
 it("rejects mismatched passwords", async () => { const r=res(); await resetPasswordToken({body:{token:"x",newPassword:"Password1!",confirmPassword:"Other1!"}},r); expect(r.status).toHaveBeenCalledWith(400); expect(pool.query).not.toHaveBeenCalled(); });
 it("updates the password and marks its reset token used", async () => { pool.query.mockResolvedValueOnce({rows:[{user_id:1,used:false,expires_at:"2099-01-01"}]}).mockResolvedValueOnce({}).mockResolvedValueOnce({}); bcrypt.genSalt.mockResolvedValueOnce("salt"); bcrypt.hash.mockResolvedValueOnce("hash"); const r=res(); await resetPasswordToken({body:{token:"valid",newPassword:"Password1!",confirmPassword:"Password1!"}},r); expect(pool.query).toHaveBeenCalledTimes(3); expect(r.json).toHaveBeenCalledWith({message:"Password reset successful."}); });
});
