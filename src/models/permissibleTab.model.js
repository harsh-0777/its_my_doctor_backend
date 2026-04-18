import mongoose from "mongoose";

const TAB_GROUPS = [
  "utility",
  "main_nav",
  "company",
  "dashboard",
  "admin",
  "super_admin",
];

const permissibleTabSchema = new mongoose.Schema(
  {
    // ── Identifiers ────────────────────────────────────────────────────────────
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // e.g. "find_doctor"
    },
    label: {
      type: String,
      required: true,
      trim: true,
      // e.g. "Find Doctor"
    },
    tabName: {
      type: String,
      required: true,
      trim: true,
      // e.g. "Find Doctor Page"
    },

    // ── Routing — this is both the browser route AND the access identifier ─────
    path: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // e.g. "/find-doctor"
    },

    // ── UI metadata ───────────────────────────────────────────────────────────
    icon: {
      type: String,
      default: "circle",
      trim: true,
    },
    group: {
      type: String,
      enum: TAB_GROUPS,
      required: true,
      // "utility"   — auth pages, home (not shown in any nav)
      // "main_nav"  — header navigation
      // "company"   — footer / company pages
      // "dashboard" — post-login sidebar
      // "admin"     — admin panel sidebar
    },
    order: {
      type: Number,
      default: 99,
      // used to sort tabs within a group
    },

    // ── Access control ────────────────────────────────────────────────────────
    roles: {
      type: [String],
      default: [],
      // [] with isPublic:true  → accessible by everyone (no auth required)
      // ["patient"]            → only patients (auth required)
      // ["admin","doctor"]     → admin + doctor (auth required)
    },
    isPublic: {
      type: Boolean,
      default: false,
      // true  → accessible without authentication
      // false → authentication + role check required
    },

    // ── Admin controls ────────────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
      // admin can soft-disable any tab globally
    },
  },
  { timestamps: true },
);

// ── Indexes ───────────────────────────────────────────────────────────────────
permissibleTabSchema.index({ group: 1, order: 1 });
permissibleTabSchema.index({ roles: 1, isActive: 1 });

export default mongoose.model("PermissibleTab", permissibleTabSchema);
