import type { Config } from "./types";

export function loadConfigFromProcessEnv(): Config {
  const missingKeys: string[] = [];
  let pgport: number = 5432;

  const pgportEnv = process.env.PGPORT;

  if (pgportEnv) {
    pgport = parseInt(pgportEnv, 10);
    if (isNaN(pgport)) {
      pgport = 5432;
    }
  }

  const pghost = process.env.PGHOST;
  const pguser = process.env.PGUSER;
  const pgpassword = process.env.PGPASSWORD;

  if (!pghost) {
    missingKeys.push("PGHOST");
  }

  if (!pguser) {
    missingKeys.push("PGUSER");
  }

  if (!pgpassword) {
    missingKeys.push("PGPASSWORD");
  }

  if (missingKeys.length > 0) {
    throw new Error(
      `The following environment variables are unset: ${missingKeys.join(", ")}`
    );
  }

  return {
    port: pgport,
    // @ts-ignore - explicit undefined check performed above
    host: pghost,
    // @ts-ignore - explicit undefined check performed above
    user: pguser,
    // @ts-ignore - explicit undefined check performed above
    password: pgpassword,
  };
}
