const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const user = require("./routes/userRoutes");
const todo = require("./routes/todoRoutes");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let db;

async function initializeDatabase() {
  try {
    db = await mysql.createPool({
      host: "localhost",
      user: "root",
      password: "123",
      database: "todo",
      port: 3307,
    });
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1); // Exit the process if the database connection fails
  }
}

// Middleware to ensure DB is initialized
app.use((req, res, next) => {
  if (!db) {
    return res.status(500).send("Database connection not initialized");
  }
  req.db = db; // Attach the db object to req
  next();
});

// Use user routes
app.use("/user", user);
app.use("/todo", todo);

// Start server
async function startServer() {
  await initializeDatabase(); // Wait for DB connection to initialize
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

startServer(); // Start the server after the DB is initialized
