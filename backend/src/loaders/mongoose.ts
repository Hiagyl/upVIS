import mongoose from "mongoose";
import config from "../config";
import { Db } from "mongodb";

export default async (): Promise<Db> => {
  // Mongoose 6+ always behaves as if useNewUrlParser and useUnifiedTopology are true
  const connection = await mongoose.connect(config.databaseURL as string);

  // Return the database object so other loaders can use it if needed
  return connection.connection.db as Db;
};
