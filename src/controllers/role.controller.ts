import { Request, Response } from "express";

import { myDataSource } from "@/database/app-data-source";
import { Role } from "@/entities/role.entity";
import { User } from "@/entities/user.entity";

export const RoleController = {
    getAll: async (req: Request, res: Response) => {
        const results = await myDataSource.getRepository(Role).find();
        return res
            .status(200)
            .json({ message: "Roles fetched successfully", data: results });
    },
    getById: async (req: Request, res: Response) => {
        const results = await myDataSource.getRepository(Role).findOneBy({
            id: req.params.id,
        });
        return res
            .status(200)
            .json({ message: "Role fetched successfully", data: results });
    },
    create: async (req: Request, res: Response) => {
        const { name } = req.body; // Assuming 'name' is the unique field for the role

        // Check if the role already exists
        const existingRole = await myDataSource
            .getRepository(Role)
            .findOneBy({ name });
        if (!existingRole) {
            return res.status(400).json({ message: "Role already exists" });
        }
        // Create and save the new role
        const role = myDataSource.getRepository(Role).create(req.body);
        const results = await myDataSource.getRepository(Role).save(role);
        return res
            .status(200)
            .json({ message: "Role created successfully", data: results });
    },
    update: async (req: Request, res: Response) => {
        const role = await myDataSource.getRepository(Role).findOneBy({
            id: req.params.id,
        });
        myDataSource.getRepository(Role).merge(role as any, req.body);
        const results = await myDataSource
            .getRepository(Role)
            .save(role as any);
        return res
            .status(200)
            .json({ message: "Role updated successfully", data: results });
    },
    delete: async (req: any, res: Response) => {
        await myDataSource.getRepository(Role).delete(req.params.id);
        return res.status(200).json({ message: "Role deleted successfully" });
    },
    getUsersByRoleId: async (req: Request, res: Response) => {
        const { role_id } = req.body;

        if (!role_id) {
            return res.status(400).json({ message: "Role ID is required" });
        }

        const results = await myDataSource.getRepository(Role).findOneBy({
            id: role_id,
        });

        if (!results) {
            return res.status(404).json({ message: "Role not found" });
        }

        const users = await myDataSource.getRepository(User).find({
            where: { role: role_id },
        });

        if (!users) {
            return res.status(404).json({ message: "Users not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Users found",
            data: users,
        });
    },
};
