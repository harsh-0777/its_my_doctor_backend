import mongoose from "mongoose";

// Stores all roles — both system (built-in) and custom (created by super_admin).
// System roles: super_admin, admin, doctor, patient — isSystem:true, cannot be deleted.
// Custom roles: any role created via the API — isSystem:false, fully manageable.

const roleSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    label: {
      type:     String,
      required: true,
      trim:     true,
    },
    color: {
      type:    String,
      default: "#6366f1",
      // hex colour used in the UI to visually distinguish roles
    },
    isSystem: {
      type:    Boolean,
      default: false,
      // true → cannot be renamed or deleted; only label/color are editable
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Role", roleSchema);
