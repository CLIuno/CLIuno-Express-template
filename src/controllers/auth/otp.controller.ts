import crypto from "crypto";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { encode } from "hi-base32";
import * as OTPAuth from "otpauth";

import { myDataSource } from "@/database/app-data-source";
import { User } from "@/entities/user.entity";
import { emailValidate } from "@/helpers/email-validator";

dotenv.config();

export const OTPController = {
    otpGenerate: async (req: Request, res: Response): Promise<void> => {
        try {
            const { usernameOrEmail } = req.body;
            if (!usernameOrEmail) {
                res.status(400).json({
                    status: "error",
                    message: "usernameOrEmail is required",
                });
                return;
            }

            const isEmail = emailValidate(usernameOrEmail);
            const user = await myDataSource
                .getRepository(User)
                .findOneBy(
                    isEmail
                        ? { email: usernameOrEmail }
                        : { username: usernameOrEmail },
                );

            if (!user) {
                res.status(404).json({
                    status: "error",
                    message: "User not found",
                });
                return;
            }

            const base32_secret = generateBase32Secret();
            const totp = new OTPAuth.TOTP({
                issuer: process.env.FRONTEND_URL!,
                label: user.username,
                algorithm: "SHA1",
                digits: 6,
                secret: base32_secret,
            });

            const otpauth_url = totp.toString();

            user.otp_auth_url = otpauth_url;
            user.otp_base32 = base32_secret;
            await myDataSource.getRepository(User).save(user);

            res.status(200).json({
                status: "success",
                base32: base32_secret,
                otpauth_url,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },

    otpDisable: async (req: Request, res: Response): Promise<void> => {
        try {
            const { usernameOrEmail } = req.body;
            if (!usernameOrEmail) {
                res.status(400).json({
                    status: "error",
                    message: "usernameOrEmail is required",
                });
                return;
            }

            const isEmail = emailValidate(usernameOrEmail);
            const user = await myDataSource
                .getRepository(User)
                .findOneBy(
                    isEmail
                        ? { email: usernameOrEmail }
                        : { username: usernameOrEmail },
                );

            if (!user) {
                res.status(404).json({
                    status: "error",
                    message: "User not found",
                });
                return;
            }

            user.is_otp_enabled = false;
            await myDataSource.getRepository(User).save(user);

            res.status(200).json({
                status: "success",
                message: "OTP disabled successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },

    otpVerify: async (req: Request, res: Response): Promise<void> => {
        try {
            const { usernameOrEmail, token } = req.body;
            if (!usernameOrEmail) {
                res.status(400).json({
                    status: "error",
                    message: "usernameOrEmail is required",
                });
                return;
            }

            const isEmail = emailValidate(usernameOrEmail);
            const user = await myDataSource
                .getRepository(User)
                .findOneBy(
                    isEmail
                        ? { email: usernameOrEmail }
                        : { username: usernameOrEmail },
                );

            if (!user) {
                res.status(404).json({
                    status: "error",
                    message: "Token is invalid or user does not exist",
                });
                return;
            }

            const totp = new OTPAuth.TOTP({
                issuer: process.env.FRONTEND_URL!,
                label: user.username,
                algorithm: "SHA1",
                digits: 6,
                secret: user.otp_base32!,
            });

            const delta = totp.validate({ token });
            if (delta === null) {
                res.status(401).json({
                    status: "error",
                    message: "Authentication failed",
                });
                return;
            }

            user.is_otp_verified = true;
            user.is_otp_enabled = true;
            await myDataSource.getRepository(User).save(user);

            res.status(200).json({
                status: "success",
                message: "OTP verified successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },

    otpValidate: async (req: Request, res: Response): Promise<void> => {
        try {
            const { usernameOrEmail, token } = req.body;
            if (!usernameOrEmail) {
                res.status(400).json({
                    status: "error",
                    message: "usernameOrEmail is required",
                });
                return;
            }

            const isEmail = emailValidate(usernameOrEmail);
            const user = await myDataSource
                .getRepository(User)
                .findOneBy(
                    isEmail
                        ? { email: usernameOrEmail }
                        : { username: usernameOrEmail },
                );

            if (!user) {
                res.status(404).json({
                    status: "error",
                    message: "User not found",
                });
                return;
            }

            if (!user.is_otp_enabled) {
                res.status(400).json({
                    status: "error",
                    message: "OTP is not enabled for this user",
                });
                return;
            }

            const totp = new OTPAuth.TOTP({
                issuer: process.env.FRONTEND_URL!,
                label: user.username,
                algorithm: "SHA1",
                digits: 6,
                secret: user.otp_base32!,
            });

            const delta = totp.validate({ token, window: 1 });
            if (delta === null) {
                res.status(401).json({
                    status: "error",
                    message: "Invalid token",
                });
                return;
            }

            res.status(200).json({
                status: "success",
                message: "Token is valid",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },
};

const generateBase32Secret = (): string => {
    const buffer = crypto.randomBytes(15);
    return encode(buffer).replace(/=/g, "").substring(0, 24);
};
