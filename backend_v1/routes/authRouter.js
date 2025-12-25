import express from "express";
import { 
    signup, 
    logIn, 
    logOut, 
    sendOtp, 
    verifyOtp, 
    resetPassword, 
    googleAuth 
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleWare.js";

const authRouter = express.Router();

// --- Auth ---
authRouter.post("/signup", signup);
authRouter.post("/login", logIn);
authRouter.get("/logout", logOut);

// --- Password Reset ---
authRouter.post("/sendotp", sendOtp);
authRouter.post("/verifyotp", verifyOtp);
authRouter.post("/resetpassword", resetPassword); // This should be protected

// --- OAuth ---
authRouter.post("/googleauth", googleAuth);

// --- Get Current User ---
// We'll keep our '/me' route here for fetching the user
import { getMe } from "../controllers/authController.js";
authRouter.get("/me", protect, getMe);

export default authRouter;