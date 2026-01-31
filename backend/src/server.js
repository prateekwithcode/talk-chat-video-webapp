import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/dbs.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;  

app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true  //allow frontend to send a cookies 
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/", authRoutes);
app.use("api/user/", userRoutes);
app.use("api/chat/", chatRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
