import { User } from "../../models/index.js";
import { asyncHandler, ApiResponse } from "../../utils/index.js";
import { HTTP_STATUS } from "../../constants/index.js";

// GET /api/v1/users — super_admin / admin: paginated user list with optional filters
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, isVerified, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (role)                    filter.role       = role;
  if (isVerified !== undefined) filter.isVerified = isVerified === "true";
  if (search) {
    const re = new RegExp(search, "i");
    filter.$or = [{ name: re }, { email: re }];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("name email role isVerified createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    User.countDocuments(filter),
  ]);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Users fetched successfully.", {
      users,
      total,
      page:  Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    }),
  );
});
