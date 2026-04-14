import EventEmitter from "events";

export const eventEmitter = new EventEmitter();

// Example: listen for appointment booked event
eventEmitter.on("appointment:booked", async (appointment) => {
  // Could send a confirmation email, push notification, etc.
  console.log(`[Event] Appointment booked: ${appointment._id}`);
});

eventEmitter.on("user:signup", async (user) => {
  console.log(`[Event] New user signed up: ${user.email}`);
});
