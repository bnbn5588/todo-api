require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// This is the handler function for the POST endpoint
module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      console.log(req.body);
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).send("Title and description are required");
      }

      const result = await pool.query(
        "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
        [title, description]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
