import { Router } from "express";
import { getAllPatients, getPatientById, updatePatient, deletePatient } from "../api/patient/index.js";
import { protect, authorize } from "../middlewares/index.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.use(protect);

router.get("/",     authorize(ROLES.ADMIN, ROLES.DOCTOR), getAllPatients);
router.get("/:id",                                         getPatientById);
router.put("/:id",  authorize(ROLES.ADMIN, ROLES.PATIENT), updatePatient);
router.delete("/:id", authorize(ROLES.ADMIN),              deletePatient);

export default router;
