const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const articleRoute = require("./routes/article")
const profileRoute = require("./routes/profile")
const metricsRoute = require("./routes/metrics")

//Import PG
require("./config/db")

const app = express()

app.use(express.json())

//Cors
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://skirill.org",
  "https://www.skirill.org",
  "https://admin.skirill.org"

];


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Rejected Origin:", origin);
      callback(new Error("Not allowed by CORS!"));
    }
  },
  credentials: true,
};

app.use((req, res, next) => {
  console.log({
    method: req.method,
    url: req.originalUrl,
    origin: req.get("Origin"),
    referer: req.get("Referer"),
    userAgent: req.get("User-Agent"),
    remoteAddress: req.socket.remoteAddress,
  });
  next();
});

app.use(cors(corsOptions));

//Cookie Parser
app.use(cookieParser());

//Routes
app.use("/publication-site/v1/auth", authRoute);
app.use("/publication-site/v1/article", articleRoute)
app.use("/publication-site/v1/profile", profileRoute)
app.use("/publication-site/v1/metrics", metricsRoute)

// Start the server
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}