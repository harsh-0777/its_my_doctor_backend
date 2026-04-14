import * as appointmentService from "../../services/appointment/index.js";
import { asyncHandler, ApiResponse } from "../../utils/index.js";
import { HTTP_STATUS, APPOINTMENT_MESSAGES } from "../../constants/index.js";

export const getAllAppointments = asyncHandler(async (req, res) => {
  const result = await appointmentService.getAllAppointments(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, APPOINTMENT_MESSAGES.FETCHED, result));
});

export const getAppointmentById = asyncHandler(async (req, res) => {
  const result = await appointmentService.getAppointmentById(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, APPOINTMENT_MESSAGES.FETCHED, result));
});

export const bookAppointment = asyncHandler(async (req, res) => {
  const result = await appointmentService.bookAppointment(req.user.id, req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, APPOINTMENT_MESSAGES.BOOKED, result));
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const result = await appointmentService.updateAppointment(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, APPOINTMENT_MESSAGES.UPDATED, result));
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const result = await appointmentService.cancelAppointment(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, APPOINTMENT_MESSAGES.CANCELLED, result));
});
