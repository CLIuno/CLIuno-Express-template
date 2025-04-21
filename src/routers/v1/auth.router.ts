import { Router } from "express";

import { AuthController } from "@/controllers/auth/auth.controller";
import LoginController from "@/controllers/auth/login.controller";
import { OTPController } from "@/controllers/auth/otp.controller";
import RegisterController from "@/controllers/auth/register.controller";
import { ResetPasswordController } from "@/controllers/auth/resetPassword.controller";
import { ensureAuthenticated } from "@/middlewares/auth.middleware";

const router: Router = Router();

// 🔐 Authentication
router.post("/login", LoginController);
router.post("/register", RegisterController);
router.post("/logout", AuthController.logout);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/check-token", ensureAuthenticated, AuthController.checkToken);

// 📧 Email Verification
router.post("/send-verify-email", AuthController.sendVerifyEmail);
router.post("/verify-email", AuthController.verifyEmail);

// 🔑 Password Management
router.post("/forgot-password", ResetPasswordController.forgotPassword);
router.post("/reset-password", ResetPasswordController.resetPassword);
router.post(
    "/change-password",
    ensureAuthenticated,
    ResetPasswordController.changePassword,
);

// 🔐 OTP Management
router.post("/otp/verify", OTPController.otpVerify);
router.post("/otp/generate", ensureAuthenticated, OTPController.otpGenerate);
router.post("/otp/validate", ensureAuthenticated, OTPController.otpValidate);
router.post("/otp/disable", ensureAuthenticated, OTPController.otpDisable);

// Fallback for invalid requests
router.get("/", (req, res) => {
    res.status(400).json({
        status: "warning",
        message: "Invalid request",
    });
});

export default router;
