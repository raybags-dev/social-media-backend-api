const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const { mongoConnection } = require("./db/db.js");

// users router
const userRoute = require("./routes/users");
// auth router
const authRoute = require("./routes/auth");
// post router
const postRouter = require("./routes/posts");
// dot_env setup
dotenv.config();

// =========
// mongodb Connection
mongoConnection();
// ==========
// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// users router
app.use("/api/users", userRoute);
// auth router
app.use("/api/auth", authRoute);
// posts router
app.use("/api/posts", postRouter);

//   set up port
const PORT = process.env.PORT || 8800;
// connect to port
app.listen(PORT, () =>
  console.log(`backend app server is running on port ${PORT}`)
);
