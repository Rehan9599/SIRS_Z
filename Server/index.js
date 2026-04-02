const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOADS_DIR = path.join(__dirname, "uploads");
const QUERIES_SQL_PATH = path.join(__dirname, "queries.sql");
const PASSWORD_MAX_CHARS = 20;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "readycool",
  connectTimeout: 10000,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;

async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log("[DB] Connection successful to", process.env.DB_HOST || "127.0.0.1");
  } catch (err) {
    console.error("[DB] Connection failed:", err.code || err.message, "-", err.sqlMessage || "");
    console.error("[DB] Check DB_HOST/DB_PORT/DB_USER/DB_PASS/DB_NAME and network/whitelist.");
    process.exit(1);
  }
}

async function runSchemaQueries() {
  try {
    const rawSql = await fs.readFile(QUERIES_SQL_PATH, "utf8");
    const cleaned = rawSql
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");

    const statements = cleaned
      .split(";")
      .map((statement) => statement.trim())
      .filter(Boolean);

    for (const statement of statements) {
      await pool.query(statement);
    }

    console.log("[DB] queries.sql executed successfully.");
  } catch (error) {
    console.error("[DB] Failed to execute queries.sql:", error.message);
    throw error;
  }
}

async function getUserByEmail(email) {
  const [rows] = await pool.execute(
    "SELECT userID, userName, email, passwords FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
}

async function getUserById(userId) {
  const [rows] = await pool.execute(
    `SELECT
      u.userID,
      u.userName,
      u.email,
      p.phone,
      p.company_name,
      p.job_role,
      p.city,
      p.address_line
    FROM users u
    LEFT JOIN user_profiles p ON p.user_id = u.userID
    WHERE u.userID = ?
    LIMIT 1`,
    [userId]
  );

  return rows[0] || null;
}

async function createUser({ name, email, password, phone, companyName, jobRole, city, addressLine }) {
  if (password.length > PASSWORD_MAX_CHARS) {
    throw new Error(`Password must be ${PASSWORD_MAX_CHARS} characters or fewer for the current database setup.`);
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      "INSERT INTO users(userName, email, passwords) VALUES (?, ?, ?)",
      [name, email, password]
    );

    await connection.execute(
      `INSERT INTO user_profiles (user_id, phone, company_name, job_role, city, address_line)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         phone = VALUES(phone),
         company_name = VALUES(company_name),
         job_role = VALUES(job_role),
         city = VALUES(city),
         address_line = VALUES(address_line)`,
      [result.insertId, phone || null, companyName || null, jobRole || null, city || null, addressLine || null]
    );

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function verifyPassword(enteredPassword, storedPassword) {
  if (!storedPassword) {
    return false;
  }

  if (storedPassword.startsWith("$2")) {
    return bcrypt.compare(enteredPassword, storedPassword);
  }

  return enteredPassword === storedPassword;
}

async function getItems(userId, filters = {}) {
  const whereClauses = [];
  const values = [];

  if (userId) {
    whereClauses.push("s.user_id <> ?");
    values.push(userId);
  }

  if (filters.search) {
    whereClauses.push("(s.item_name LIKE ? OR s.description LIKE ? OR ld.brand LIKE ? OR ld.model LIKE ? OR ld.city LIKE ?)");
    const term = `%${filters.search}%`;
    values.push(term, term, term, term, term);
  }

  if (filters.condition) {
    whereClauses.push("s.status = ?");
    values.push(filters.condition);
  }

  if (filters.category) {
    whereClauses.push("ld.category = ?");
    values.push(filters.category);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const query = `
    SELECT
      s.*,
      ld.category,
      ld.brand,
      ld.model,
      ld.manufacture_year,
      ld.city,
      ld.warranty_months,
      ld.negotiable
    FROM sell s
    LEFT JOIN listing_details ld ON ld.sell_id = s.sellID
    ${whereSql}
    ORDER BY s.sellID DESC`;

  const [rows] = await pool.execute(query, values);
  return rows;
}

async function getMyListings(userId) {
  try {
    const [rows] = await pool.execute(
      "SELECT sellID, item_name, price, status, description, imageUrl FROM sell WHERE user_id = ? ORDER BY sellID DESC",
      [userId]
    );
    return rows;
  } catch (error) {
    if (error.code === "ER_BAD_FIELD_ERROR" || error.code === "ER_NO_SUCH_TABLE") {
      return [];
    }
    throw error;
  }
}

async function tryOptionalQuery(query, values) {
  try {
    const [rows] = await pool.execute(query, values);
    return rows;
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      return [];
    }

    throw error;
  }
}

async function updateUserProfile(userId, userName, email, password) {
  if (password && password.length > PASSWORD_MAX_CHARS) {
    throw new Error(`Password must be ${PASSWORD_MAX_CHARS} characters or fewer for the current database setup.`);
  }

  if (password) {
    await pool.execute(
      "UPDATE users SET userName = ?, email = ?, passwords = ? WHERE userID = ?",
      [userName, email, password, userId]
    );
    return;
  }

  await pool.execute(
    "UPDATE users SET userName = ?, email = ? WHERE userID = ?",
    [userName, email, userId]
  );
}

async function upsertUserProfile(userId, profile = {}) {
  await pool.execute(
    `INSERT INTO user_profiles (user_id, phone, company_name, job_role, city, address_line)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       phone = VALUES(phone),
       company_name = VALUES(company_name),
       job_role = VALUES(job_role),
       city = VALUES(city),
       address_line = VALUES(address_line)`,
    [
      userId,
      profile.phone || null,
      profile.company_name || null,
      profile.job_role || null,
      profile.city || null,
      profile.address_line || null
    ]
  );
}

async function addListingDetails(sellId, details = {}) {
  await pool.execute(
    `INSERT INTO listing_details (
      sell_id, category, brand, model, manufacture_year, city, warranty_months, negotiable
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      category = VALUES(category),
      brand = VALUES(brand),
      model = VALUES(model),
      manufacture_year = VALUES(manufacture_year),
      city = VALUES(city),
      warranty_months = VALUES(warranty_months),
      negotiable = VALUES(negotiable)`,
    [
      sellId,
      details.category || null,
      details.brand || null,
      details.model || null,
      details.manufacture_year || null,
      details.city || null,
      details.warranty_months || null,
      details.negotiable ? 1 : 0
    ]
  );
}

async function getDashboardPayload(userId) {
  const user = await getUserById(userId);
  const listings = await getMyListings(userId);

  const requests = await tryOptionalQuery(
    "SELECT requestID AS id, request_type, status, created_at FROM service_requests WHERE user_id = ? ORDER BY requestID DESC LIMIT 20",
    [userId]
  );

  const purchases = await tryOptionalQuery(
    "SELECT purchaseID AS id, item_name, price, status, purchased_at FROM purchases WHERE buyer_id = ? ORDER BY purchaseID DESC LIMIT 20",
    [userId]
  );

  return {
    user,
    listings,
    requests,
    purchases,
    summary: {
      listingCount: listings.length,
      requestCount: requests.length,
      purchaseCount: purchases.length
    }
  };
}

async function addItem(id, item, description, price, quantity, status, imageUrl) {
  const [result] = await pool.execute(
    "INSERT INTO sell (user_id, item_name, description, price, quantity, status, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, item, description, price, quantity, status, imageUrl]
  );

  return result;
}

(async () => {
  await runSchemaQueries();
  await testDbConnection();
})();

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await verifyPassword(password, user.passwords);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      message: "login_success",
      userId: user.userID,
      name: user.userName,
      email: user.email
    });
  } catch (err) {
    return res.status(500).json({ message: "Unable to log in right now.", error: err.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, companyName, jobRole, city, addressLine } = req.body;

    if (!name || !email || !password || !phone || !city) {
      return res.status(400).json({ message: "Name, email, password, phone, and city are required." });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "An account already exists for this email." });
    }

    const result = await createUser({ name, email, password, phone, companyName, jobRole, city, addressLine });
    return res.status(201).json({ message: "signup_success", userId: result.insertId });
  } catch (err) {
    if (err.message.includes("Password must be")) {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Unable to create account right now.", error: err.message });
  }
});

app.post("/sell", upload.single("image"), async (req, res) => {
  try {
    const {
      id,
      item,
      description,
      price,
      quantity,
      status,
      category,
      brand,
      model,
      manufactureYear,
      city,
      warrantyMonths,
      negotiable
    } = req.body;

    if (!id || !item || !description || !price || !quantity || !status) {
      return res.status(400).json({ message: "All listing fields are required." });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await addItem(id, item, description, price, quantity, status, imageUrl);
    await addListingDetails(result.insertId, {
      category,
      brand,
      model,
      manufacture_year: manufactureYear ? Number(manufactureYear) : null,
      city,
      warranty_months: warrantyMonths ? Number(warrantyMonths) : null,
      negotiable: String(negotiable) === "true"
    });

    return res.status(201).json({
      message: "Listing posted successfully.",
      insertedId: result.insertId,
      imageUrl
    });
  } catch (err) {
    return res.status(500).json({ message: "Unable to post listing right now.", error: err.message });
  }
});

app.get("/buy", async (req, res) => {
  try {
    const { id, q, condition, category } = req.query;
    const rowsItems = await getItems(id, {
      search: q,
      condition,
      category
    });

    return res.json({ message: "items_loaded", items: rowsItems });
  } catch (err) {
    return res.status(500).json({ message: "Unable to load inventory right now.", error: err.message });
  }
});

app.get("/profile/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load profile right now.", error: error.message });
  }
});

app.put("/profile/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { userName, email, password, phone, companyName, jobRole, city, addressLine } = req.body;

    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    if (!userName || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser && existingUser.userID !== userId) {
      return res.status(409).json({ message: "This email is already in use by another account." });
    }

    await updateUserProfile(userId, userName, email, password);
    await upsertUserProfile(userId, {
      phone,
      company_name: companyName,
      job_role: jobRole,
      city,
      address_line: addressLine
    });
    return res.json({ message: "profile_updated" });
  } catch (error) {
    if (error.message.includes("Password must be")) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Unable to update profile right now.", error: error.message });
  }
});

app.get("/dashboard/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const payload = await getDashboardPayload(userId);
    if (!payload.user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(payload);
  } catch (error) {
    console.error("[Dashboard Error]", error);
    return res.status(500).json({ message: "Unable to load dashboard right now.", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
