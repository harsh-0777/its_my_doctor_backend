import * as doctorService from "../../services/doctor/index.js";
import { asyncHandler, ApiResponse } from "../../utils/index.js";
import { HTTP_STATUS, DOCTOR_MESSAGES } from "../../constants/index.js";

export const getAllDoctors = asyncHandler(async (req, res) => {
  const result = await doctorService.getAllDoctors(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, DOCTOR_MESSAGES.FETCHED, result));
});

export const getDoctorById = asyncHandler(async (req, res) => {
  const result = await doctorService.getDoctorById(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, DOCTOR_MESSAGES.FETCHED, result));
});

export const createDoctor = asyncHandler(async (req, res) => {
  const result = await doctorService.createDoctor(req.user.id, req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, DOCTOR_MESSAGES.CREATED, result));
});

export const updateDoctor = asyncHandler(async (req, res) => {
  const result = await doctorService.updateDoctor(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, DOCTOR_MESSAGES.UPDATED, result));
});

export const deleteDoctor = asyncHandler(async (req, res) => {
  await doctorService.deleteDoctor(req.params.id);
  res.status(HTTP_STATUS.NO_CONTENT).send();
});
