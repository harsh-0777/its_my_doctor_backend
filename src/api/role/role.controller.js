import * as roleService from "../../services/role/index.js";
import { asyncHandler, ApiResponse } from "../../utils/index.js";
import { HTTP_STATUS, ROLE_MESSAGES } from "../../constants/index.js";

// GET /api/v1/roles — list all roles with their tab counts
export const getAllRoles = asyncHandler(async (req, res) => {
  const roles = await roleService.getAllRoles();
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, ROLE_MESSAGES.FETCHED, roles));
});

// POST /api/v1/roles — create a custom role
export const createRole = asyncHandler(async (req, res) => {
  const role = await roleService.createRole(req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, ROLE_MESSAGES.CREATED, role));
});

// PUT /api/v1/roles/:id — update a role's label / color (or name for custom roles)
export const updateRole = asyncHandler(async (req, res) => {
  const role = await roleService.updateRole(req.params.id, req.body);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, ROLE_MESSAGES.UPDATED, role));
});

// DELETE /api/v1/roles/:id — delete a custom role (system roles are protected)
export const deleteRole = asyncHandler(async (req, res) => {
  const result = await roleService.deleteRole(req.params.id);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, ROLE_MESSAGES.DELETED, result));
});

// PUT /api/v1/roles/:roleName/tabs/:tabId — assign (assign=true) or revoke a tab
export const toggleTabForRole = asyncHandler(async (req, res) => {
  const { roleName, tabId } = req.params;
  const assign = req.body.assign !== false; // default true
  const tab = await roleService.toggleTabForRole(tabId, roleName, assign);
  const msg = assign ? ROLE_MESSAGES.TAB_ASSIGNED : ROLE_MESSAGES.TAB_REVOKED;
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, msg, tab));
});
