import { Router } from "express";
import { submitContact, getAllContacts, updateContactStatus } from "../api/contact/index.js";
import { protect, authorize } from "../middlewares/index.js";
import { ROLES } from "../constants/index.js";

const router = Router();

// Public — anyone can submit a contact message
router.post("/", submitContact);

// Admin only — view and manage incoming messages
router.get("/",     protect, authorize(ROLES.ADMIN), getAllContacts);
router.patch("/:id/status", protect, authorize(ROLES.ADMIN), updateContactStatus);

export default router;
