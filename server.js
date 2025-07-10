import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
import express from "express";
const app = express();
import expressLayouts from "express-ejs-layouts";
import indexRouter from "./routes/index.routes.js";

app.set("view engine", "ejs");
app.set("views", "./views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));

import mongoose from "mongoose";
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.use("/", indexRouter);

app.listen(process.env.PORT || 3000);
