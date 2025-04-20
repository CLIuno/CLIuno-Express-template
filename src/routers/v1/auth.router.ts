import { Router } from "express";

import { AuthController } from "@/controllers/auth/auth.controller";
import LoginController from "@/controllers/auth/login.controller";
import { OTPController } from "@/controllers/auth/otp.controller";
import RegisterController from "@/controllers/auth/register.controller";
import { ResetPasswordController } from "@/controllers/auth/resetPassword.controller";
import { ensureAuthenticated } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.post("/login", LoginController);

router.post("/register", RegisterController);

router.post("/logout", AuthController.logout);

//Definition: This term describes the situation where a user is unable to recall their current password and needs to regain access to their account.
router.post("/reset-password", ResetPasswordController.resetPassword);
// Definition: This is the process used to create a new password for an account when the user has forgotten their current password
router.post("/forgot-password", ResetPasswordController.forgotPassword);
// Definition: This is the process by which a user updates their current password to a new one
router.post(
    "/change-password",
    ensureAuthenticated,
    ResetPasswordController.changePassword,
);

router.post("/send-verify-email", AuthController.sendVerifyEmail);

router.post("/verify-email", AuthController.verifyEmail);

router.post("/check-token", ensureAuthenticated, AuthController.checkToken);

router.post("/refresh-token", AuthController.refreshToken);

// OTP routes
router.post("/otp/verify", OTPController.otpVerify);

router.post("/otp/disable", ensureAuthenticated, OTPController.otpDisable);

router.post("/otp/validate", ensureAuthenticated, OTPController.otpValidate);

router.post("/otp/generate", ensureAuthenticated, OTPController.otpGenerate);

// Handle invalid request for the original path
router.get("/", (req, res) => {
    res.status(400).send("Invalid request");
});

export default router;
