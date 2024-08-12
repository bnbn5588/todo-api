const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Load tasks from a JSON file
const tasksFilePath = path.join(__dirname, "data", "tasks.json");

const getTasks = () => {
  const data = fs.readFileSync(tasksFilePath);
  return JSON.parse(data);
};

const saveTasks = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// Get all tasks
app.get("/api/tasks", (req, res) => {
  const tasks = getTasks();
  res.json(tasks);
});

// Get a single task by ID
app.get("/api/tasks/:id", (req, res) => {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (task) {
    res.json(task);
  } else {
    res.status(404).send("Task not found");
  }
});

// Create a new task
app.post("/api/tasks", (req, res) => {
  const tasks = getTasks();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title: req.body.title,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// Update a task by ID
app.put("/api/tasks/:id", (req, res) => {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (task) {
    task.title = req.body.title !== undefined ? req.body.title : task.title;
    task.completed =
      req.body.completed !== undefined ? req.body.completed : task.completed;
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).send("Task not found");
  }
});

// Delete a task by ID
app.delete("/api/tasks/:id", (req, res) => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (taskIndex > -1) {
    tasks.splice(taskIndex, 1);
    saveTasks(tasks);
    res.status(204).send();
  } else {
    res.status(404).send("Task not found");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
