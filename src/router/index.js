import authRoutes        from "./auth.routes.js";
import doctorRoutes      from "./doctor.routes.js";
import appointmentRoutes from "./appointment.routes.js";
import patientRoutes     from "./patient.routes.js";
import contactRoutes     from "./contact.routes.js";

const API_PREFIX = "/api/v1";

export const mountRoutes = (app) => {
  app.use(`${API_PREFIX}/auth`,         authRoutes);
  app.use(`${API_PREFIX}/doctors`,      doctorRoutes);
  app.use(`${API_PREFIX}/appointments`, appointmentRoutes);
  app.use(`${API_PREFIX}/patients`,     patientRoutes);
  app.use(`${API_PREFIX}/contact`,      contactRoutes);
};
