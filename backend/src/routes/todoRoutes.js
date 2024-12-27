const express = require("express");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

// Get all todos for the logged-in user
router.get("/get", authenticateToken, async (req, res) => {
  const [rows] = await req.db.query(
    "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
    [req.user.userId]
  );
  res.json(rows);
});

// Add a new todo
router.post("/add", authenticateToken, async (req, res) => {
  const { name, start_time, end_time } = req.body;
  await req.db.query(
    "INSERT INTO todos (name, start_time, end_time, user_id) VALUES (?, ?, ?, ?)",
    [name, start_time, end_time, req.user.userId]
  );

  const [rows] = await req.db.query(
    "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
    [req.user.userId]
  );
  res.json(rows);
});

// 3. Update a todo
router.put("/update/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, start_time, end_time } = req.body;

  try {
    const [result] = await req.db.query(
      "UPDATE todos SET name = ?, start_time = ?, end_time = ? WHERE id = ? AND user_id = ?",
      [name, start_time, end_time, id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found or unauthorized" });
    }

    const [rows] = await req.db.query(
      "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// 4. Delete a todo
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await req.db.query(
      "DELETE FROM todos WHERE id = ? AND user_id = ?",
      [id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found or unauthorized" });
    }

    const [rows] = await req.db.query(
      "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
