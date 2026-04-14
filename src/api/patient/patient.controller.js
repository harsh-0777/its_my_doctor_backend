import * as patientService from "../../services/patient/index.js";
import { asyncHandler, ApiResponse } from "../../utils/index.js";
import { HTTP_STATUS, PATIENT_MESSAGES } from "../../constants/index.js";

export const getAllPatients = asyncHandler(async (req, res) => {
  const result = await patientService.getAllPatients(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, PATIENT_MESSAGES.FETCHED, result));
});

export const getPatientById = asyncHandler(async (req, res) => {
  const result = await patientService.getPatientById(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, PATIENT_MESSAGES.FETCHED, result));
});

export const updatePatient = asyncHandler(async (req, res) => {
  const result = await patientService.updatePatient(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, PATIENT_MESSAGES.UPDATED, result));
});

export const deletePatient = asyncHandler(async (req, res) => {
  await patientService.deletePatient(req.params.id);
  res.status(HTTP_STATUS.NO_CONTENT).send();
});
