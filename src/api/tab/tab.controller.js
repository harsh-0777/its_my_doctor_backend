import * as tabService from "../../services/tab/index.js";
import { asyncHandler, ApiResponse } from "../../utils/index.js";
import { HTTP_STATUS, TAB_MESSAGES }  from "../../constants/index.js";

// GET /api/v1/tabs/me — returns accessible tabs for the authenticated user
export const getMyTabs = asyncHandler(async (req, res) => {
  const tabs = await tabService.getTabsForRole(req.user.role);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, TAB_MESSAGES.FETCHED, tabs));
});

// GET /api/v1/tabs — admin: returns all tabs with optional filters
export const getAllTabs = asyncHandler(async (req, res) => {
  const tabs = await tabService.getAllTabs(req.query);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, TAB_MESSAGES.FETCHED, tabs));
});

// PUT /api/v1/tabs/:id — admin: update a tab's metadata or access config
export const updateTab = asyncHandler(async (req, res) => {
  const tab = await tabService.updateTab(req.params.id, req.body);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, TAB_MESSAGES.UPDATED, tab));
});
