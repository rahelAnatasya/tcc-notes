import express from "express";
import { getAccessToken, logoutUser } from "../controllers/token-controller.js";

const router = express.Router();
router.get("/token", getAccessToken);
router.delete("/logout", logoutUser);

export default router;
