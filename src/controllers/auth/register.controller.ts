import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Request, Response } from "express";

import { myDataSource } from "@/database/app-data-source";
import { Role } from "@/entities/role.entity";
import { User } from "@/entities/user.entity";
import { sendEmail } from "@/helpers/email-sender";
import { emailValidate } from "@/helpers/email-validator";
import logThisError from "@/helpers/error-logger";
import generateToken from "@/helpers/generate-token";
import { ValidateRegister } from "@/validators/auth/register.validator";

dotenv.config();

const saltRounds = 10;

export default async function RegisterController(req: Request, res: Response) {
    try {
        await ValidateRegister(req);

        if (!emailValidate(req.body.email)) {
            res.status(400).json({
                status: "warning",
                message: "Invalid email address",
            });
        }

        const userExists = await myDataSource.getRepository(User).findOne({
            where: [{ username: req.body.username }, { email: req.body.email }],
        });

        if (userExists) {
            res.status(400).json({
                status: "warning",
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const role = await myDataSource.getRepository(Role).findOne({
            where: [{ name: "user" }],
        });

        if (!role) {
            res.status(400).json({
                status: "error",
                message: "Role does not exist",
            });
        }

        const newUser: any = myDataSource.getRepository(User).create({
            ...req.body,
            password: hashedPassword,
            role: role,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await myDataSource.getRepository(User).save(newUser);

        // Send email verification
        generateToken().then((token) => {
            sendEmail.verifyEmail(req.body.email, token, newUser.id);
        });

        res.status(201).json({
            status: "success",
            message:
                "User created successfully and an email has been sent to you for verification",
        });
    } catch (error: any) {
        logThisError(error);
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Internal server error",
        });
    }
}
