const express = require("express");
require("dotenv").config();

const connectDB = require("./db");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    credentials: true,
    origin: "",
  })
);

app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.send({ test: "This is a blog route!" });
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", postRoutes);

app.listen(PORT, () => {
  console.log(`The server is running in the port ${PORT}.`);
});
