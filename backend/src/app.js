const express = require("express");
const loaders = require("./loaders"); // Node will automatically find index.js
const config = require("./config");
const dotenv = require("dotenv");

dotenv.config();

async function startServer() {
  const app = express();

  // Pass the express instance to your loaders
  await loaders({ expressApp: app });

  const port = config.port;

  app.listen(port, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
      return;
    }
    console.log(`
    ################################################
    🛡️  Server listening on port: ${port} 🛡️
    ################################################
        `);
  });
}

startServer();
