import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Articles from "./pages/Articles"
import Article from "./pages/Article";
import NewArticle from "./pages/NewArticle";
import EditArticle from "./pages/EditArticle";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/PasswordReset";
import ChangePassword from "./pages/ChangePassword"
import About from "./pages/About";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/reset" element={<ResetPassword />} />
        <Route path="/password/change" element={<ChangePassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/new" element={<NewArticle />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/articles/article/:id" element={<Article />} />
        <Route path="/articles/article/edit/:id" element={<EditArticle />} />
      </Routes>
    </Router>
  )
}

export default App
