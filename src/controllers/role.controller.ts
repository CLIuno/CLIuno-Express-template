import { Request, Response } from "express";
import { myDataSource } from "@/database/app-data-source";
import { Role } from "@/entities/role.entity";
import { User } from "@/entities/user.entity";

const roleRepository = myDataSource.getRepository(Role);
const userRepository = myDataSource.getRepository(User);

export const RoleController = {
    getAll: async (_req: Request, res: Response) => {
        const roles = await roleRepository.find();
        res.status(200).json({
            status: "success",
            message: "Roles fetched successfully",
            data: { roles },
        });
    },

    getById: async (req: Request, res: Response) => {
        const role = await roleRepository.findOneBy({ id: req.params.id });
        if (!role) {
            res.status(404).json({
                status: "warning",
                message: "Role not found",
            });
        }
        res.status(200).json({
            status: "success",
            message: "Role fetched successfully",
            data: { role },
        });
    },

    create: async (req: Request, res: Response) => {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({
                status: "warning",
                message: "Role name is required",
            });
        }

        const existingRole = await roleRepository.findOneBy({ name });
        if (existingRole) {
            res.status(400).json({
                status: "warning",
                message: "Role already exists",
            });
        }

        const newRole = roleRepository.create({ name });
        const savedRole = await roleRepository.save(newRole);

        res.status(201).json({
            status: "success",
            message: "Role created successfully",
            data: { savedRole },
        });
    },

    update: async (req: Request, res: Response) => {
        const role = await roleRepository.findOneBy({ id: req.params.id });
        if (!role) {
            res.status(404).json({
                status: "warning",
                message: "Role not found",
            });
        }

        if (!role) {
            res.status(404).json({
                status: "warning",
                message: "Role not found",
            });
            return;
        }

        roleRepository.merge(role, req.body);
        const updatedRole = await roleRepository.save(role);

        res.status(200).json({
            status: "success",
            message: "Role updated successfully",
            data: { updatedRole },
        });
    },

    delete: async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                status: "warning",
                message: "Role ID is required",
            });
        }

        const role = await roleRepository.findOneBy({ id });
        if (!role) {
            res.status(404).json({
                status: "warning",
                message: "Role not found",
            });
        }

        if (id) {
            await roleRepository.delete(id);
        } else {
            res.status(400).json({
                status: "warning",
                message: "Valid Role ID is required",
            });
            return;
        }

        res.status(200).json({
            status: "success",
            message: "Role deleted successfully",
        });
    },

    getUsersByRoleId: async (req: Request, res: Response) => {
        const { role_id } = req.body;

        if (!role_id) {
            res.status(400).json({
                status: "warning",
                message: "Role ID is required",
            });
        }

        const role = await roleRepository.findOneBy({ id: role_id });
        if (!role) {
            res.status(404).json({
                status: "warning",
                message: "Role not found",
            });
        }

        const users = await userRepository.find({
            where: { role: { id: role_id } },
        });

        res.status(200).json({
            status: "success",
            message: "Users found",
            data: { users },
        });
    },
};
