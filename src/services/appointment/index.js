import { Appointment } from "../../models/index.js";
import { ApiError } from "../../utils/index.js";
import { APPOINTMENT_MESSAGES } from "../../constants/index.js";

export const getAllAppointments = async (query = {}) => {
  const { status, doctorId, patientId, page = 1, limit = 10 } = query;
  const filter = {};
  if (status)    filter.status  = status;
  if (doctorId)  filter.doctor  = doctorId;
  if (patientId) filter.patient = patientId;

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate("patient", "name email")
      .populate({ path: "doctor", populate: { path: "user", select: "name email" } })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ date: -1 }),
    Appointment.countDocuments(filter),
  ]);

  return { appointments, total, page: Number(page), limit: Number(limit) };
};

export const getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate("patient", "name email")
    .populate({ path: "doctor", populate: { path: "user", select: "name email" } });
  if (!appointment) throw ApiError.notFound(APPOINTMENT_MESSAGES.NOT_FOUND);
  return appointment;
};

export const bookAppointment = async (patientId, data) => {
  return Appointment.create({ patient: patientId, ...data });
};

export const updateAppointment = async (id, data) => {
  const appointment = await Appointment.findByIdAndUpdate(id, data, { new: true });
  if (!appointment) throw ApiError.notFound(APPOINTMENT_MESSAGES.NOT_FOUND);
  return appointment;
};

export const cancelAppointment = async (id) => {
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status: "cancelled" },
    { new: true }
  );
  if (!appointment) throw ApiError.notFound(APPOINTMENT_MESSAGES.NOT_FOUND);
  return appointment;
};
