import express from "express";
import cors from "cors";
import noteRoutes from "./routes/note-route.js";
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use(noteRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));