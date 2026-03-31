const dotenv=require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database:process.env.database,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;

async function getUsers() {
  try {
    const [rows] = await pool.execute('SELECT * FROM users');
    console.log(rows);
  } catch (err) {
    console.error(err);
  }
}
async function getItems(id) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM sell where user_id != (?)',
      [id]
    );
    return rows;
  } catch (err) {
    console.error(err);
  }
}
async function addUsers(name,email,password) {
  try {
    const [rows] = await pool.execute(
      'INSERT INTO users(userName, email, passwords) VALUES (?, ?, ?)',
      [name, email, password]
    );
    console.log(rows);
  } catch (err) {
    console.error(err);
  }
}
async function postItems(id,item,description,price,quantity,status) {
  try {
    const [rows] = await pool.execute(
      'INSERT INTO Sell (user_id, item_name, description, price, quantity, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id,item,description,price,quantity,status]
    );
    return rows;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function authUsers(email,password) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND passwords = ?',
      [email, password]
    );
    return rows;
  } catch (err) {
    console.error(err);
    return null;
  }
}
getUsers();




app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/login", async(req,res)=>{
  try {
    const { email, password } = req.body;
    const rows = await authUsers(email, password);
    if (rows && rows.length > 0) {
      console.log(rows[0].userID);
      res.json({ message: "yooooo", userId: rows[0].userID});
    } else {
      res.json({ mess: "nooooooo" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/signup", async(req,res)=>{
  try {
    const {name,email,password}= await req.body;
    addUsers(name,email,password);
    res.json({message:"dponeeee sigining upppppp"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.post("/sell", async(req,res)=>{
  try {
    const {id,item,description,price,quantity,status}= await req.body;
    const rows= await postItems(id,item,description,price,quantity,status);
    res.json({message:"posted", item: rows[0]});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/buy", async(req,res)=>{
  try {
    const id = await req.query.id;
    console.log("current id", id);
    const rowsItems= await getItems(id);
    res.json({message:"listed",items: rowsItems});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});