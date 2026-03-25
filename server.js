// server.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// ── Load env vars ───────────────────────────────────────
dotenv.config();

// ── Connect to MongoDB ─────────────────────────────────
connectDB();

const app = express();

// ── Middleware ─────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",          // React dev server
  "http://127.0.0.1:3000",          // alternative localhost
  process.env.FRONTEND_URL || ""    // production frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

// Preflight requests handling
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ── Routes ────────────────────────────────────────────
app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/products",   require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/cart",       require("./routes/cartRoutes"));
app.use("/api/orders",     require("./routes/orderRoutes"));
app.use("/api/users",      require("./routes/userRoutes"));

// ── Health check ──────────────────────────────────────
app.get("/api/health", (req, res) => res.json({ status: "OK", message: "ShopKart API running 🚀" }));

// ── Error Handling ────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 ShopKart Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 API: http://localhost:${PORT}/api\n`);
});
