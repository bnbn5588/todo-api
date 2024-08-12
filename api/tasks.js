require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// This is the handler function that Vercel will use to handle requests
module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT * FROM tasks ORDER BY 1 DESC");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
