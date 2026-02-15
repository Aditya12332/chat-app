import express from "express"; 
import { login, signup, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/update-profile", protectRoute, updateProfile);

router.get("/check",protectRoute, checkauth);

export default router;