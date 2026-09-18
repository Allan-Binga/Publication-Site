jest.mock("../../config/db", () => ({ query: jest.fn() }));
const pool=require("../../config/db"); const {getProfile,editProfile}=require("../../controllers/profile"); const res=()=>({status:jest.fn().mockReturnThis(),json:jest.fn()});
beforeEach(()=>{jest.clearAllMocks();jest.spyOn(console,"error").mockImplementation();}); afterEach(()=>jest.restoreAllMocks());
describe("getProfile",()=>{
 it("returns a profile with its user email",async()=>{const profile={id:1,email:"a@b.com"};pool.query.mockResolvedValueOnce({rows:[profile]});const r=res();await getProfile({userId:1},r);expect(pool.query).toHaveBeenCalledWith(expect.any(String),[1]);expect(r.json).toHaveBeenCalledWith({profile});});
 it("returns 500 when profile lookup fails",async()=>{pool.query.mockRejectedValueOnce(new Error("db"));const r=res();await getProfile({userId:1},r);expect(r.status).toHaveBeenCalledWith(500);});
});
describe("editProfile",()=>{
 it("returns 404 when the profile does not exist",async()=>{pool.query.mockResolvedValueOnce({rows:[]});const r=res();await editProfile({params:{id:1},body:{}},r);expect(r.status).toHaveBeenCalledWith(404);});
 it("updates profile fields and an uploaded photo",async()=>{const profile={id:1,username:"writer"};pool.query.mockResolvedValueOnce({rows:[profile]});const r=res();await editProfile({params:{id:1},body:{username:"writer"},file:{location:"https://image"}},r);expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE profiles"),["writer",null,null,null,"https://image",null,null,null,1]);expect(r.status).toHaveBeenCalledWith(200);});
});
