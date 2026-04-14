import { Doctor } from "../../models/index.js";
import { ApiError } from "../../utils/index.js";
import { DOCTOR_MESSAGES } from "../../constants/index.js";

export const getAllDoctors = async (query = {}) => {
  const { specialization, page = 1, limit = 10 } = query;
  const filter = {};
  if (specialization) filter.specialization = new RegExp(specialization, "i");

  const [doctors, total] = await Promise.all([
    Doctor.find(filter)
      .populate("user", "name email phone")
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Doctor.countDocuments(filter),
  ]);

  return { doctors, total, page: Number(page), limit: Number(limit) };
};

export const getDoctorById = async (id) => {
  const doctor = await Doctor.findById(id).populate("user", "name email phone");
  if (!doctor) throw ApiError.notFound(DOCTOR_MESSAGES.NOT_FOUND);
  return doctor;
};

export const createDoctor = async (userId, data) => {
  return Doctor.create({ user: userId, ...data });
};

export const updateDoctor = async (id, data) => {
  const doctor = await Doctor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!doctor) throw ApiError.notFound(DOCTOR_MESSAGES.NOT_FOUND);
  return doctor;
};

export const deleteDoctor = async (id) => {
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) throw ApiError.notFound(DOCTOR_MESSAGES.NOT_FOUND);
};
