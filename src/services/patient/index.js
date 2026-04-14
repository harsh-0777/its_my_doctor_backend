import { Patient } from "../../models/index.js";
import { ApiError } from "../../utils/index.js";
import { PATIENT_MESSAGES } from "../../constants/index.js";

export const getAllPatients = async (query = {}) => {
  const { page = 1, limit = 10 } = query;

  const [patients, total] = await Promise.all([
    Patient.find()
      .populate("user", "name email phone")
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Patient.countDocuments(),
  ]);

  return { patients, total, page: Number(page), limit: Number(limit) };
};

export const getPatientById = async (id) => {
  const patient = await Patient.findById(id).populate("user", "name email phone");
  if (!patient) throw ApiError.notFound(PATIENT_MESSAGES.NOT_FOUND);
  return patient;
};

export const updatePatient = async (id, data) => {
  const patient = await Patient.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!patient) throw ApiError.notFound(PATIENT_MESSAGES.NOT_FOUND);
  return patient;
};

export const deletePatient = async (id) => {
  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) throw ApiError.notFound(PATIENT_MESSAGES.NOT_FOUND);
};
