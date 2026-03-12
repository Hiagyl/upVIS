import express from "express";
import loaders from "./loaders";
import config from "./config";
import dotenv from "dotenv";

dotenv.config();
// require('dotenv').config();

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });

  const port = config.port;
  app.listen(port, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`
    ################################################
        Server listening on port: ${port} 🛡️
    ################################################
    `);
  });
}

startServer();
