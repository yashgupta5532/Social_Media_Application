const express = require("express");
const cookieParser=require('cookie-parser')
const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });

const app = express();

//using middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser())

//Importig routes
const post = require("./routes/postRoute");
const user = require("./routes/userRoute");

//using routes
app.use("/api/v1/post", post);
app.use("/api/v1/user", user);

module.exports = app;
