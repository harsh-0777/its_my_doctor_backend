import { Router } from "express";
import { getAllRoles, createRole, updateRole, deleteRole, toggleTabForRole } from "../api/role/index.js";
import { protect, authorize } from "../middlewares/index.js";
import { ROLES } from "../constants/index.js";

const router = Router();

// All role endpoints require authentication.
// authorize(ROLES.SUPER_ADMIN) is used; the authorize middleware also lets
// super_admin through unconditionally, so this is safe and self-documenting.

// GET  /api/v1/roles              — list all roles (admin can view, super_admin manages)
router.get("/",    protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), getAllRoles);

// POST /api/v1/roles              — create a custom role
router.post("/",   protect, authorize(ROLES.SUPER_ADMIN), createRole);

// PUT  /api/v1/roles/:id          — update role label / color / name
router.put("/:id", protect, authorize(ROLES.SUPER_ADMIN), updateRole);

// DELETE /api/v1/roles/:id        — delete a custom role
router.delete("/:id", protect, authorize(ROLES.SUPER_ADMIN), deleteRole);

// PUT /api/v1/roles/:roleName/tabs/:tabId — toggle tab assignment for a role
router.put("/:roleName/tabs/:tabId", protect, authorize(ROLES.SUPER_ADMIN), toggleTabForRole);

export default router;
