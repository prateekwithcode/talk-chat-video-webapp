import express from "express";
import "dotenv/config";
import {connectDB} from "./lib/dbs.js"
import authRoutes from "./routes/auth.route.js"

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/auth/",authRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
})