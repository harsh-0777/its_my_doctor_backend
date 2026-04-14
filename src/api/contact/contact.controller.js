import * as contactService from "../../services/contact/index.js";
import { asyncHandler, ApiResponse } from "../../utils/index.js";
import { HTTP_STATUS, CONTACT_MESSAGES } from "../../constants/index.js";

export const submitContact = asyncHandler(async (req, res) => {
  const result = await contactService.submitContact(req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, CONTACT_MESSAGES.SUBMITTED, result));
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const result = await contactService.getAllContacts(req.query);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, CONTACT_MESSAGES.FETCHED, result));
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const result = await contactService.updateContactStatus(req.params.id, req.body.status);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, CONTACT_MESSAGES.UPDATED, result));
});
