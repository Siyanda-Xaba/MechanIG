import dotenv from "dotenv";

dotenv.config();
const { default: app } = await import("./app.js");
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`MechanIQ OBD API listening on ${HOST}:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health/live`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
