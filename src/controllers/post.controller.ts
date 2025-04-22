import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

import { myDataSource } from "@/database/app-data-source";
import { Post } from "@/entities/post.entity";
import { User } from "@/entities/user.entity";
import logThisError from "@/helpers/error-logger";

export const PostController = {
    getCurrentUserPosts: async (req: Request, res: Response): Promise<void> => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                status: "error",
                message: "No token provided",
            });
            return;
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2) {
            res.status(401).json({ status: "error", message: "Token error" });
            return;
        }

        const [scheme, token] = parts;
        if (!scheme || !/^Bearer$/i.test(scheme)) {
            res.status(401).json({
                status: "error",
                message: "Token malformatted",
            });
            return;
        }

        try {
            const decoded = jwt.verify(
                token as string,
                process.env.JWT_SECRET_KEY as Secret,
                { ignoreExpiration: true },
            ) as { id: string };

            const user = await myDataSource
                .getRepository(User)
                .findOneBy({ id: decoded.id });

            if (!user) {
                res.status(404).json({
                    status: "error",
                    message: "User not found",
                });
                return;
            }

            const posts = await myDataSource.getRepository(Post).find({
                where: { user: { id: user.id } },
            });

            res.status(200).json({
                status: "success",
                message: "User posts fetched successfully",
                data: { posts },
            });
        } catch (error) {
            logThisError(error);
            res.status(401).json({ status: "error", message: "Invalid token" });
        }
    },

    getAll: async (req: Request, res: Response): Promise<void> => {
        const posts = await myDataSource.getRepository(Post).find();
        res.status(200).json({
            status: "success",
            message: "Posts fetched successfully",
            data: { posts },
        });
    },

    getById: async (req: Request, res: Response): Promise<void> => {
        const post = await myDataSource.getRepository(Post).findOneBy({
            id: req.params.id,
        });

        if (!post) {
            res.status(404).json({
                status: "error",
                message: "Post not found",
            });
            return;
        }

        res.status(200).json({
            status: "success",
            message: "Post fetched successfully",
            data: { post },
        });
    },

    create: async (req: Request, res: Response): Promise<void> => {
        const { title, content } = req.body;

        if (!title || !content) {
            res.status(400).json({
                status: "error",
                message: "Title and Content are required",
            });
            return;
        }

        const post = myDataSource
            .getRepository(Post)
            .create({ title, content });
        const result = await myDataSource.getRepository(Post).save(post);

        res.status(200).json({
            status: "success",
            message: "Post created successfully",
            data: { result },
        });
    },

    update: async (req: Request, res: Response): Promise<void> => {
        const post = await myDataSource.getRepository(Post).findOneBy({
            id: req.params.id,
        });

        if (!post) {
            res.status(404).json({
                status: "error",
                message: "Post not found",
            });
            return;
        }

        myDataSource.getRepository(Post).merge(post, req.body);
        await myDataSource.getRepository(Post).save(post);

        res.status(200).json({
            status: "success",
            message: "Post updated successfully",
        });
    },

    delete: async (req: Request, res: Response): Promise<void> => {
        if (!req.params.id) {
            res.status(400).json({
                status: "error",
                message: "Post ID is required",
            });
            return;
        }
        const result = await myDataSource
            .getRepository(Post)
            .delete(req.params.id);

        if (result.affected === 0) {
            res.status(404).json({
                status: "error",
                message: "Post not found or already deleted",
            });
            return;
        }

        res.status(200).json({
            status: "success",
            message: "Post deleted successfully",
        });
    },

    getUserByPostId: async (req: Request, res: Response): Promise<void> => {
        const { post_id } = req.body;

        if (!post_id) {
            res.status(400).json({
                status: "error",
                message: "Post ID is required",
            });
            return;
        }

        const post = await myDataSource.getRepository(Post).findOne({
            where: { id: post_id },
            relations: ["user"],
        });

        if (!post) {
            res.status(404).json({
                status: "error",
                message: "Post not found",
            });
            return;
        }

        res.status(200).json({
            status: "success",
            message: "User found",
            data: { user: post.user },
        });
    },
};
