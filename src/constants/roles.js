export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN:       "admin",
  DOCTOR:      "doctor",
  PATIENT:     "patient",
};

export const ROLE_LIST = Object.values(ROLES);

// Roles that are built-in and cannot be deleted
export const SYSTEM_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT];
