import dotenv from "dotenv";
dotenv.config(); // Load .env first

import app from "./src/app"; // make sure this path is correct
import sequelize from "./src/database/connection";
import adminSeeder from "./src/admin-seeder";

const startServer = async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log("Database authenticated successfully!");

  await sequelize.sync({ force: false});
    console.log("DB synced ✔");
    await adminSeeder()
    console.log("Admin seeder finished ✔");


    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // exit if DB connection fails
  }
};

startServer();
