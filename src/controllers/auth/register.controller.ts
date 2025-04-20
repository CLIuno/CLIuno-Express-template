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
            return res
                .status(400)
                .json({ error: "Invalid email address", status: "failed" });
        }

        const userExists = await myDataSource.getRepository(User).findOne({
            where: [{ username: req.body.username }, { email: req.body.email }],
        });

        if (userExists) {
            return res
                .status(400)
                .json({ error: "User already exists", status: "failed" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const role = await myDataSource.getRepository(Role).findOne({
            where: [{ name: "user" }],
        });

        if (!role) {
            return res
                .status(400)
                .json({ error: "Role does not exist", status: "failed" });
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
            message:
                "User created successfully and an email has been sent to you for verification",
            status: "success",
        });
    } catch (error: any) {
        logThisError(error);
        res.status(error.statusCode || 500).json({
            error: error.message || "Internal server error",
        });
    }
}
