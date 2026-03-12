import type { Application } from "express"; // Explicitly import the type
import expressLoader from "./express.ts";
import mongooseLoader from "./mongoose.ts";

export default async ({
  expressApp,
}: {
  expressApp: Application;
}): Promise<void> => {
  await mongooseLoader();
  await expressLoader({ app: expressApp });
};
