jest.mock("../../config/db", () => ({ query: jest.fn() }));
jest.mock("../../config/cache", () => ({ get: jest.fn(), set: jest.fn(), del: jest.fn() }));
const pool=require("../../config/db");
const {dashboard,publicDashboard,postArticle,getArticles,getCatchedArticles,article,getArticle,userArticles,deleteArticle,editArticle}=require("../../controllers/article");
const res=()=>({status:jest.fn().mockReturnThis(),json:jest.fn()});
const articleRow={id:1,title:"Hello World",category:"News",status:"published"};
// Reset queued query responses as well as call history between controller tests.
beforeEach(()=>{jest.resetAllMocks();jest.spyOn(console,"error").mockImplementation();}); afterEach(()=>jest.restoreAllMocks());
describe("dashboard",()=>{
 it("returns article stats and profile completion",async()=>{pool.query.mockResolvedValueOnce({rows:[{total:"4"}]}).mockResolvedValueOnce({rows:[{total:"2"}]}).mockResolvedValueOnce({rows:[{total:"1"}]}).mockResolvedValueOnce({rows:[{total:"3"}]}).mockResolvedValueOnce({rows:[articleRow]}).mockResolvedValueOnce({rows:[{username:"writer",display_name:"Writer",profile_photo:"photo"}]});const r=res();await dashboard({userId:1},r);expect(r.status).toHaveBeenCalledWith(200);expect(r.json).toHaveBeenCalledWith(expect.objectContaining({stats:{totalArticles:4,published:2,drafts:1,categories:3},profile:expect.objectContaining({completion:55,canPublish:true})}));});
 it("returns 404 when no profile exists",async()=>{for(let i=0;i<5;i++)pool.query.mockResolvedValueOnce({rows:[{total:"0"}]});pool.query.mockResolvedValueOnce({rows:[]}).mockResolvedValueOnce({rows:[]});const r=res();await dashboard({userId:1},r);expect(r.status).toHaveBeenCalledWith(404);});
});
describe("publicDashboard",()=>{
 it("returns latest published articles",async()=>{pool.query.mockResolvedValueOnce({rows:[articleRow]});const r=res();await publicDashboard({},r);expect(r.json).toHaveBeenCalledWith({latestArticles:[articleRow]});});
 it("returns 500 on query failure",async()=>{pool.query.mockRejectedValueOnce(new Error("db"));const r=res();await publicDashboard({},r);expect(r.status).toHaveBeenCalledWith(500);});
});
describe("postArticle",()=>{
 it("requires title and content",async()=>{const r=res();await postArticle({body:{},userId:1},r);expect(r.status).toHaveBeenCalledWith(400);});
 it("creates a published article with a slug",async()=>{pool.query.mockResolvedValueOnce({rows:[{...articleRow,slug:"hello-world"}]});const r=res();await postArticle({userId:1,body:{title:"Hello World!",content:"Text",status:"published"}},r);expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO articles"),["Hello World!","hello-world",null,"Text",null,null,1,"published"]);expect(r.status).toHaveBeenCalledWith(201);});
});
const pagedTests=(name,handler)=>describe(name,()=>{
 it("returns paginated published articles",async()=>{pool.query.mockResolvedValueOnce({rows:[{count:"10"}]}).mockResolvedValueOnce({rows:[articleRow]});const r=res();await handler({query:{page:"2",limit:"5"}},r);expect(r.json).toHaveBeenCalledWith({currentPage:2,totalPages:2,totalArticles:10,articles:[articleRow]});});
 it("returns 500 when pagination queries fail",async()=>{pool.query.mockRejectedValueOnce(new Error("db"));const r=res();await handler({query:{}},r);expect(r.status).toHaveBeenCalledWith(500);});
});
pagedTests("getArticles",getArticles); pagedTests("getCatchedArticles",getCatchedArticles);
describe("article",()=>{
 it("returns 404 when the author does not own the article",async()=>{pool.query.mockResolvedValueOnce({rows:[]});const r=res();await article({userId:1,params:{articleId:1}},r);expect(r.status).toHaveBeenCalledWith(404);});
 it("returns an owned article and related articles",async()=>{pool.query.mockResolvedValueOnce({rows:[articleRow]}).mockResolvedValueOnce({rows:[{id:2}]});const r=res();await article({userId:1,params:{articleId:1}},r);expect(r.json).toHaveBeenCalledWith({article:articleRow,relatedArticles:[{id:2}]});});
});
describe("getArticle",()=>{
 it("returns 404 for a missing public article",async()=>{pool.query.mockResolvedValueOnce({rows:[]});const r=res();await getArticle({params:{articleId:1}},r);expect(r.status).toHaveBeenCalledWith(404);});
 it("returns a published article and related articles",async()=>{pool.query.mockResolvedValueOnce({rows:[articleRow]}).mockResolvedValueOnce({rows:[{id:2}]});const r=res();await getArticle({params:{articleId:1}},r);expect(r.status).toHaveBeenCalledWith(200);expect(r.json).toHaveBeenCalledWith({article:articleRow,relatedArticles:[{id:2}]});});
});
describe("userArticles",()=>{
 it("returns paginated articles for one author",async()=>{pool.query.mockResolvedValueOnce({rows:[{count:"1"}]}).mockResolvedValueOnce({rows:[articleRow]});const r=res();await userArticles({userId:1,query:{}},r);expect(r.json).toHaveBeenCalledWith({currentPage:1,totalPages:1,totalArticles:1,articles:[articleRow]});});
 it("returns 500 when an author query fails",async()=>{pool.query.mockRejectedValueOnce(new Error("db"));const r=res();await userArticles({userId:1,query:{}},r);expect(r.status).toHaveBeenCalledWith(500);});
});
describe("deleteArticle",()=>{
 it("returns 404 for a missing article",async()=>{pool.query.mockResolvedValueOnce({rows:[]});const r=res();await deleteArticle({params:{id:1}},r);expect(r.status).toHaveBeenCalledWith(404);});
 it("deletes an existing article",async()=>{pool.query.mockResolvedValueOnce({rows:[articleRow]});const r=res();await deleteArticle({params:{id:1}},r);expect(r.json).toHaveBeenCalledWith({message:"Article deleted successfully"});});
});
describe("editArticle",()=>{
 it("returns 404 when the user does not own the article",async()=>{pool.query.mockResolvedValueOnce({rows:[]});const r=res();await editArticle({userId:1,params:{id:1},body:{}},r);expect(r.status).toHaveBeenCalledWith(404);});
 it("updates article fields for its author",async()=>{const updated={...articleRow,title:"Updated"};pool.query.mockResolvedValueOnce({rows:[updated]});const r=res();await editArticle({userId:1,params:{id:1},body:{title:"Updated",status:"draft"}},r);expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE articles"),["Updated","updated",null,null,null,null,"draft",1,1]);expect(r.status).toHaveBeenCalledWith(200);});
});
