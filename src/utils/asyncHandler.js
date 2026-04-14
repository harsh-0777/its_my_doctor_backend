import logger from "./logger.js";

// ─── For Express route handlers & middlewares ─────────────────────────────────
// Eliminates try/catch boilerplate — errors are forwarded to Express error middleware
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ─── For background jobs / cron tasks ────────────────────────────────────────
// Catches errors, logs them, and prevents the scheduler from crashing
export const catchJob = (jobName, fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    logger.error(`[Job:${jobName}] Failed`, { message: error.message, stack: error.stack });
  }
};

export default asyncHandler;
