import cron from "node-cron";
import { Appointment } from "../models/index.js";
import { catchJob } from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

const autoCompleteAppointments = catchJob("autoCompleteAppointments", async () => {
  const result = await Appointment.updateMany(
    { date: { $lt: new Date() }, status: "confirmed" },
    { status: "completed" }
  );
  logger.info(`[Job] Marked ${result.modifiedCount} appointments as completed.`);
});

// Runs every day at midnight
export const startAppointmentJobs = () => {
  cron.schedule("0 0 * * *", autoCompleteAppointments);
};
