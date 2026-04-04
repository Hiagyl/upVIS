const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");

module.exports = async ({ expressApp }) => {
  await mongooseLoader();
  console.log("✌️ DB loaded and connected!");

  await expressLoader({ app: expressApp });
  console.log("✌️ Express loaded!");
};
