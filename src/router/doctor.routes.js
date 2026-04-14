import { Router } from "express";
import { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } from "../api/doctor/index.js";
import { protect, authorize } from "../middlewares/index.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.get("/",     getAllDoctors);
router.get("/:id",  getDoctorById);
router.post("/",    protect, authorize(ROLES.ADMIN),                  createDoctor);
router.put("/:id",  protect, authorize(ROLES.ADMIN, ROLES.DOCTOR),    updateDoctor);
router.delete("/:id", protect, authorize(ROLES.ADMIN),                deleteDoctor);

export default router;
