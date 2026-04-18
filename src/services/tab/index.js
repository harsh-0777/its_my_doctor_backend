import { PermissibleTab } from "../../models/index.js";
import { ApiError }        from "../../utils/index.js";
import { TAB_MESSAGES }    from "../../constants/index.js";
import { ROLES }           from "../../constants/roles.js";

// ─── Get tabs accessible by a specific role ───────────────────────────────────
// super_admin → all active tabs (platform-wide access).
// Everyone else → isPublic:true OR role in tab.roles[].

export const getTabsForRole = async (role) => {
  if (role === ROLES.SUPER_ADMIN) {
    return PermissibleTab.find({ isActive: true })
      .sort({ order: 1 })
      .select("-__v -createdAt -updatedAt")
      .lean();
  }
  return PermissibleTab.find({
    isActive: true,
    $or: [
      { isPublic: true },
      { roles: { $in: [role] } },
    ],
  })
    .sort({ order: 1 })
    .select("-__v -createdAt -updatedAt")
    .lean();
};

// ─── Admin: get all tabs (with optional filters) ──────────────────────────────

export const getAllTabs = async (query = {}) => {
  const { group, isActive, isPublic } = query;
  const filter = {};
  if (group)                  filter.group    = group;
  if (isActive  !== undefined) filter.isActive  = isActive  === "true";
  if (isPublic  !== undefined) filter.isPublic  = isPublic  === "true";

  return PermissibleTab.find(filter).sort({ order: 1 }).lean();
};

// ─── Admin: update a tab ──────────────────────────────────────────────────────
// Only allows updating safe fields — key and path are immutable.

export const updateTab = async (id, data) => {
  const ALLOWED = ["label", "tabName", "icon", "group", "order", "roles", "isPublic", "isActive"];
  const update  = {};
  ALLOWED.forEach((field) => {
    if (data[field] !== undefined) update[field] = data[field];
  });

  const tab = await PermissibleTab.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
  if (!tab) throw ApiError.notFound(TAB_MESSAGES.NOT_FOUND);
  return tab;
};
