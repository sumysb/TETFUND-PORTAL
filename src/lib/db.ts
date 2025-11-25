import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

let cachedPool: Pool | undefined = global._pgPool;

export function getPgPool(): Pool {
  if (cachedPool) {
    return cachedPool;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your environment variables."
    );
  }

  cachedPool = new Pool({
    connectionString: databaseUrl,
    ssl:
      databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
  });

  if (process.env.NODE_ENV !== "production") {
    global._pgPool = cachedPool;
  }

  return cachedPool;
}

