import app from "./src/app.js";
import config from "./src/config/index.js";
import { connectDB } from "./src/loaders/mongoose.js";

const start = async () => {
  await connectDB();

  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT} [${config.NODE_ENV}]`);
  });
};

start();
