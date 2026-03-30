const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/login", async(req,res)=>{
  console.log("Jiii");
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});