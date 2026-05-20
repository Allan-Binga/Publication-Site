import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Articles from "./pages/Articles"
import Article from "./pages/Article"
import About from "./pages/About"
import Home from "./pages/Home"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/article/:id" element={<Article/>}/>
      </Routes>
    </Router>
  )
}

export default App
