import { config as readEnv } from "dotenv";
import { join } from "path";

export type Config = {
  db: {
    vendor: any;
    host: string;
    logging: boolean;
  };
};

function makeConfig(envFile): Config {
  const output = readEnv({ path: envFile });

  return {
    db: {
      vendor: output.parsed.TEST_DB_VENDOR as any,
      host: output.parsed.TEST_DB_HOST,
      logging: output.parsed.TEST_DB_LOGGING === "true",
    },
  };
}

const envTestingFile = join(__dirname, "../../../../.env.test");
export const configTest = makeConfig(envTestingFile);
