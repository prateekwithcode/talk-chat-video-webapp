import express from "express";
import "dotenv/config";
import {connectDB} from "./lib/dbs.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/user.route.js"
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/",authRoutes);
app.use("api/user/",userRoutes);
app.use("api/chat/",chatRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
});