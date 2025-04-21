import { Router } from "express";

import { RoleController } from "@/controllers/role.controller";
import { RoleMiddleware } from "@/middlewares/role.middleware";

const router: Router = Router();

// All routes require admin access
router.use(RoleMiddleware.admin);

// Role CRUD
router.get("/", RoleController.getAll);
router.get("/:id", RoleController.getById);
router.post("/", RoleController.create);
router.patch("/:id", RoleController.update);
router.delete("/:id", RoleController.delete);

// Users by Role
router.get("/:role_id/users", RoleController.getUsersByRoleId);

// Fallback for invalid request
router.get("/", (req, res) => {
    res.status(400).json({ status: "warning", message: "Invalid request" });
});

export default router;
