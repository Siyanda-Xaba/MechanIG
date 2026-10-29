
require("dotenv").config();

const express = require("express");
const scannerRoutes = require("./routes/scannerRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MechanIQ Dashboard Warning Light Scanner API is running."
  });
});

app.use("/api/scanner", scannerRoutes);

// Handle unexpected errors from middleware and other routes.
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again."
  });
});

app.listen(PORT, () => {
  console.log(`Dashboard Scanner API running at http://localhost:${PORT}`);
});
