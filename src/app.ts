import express from "express";
import sequelize from "./config/database";

import userRoutes from "./routes/userRoutes";
import parkingSpaceRoutes from "./routes/parkingSpaceRoutes";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/parking-spaces", parkingSpaceRoutes);

sequelize
  .sync()
  .catch((err) => console.error("Failed to connect with database: ", err));

export default app;
