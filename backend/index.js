import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import noteRoutes from "./routes/note-route.js";
import authRoutes from "./routes/auth-route.js";
import tokenRoutes from "./routes/token-route.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin: ['http://localhost:5000', 'https://tcc-notes-frontend-469569820136.us-central1.run.app'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use(noteRoutes);
app.use(authRoutes);
app.use(tokenRoutes);

app.listen(PORT, () => console.log(`Server berjalan pada port ${PORT}`));
