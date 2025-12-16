import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.ts";

const startServer = () => {
  const port = process.env.PORT || 8000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
