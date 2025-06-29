import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import savedFundRoutes from "./routes/savedFundRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mutual-fund-tracker";

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);

    if (error.message.includes("IP whitelist")) {
      console.log("🔧 Solution: Update IP whitelist in MongoDB Atlas");
      console.log("   1. Go to MongoDB Atlas Dashboard");
      console.log("   2. Navigate to Network Access");
      console.log("   3. Add your current IP address");
      console.log("   4. Or temporarily add 0.0.0.0/0 for development");
    } else if (error.message.includes("authentication")) {
      console.log("🔧 Solution: Check your MongoDB credentials");
      console.log("   1. Verify username and password in MONGODB_URI");
      console.log("   2. Make sure the user has proper permissions");
    } else if (error.message.includes("ENOTFOUND")) {
      console.log("🔧 Solution: Check your MongoDB connection string");
      console.log("   1. Verify the cluster name and hostnames");
      console.log("   2. Make sure your cluster is active");
    }

    console.log("⚠️  Server will continue without database connection");
    console.log("💡 Check MONGODB_SETUP.md for detailed instructions");
  }
};

// Initialize database connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/saved-funds", savedFundRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❌ Server error:", err.stack);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `📊 Database status: ${
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
    }`
  );
});
