import { config as readEnv } from "dotenv";
import { join } from "path";

const envTestinfFile = join(__dirname, "../../../../.env.testing");

readEnv({ path: envTestinfFile });

export const config = {
  db: {
    vendor: process.env.DB_VENDOR as any,
    host: process.env.DB_HOST,
    logging: process.env.DB_LOGGING === "true",
  },
};
