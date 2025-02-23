import dotenv from "@dotenvx/dotenvx";

dotenv.config({ quiet: true });
dotenv.config({
  path: `.env.${process.env.NODE_ENV || "local"}`,
  override: true,
  quiet: true,
});
