/**
 * Seed script — populates default users, system roles, and all PermissibleTabs.
 *
 * Run: npm run seed
 *
 * Safe to re-run: uses upsert (no duplicates).
 */

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "../src/config/index.js";

// ── Inline schemas (avoid circular imports in script context) ────────────────

const ALL_ROLES = ["super_admin", "admin", "doctor", "patient"];

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ALL_ROLES, default: "patient" },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiresAt: Date,
  refreshToken: String,
});
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    color: { type: String, default: "#6366f1" },
    isSystem: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

const permissibleTabSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    tabName: { type: String, required: true },
    path: { type: String, required: true, unique: true },
    icon: { type: String, default: "circle" },
    group: { type: String, required: true },
    order: { type: Number, default: 99 },
    roles: { type: [String], default: [] },
    isPublic: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
const PermissibleTab =
  mongoose.models.PermissibleTab ||
  mongoose.model("PermissibleTab", permissibleTabSchema);

// ── Seed data ────────────────────────────────────────────────────────────────

const USERS = [
  {
    name: "Super Admin",
    email: "superadmin@doctorapp.com",
    password: "SuperAdmin@123",
    role: "super_admin",
    isVerified: true,
  },
  {
    name: "Admin User",
    email: "admin@doctorapp.com",
    password: "Admin@123",
    role: "admin",
    isVerified: true,
  },
  {
    name: "Test Patient",
    email: "patient@doctorapp.com",
    password: "Patient@123",
    role: "patient",
    isVerified: true,
  },
  {
    name: "Test Doctor",
    email: "doctor@doctorapp.com",
    password: "Doctor@123",
    role: "doctor",
    isVerified: true,
  },
];

const SYSTEM_ROLES = [
  {
    name: "super_admin",
    label: "Super Admin",
    color: "#7c3aed",
    isSystem: true,
    isActive: true,
  },
  {
    name: "admin",
    label: "Admin",
    color: "#dc2626",
    isSystem: true,
    isActive: true,
  },
  {
    name: "doctor",
    label: "Doctor",
    color: "#0891b2",
    isSystem: true,
    isActive: true,
  },
  {
    name: "patient",
    label: "Patient",
    color: "#16a34a",
    isSystem: true,
    isActive: true,
  },
];

const TABS = [
  // ── Utility — auth pages + home (not shown in any nav) ──────────────────────
  {
    key: "home",
    label: "Home",
    tabName: "Home Page",
    path: "/",
    icon: "home",
    group: "utility",
    order: 1,
    isPublic: true,
    isActive: true,
    roles: [],
  },
  {
    key: "login",
    label: "Login",
    tabName: "Login Page",
    path: "/login",
    icon: "log-in",
    group: "utility",
    order: 2,
    isPublic: true,
    isActive: true,
    roles: [],
  },
  {
    key: "signup",
    label: "Sign Up",
    tabName: "Sign Up Page",
    path: "/signup",
    icon: "user-plus",
    group: "utility",
    order: 3,
    isPublic: true,
    isActive: true,
    roles: [],
  },
  {
    key: "verify_otp",
    label: "Verify OTP",
    tabName: "OTP Verification Page",
    path: "/verify-otp",
    icon: "shield",
    group: "utility",
    order: 4,
    isPublic: true,
    isActive: true,
    roles: [],
  },

  // ── Main Nav — shown in header for all visitors ──────────────────────────────
  {
    key: "find_doctor",
    label: "Find Doctor",
    tabName: "Find Doctor Page",
    path: "/find-doctor",
    icon: "stethoscope",
    group: "main_nav",
    order: 10,
    isPublic: true,
    isActive: true,
    roles: [],
  },
  {
    key: "video_consult",
    label: "Video Consultation",
    tabName: "Video Consultation Page",
    path: "/video-consultant",
    icon: "video",
    group: "main_nav",
    order: 11,
    isPublic: true,
    isActive: true,
    roles: [],
  },
  {
    key: "lab_tests",
    label: "Lab Tests",
    tabName: "Lab Tests Page",
    path: "/lab-tests",
    icon: "flask",
    group: "main_nav",
    order: 12,
    isPublic: true,
    isActive: true,
    roles: [],
  },

  // ── Company — footer links (public, not in header nav) ──────────────────────
  {
    key: "about",
    label: "About Us",
    tabName: "About Us Page",
    path: "/about",
    icon: "info",
    group: "company",
    order: 20,
    isPublic: true,
    isActive: true,
    roles: [],
  },
  {
    key: "careers",
    label: "Careers",
    tabName: "Careers Page",
    path: "/careers",
    icon: "briefcase",
    group: "company",
    order: 21,
    isPublic: true,
    isActive: true,
    roles: [],
  },
  {
    key: "press",
    label: "Press",
    tabName: "Press & Media Page",
    path: "/press",
    icon: "newspaper",
    group: "company",
    order: 22,
    isPublic: true,
    isActive: true,
    roles: [],
  },
  {
    key: "blog",
    label: "Blog",
    tabName: "Blog Page",
    path: "/blog",
    icon: "book-open",
    group: "company",
    order: 23,
    isPublic: true,
    isActive: true,
    roles: [],
  },
  {
    key: "contact",
    label: "Contact Us",
    tabName: "Contact Us Page",
    path: "/contact",
    icon: "mail",
    group: "company",
    order: 24,
    isPublic: true,
    isActive: true,
    roles: [],
  },
  {
    key: "legal",
    label: "Legal",
    tabName: "Legal & Privacy Page",
    path: "/legal",
    icon: "file-text",
    group: "company",
    order: 25,
    isPublic: true,
    isActive: true,
    roles: [],
  },

  // ── Dashboard — all authenticated roles ─────────────────────────────────────
  {
    key: "dashboard",
    label: "Dashboard",
    tabName: "Dashboard Page",
    path: "/dashboard",
    icon: "layout",
    group: "dashboard",
    order: 30,
    isPublic: false,
    isActive: true,
    roles: ["admin", "doctor", "patient"],
  },
  {
    key: "profile",
    label: "My Profile",
    tabName: "Profile Page",
    path: "/profile",
    icon: "user",
    group: "dashboard",
    order: 31,
    isPublic: false,
    isActive: true,
    roles: ["admin", "doctor", "patient"],
  },

  // ── Patient ──────────────────────────────────────────────────────────────────
  {
    key: "my_appointments",
    label: "My Appointments",
    tabName: "My Appointments Page",
    path: "/my-appointments",
    icon: "calendar",
    group: "dashboard",
    order: 40,
    isPublic: false,
    isActive: true,
    roles: ["patient"],
  },
  {
    key: "my_doctors",
    label: "My Doctors",
    tabName: "My Doctors Page",
    path: "/my-doctors",
    icon: "user-check",
    group: "dashboard",
    order: 41,
    isPublic: false,
    isActive: true,
    roles: ["patient"],
  },
  {
    key: "health_records",
    label: "Health Records",
    tabName: "Health Records Page",
    path: "/health-records",
    icon: "file-medical",
    group: "dashboard",
    order: 42,
    isPublic: false,
    isActive: true,
    roles: ["patient"],
  },

  // ── Doctor ───────────────────────────────────────────────────────────────────
  {
    key: "doctor_schedule",
    label: "My Schedule",
    tabName: "Doctor Schedule Page",
    path: "/doctor/schedule",
    icon: "clock",
    group: "dashboard",
    order: 50,
    isPublic: false,
    isActive: true,
    roles: ["doctor"],
  },
  {
    key: "doctor_patients",
    label: "My Patients",
    tabName: "Doctor Patients Page",
    path: "/doctor/patients",
    icon: "users",
    group: "dashboard",
    order: 51,
    isPublic: false,
    isActive: true,
    roles: ["doctor"],
  },
  {
    key: "doctor_appointments",
    label: "Appointments",
    tabName: "Doctor Appointments Page",
    path: "/doctor/appointments",
    icon: "calendar",
    group: "dashboard",
    order: 52,
    isPublic: false,
    isActive: true,
    roles: ["doctor"],
  },

  // ── Admin ────────────────────────────────────────────────────────────────────
  {
    key: "admin_users",
    label: "Manage Users",
    tabName: "User Management Page",
    path: "/admin/users",
    icon: "users",
    group: "admin",
    order: 60,
    isPublic: false,
    isActive: true,
    roles: ["admin"],
  },
  {
    key: "admin_doctors",
    label: "Manage Doctors",
    tabName: "Doctor Management Page",
    path: "/admin/doctors",
    icon: "stethoscope",
    group: "admin",
    order: 61,
    isPublic: false,
    isActive: true,
    roles: ["admin"],
  },
  {
    key: "admin_appointments",
    label: "All Appointments",
    tabName: "Appointments Admin Page",
    path: "/admin/appointments",
    icon: "calendar",
    group: "admin",
    order: 62,
    isPublic: false,
    isActive: true,
    roles: ["admin"],
  },
  {
    key: "admin_contacts",
    label: "Contact Messages",
    tabName: "Contact Messages Page",
    path: "/admin/contacts",
    icon: "mail",
    group: "admin",
    order: 63,
    isPublic: false,
    isActive: true,
    roles: ["admin"],
  },
  {
    key: "admin_tabs",
    label: "Manage Tabs",
    tabName: "Tab Management Page",
    path: "/admin/tabs",
    icon: "settings",
    group: "admin",
    order: 64,
    isPublic: false,
    isActive: true,
    roles: ["admin"],
  },

  // ── Super Admin ──────────────────────────────────────────────────────────────
  {
    key: "super_admin_dashboard",
    label: "Super Admin",
    tabName: "Super Admin Dashboard",
    path: "/super-admin",
    icon: "shield",
    group: "super_admin",
    order: 70,
    isPublic: false,
    isActive: true,
    roles: ["super_admin"],
  },
];

// ── Runner ───────────────────────────────────────────────────────────────────

const seed = async () => {
  await mongoose.connect(config.MONGO_URI);
  console.log("✅  Connected to MongoDB");

  // ── Seed users ──────────────────────────────────────────────────────────────
  let userCreated = 0;
  let userSkipped = 0;
  for (const u of USERS) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      userSkipped++;
      continue;
    }
    await new User(u).save();
    userCreated++;
  }
  console.log(
    `👤  Users  — created: ${userCreated}, already exist: ${userSkipped}`,
  );

  // ── Seed system roles ────────────────────────────────────────────────────────
  let roleCreated = 0;
  let roleUpdated = 0;
  for (const r of SYSTEM_ROLES) {
    const result = await Role.updateOne(
      { name: r.name },
      { $set: r },
      { upsert: true },
    );
    if (result.upsertedCount > 0) roleCreated++;
    else if (result.modifiedCount > 0) roleUpdated++;
  }
  console.log(
    `🔑  Roles  — created: ${roleCreated}, updated: ${roleUpdated}, unchanged: ${SYSTEM_ROLES.length - roleCreated - roleUpdated}`,
  );

  // ── Seed tabs ───────────────────────────────────────────────────────────────
  let tabCreated = 0;
  let tabUpdated = 0;
  for (const t of TABS) {
    const result = await PermissibleTab.updateOne(
      { key: t.key },
      { $set: t },
      { upsert: true },
    );
    if (result.upsertedCount > 0) tabCreated++;
    else if (result.modifiedCount > 0) tabUpdated++;
  }
  console.log(
    `📑  Tabs   — created: ${tabCreated}, updated: ${tabUpdated}, unchanged: ${TABS.length - tabCreated - tabUpdated}`,
  );

  console.log("\n🎉  Seed complete!\n");
  console.log("Default login accounts:");
  console.log(
    "  superadmin@doctorapp.com  /  SuperAdmin@123  (role: super_admin)",
  );
  console.log("  admin@doctorapp.com       /  Admin@123       (role: admin)");
  console.log("  patient@doctorapp.com     /  Patient@123     (role: patient)");
  console.log("  doctor@doctorapp.com      /  Doctor@123      (role: doctor)");

  process.exit(0);
};

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
