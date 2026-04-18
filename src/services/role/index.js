import { Role, PermissibleTab } from "../../models/index.js";
import { ApiError }             from "../../utils/index.js";

// ─── List all roles with their tab counts ────────────────────────────────────
export const getAllRoles = async () => {
  const roles = await Role.find().sort({ isSystem: -1, name: 1 }).lean();

  // Aggregate tab count per role name in one query
  const tabCounts = await PermissibleTab.aggregate([
    { $unwind: "$roles" },
    { $group: { _id: "$roles", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(tabCounts.map(({ _id, count }) => [_id, count]));

  return roles.map((r) => ({ ...r, tabCount: countMap[r.name] || 0 }));
};

// ─── Create a custom role ────────────────────────────────────────────────────
export const createRole = async ({ name, label, color }) => {
  const slug = name.toLowerCase().trim().replace(/\s+/g, "_");
  const exists = await Role.findOne({ name: slug });
  if (exists) throw ApiError.conflict(`Role "${slug}" already exists.`);
  return Role.create({ name: slug, label, color: color || "#6366f1", isSystem: false });
};

// ─── Update a role ───────────────────────────────────────────────────────────
export const updateRole = async (id, data) => {
  const role = await Role.findById(id);
  if (!role) throw ApiError.notFound("Role not found.");

  // System roles: only label and color are editable
  if (data.label !== undefined) role.label    = data.label;
  if (data.color !== undefined) role.color    = data.color;
  if (!role.isSystem) {
    if (data.name     !== undefined) role.name     = data.name.toLowerCase().trim();
    if (data.isActive !== undefined) role.isActive = data.isActive;
  }
  await role.save();
  return role;
};

// ─── Delete a custom role ────────────────────────────────────────────────────
export const deleteRole = async (id) => {
  const role = await Role.findById(id);
  if (!role)      throw ApiError.notFound("Role not found.");
  if (role.isSystem) throw ApiError.badRequest("System roles cannot be deleted.");

  // Remove this role name from every tab that has it
  await PermissibleTab.updateMany({ roles: role.name }, { $pull: { roles: role.name } });
  await role.deleteOne();
  return { deleted: true, name: role.name };
};

// ─── Assign or revoke a single tab for a role ───────────────────────────────
// assign: true  → add roleName to tab.roles[]
// assign: false → remove roleName from tab.roles[]
export const toggleTabForRole = async (tabId, roleName, assign) => {
  const update = assign
    ? { $addToSet: { roles: roleName } }
    : { $pull:     { roles: roleName } };

  const tab = await PermissibleTab.findByIdAndUpdate(tabId, update, { new: true });
  if (!tab) throw ApiError.notFound("Tab not found.");
  return tab;
};
