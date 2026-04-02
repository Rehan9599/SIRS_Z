const dotenv=require("dotenv");
const multer = require('multer');
const path = require('path');
const express = require("express");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log(path.join(__dirname, 'uploads'));

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'Readycool',
  connectTimeout: 10000,
  ssl: { rejectUnauthorized: false }
});

async function testDbConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('[DB] Connection successful to', process.env.DB_HOST || '127.0.0.1');
  } catch (err) {
    console.error('[DB] Connection failed:', err.code || err.message, '-', err.sqlMessage || '');
    console.error('[DB] Check DB_HOST/DB_PORT/DB_USER/DB_PASS/DB_NAME and network/whitelist.');
    process.exit(1);
  }
}

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
async function postItems(id,item,description,price,quantity,status,imageUrl) {
  try {
    const [rows] = await pool.execute(
      'INSERT INTO sell (user_id, item_name, description, price, quantity, status, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id,item,description,price,quantity,status,imageUrl]
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

(async () => {
  await testDbConnection();
  await getUsers();
})();

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




app.post("/sell", upload.single("image"), async (req, res) => {
  try {
    const { id, item, description, price, quantity, status } = req.body;
    console.log(req.file);
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const rows= await postItems(id,item,description,price,quantity,status,imageUrl);
    res.json({
      message: "posted",
      insertedId: rows.insertId,
      imageUrl
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
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