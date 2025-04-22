import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { ensureAuthenticated } from "@/middlewares/auth.middleware";
import { RoleMiddleware } from "@/middlewares/role.middleware";

const router: Router = Router();

// Authenticated User Routes
router.use(ensureAuthenticated);
router.get("/current", UserController.getCurrent);
router.patch("/current", UserController.updateCurrent);
router.delete("/current", UserController.deleteCurrent);
router.get("/username/:username", UserController.getByUsername);
router.get("/posts", UserController.getPostsByUserId);
router.get("/role", UserController.getRolesByUserId);
router.get("/:id", UserController.getById);

// 🔐 Admin Routes
router.get("/", RoleMiddleware.admin, UserController.getAll);
router.patch("/:id", RoleMiddleware.admin, UserController.update);
router.delete("/:id", RoleMiddleware.admin, UserController.delete);

// Catch-all or duplicated handler fix
router.get("/", (req, res) => {
    res.status(400).json({ status: "warning", message: "Invalid request" });
});

export default router;
