const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const articleRoute = require("./routes/article")
const profileRoute = require("./routes/profile")

//Import PG
require("./config/db")

dotenv.config();
const app = express()

app.use(express.json())

//Cors
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174"
]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS!"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

//Cookie Parser
app.use(cookieParser());

//Routes
app.use("/publication-site/v1/auth", authRoute);
app.use("/publication-site/v1/article", articleRoute)
app.use("/publication-site/v1/profile", profileRoute)

// Start the server
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}