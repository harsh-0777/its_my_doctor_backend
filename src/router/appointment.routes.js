import { Router } from "express";
import { getAllAppointments, getAppointmentById, bookAppointment, updateAppointment, cancelAppointment } from "../api/appointment/index.js";
import { protect, authorize } from "../middlewares/index.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.use(protect);

router.get("/",       authorize(ROLES.ADMIN, ROLES.DOCTOR), getAllAppointments);
router.get("/:id",                                           getAppointmentById);
router.post("/",      authorize(ROLES.PATIENT),              bookAppointment);
router.put("/:id",    authorize(ROLES.ADMIN, ROLES.DOCTOR),  updateAppointment);
router.patch("/:id/cancel",                                  cancelAppointment);

export default router;
