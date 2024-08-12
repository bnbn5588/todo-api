require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

// Define the getTasks function as an endpoint
const getTasks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY 1 DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Set up the /tasks endpoint
app.get("/api/tasks", getTasks);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
