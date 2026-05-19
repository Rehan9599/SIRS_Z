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

// CORS is required because frontend (Vercel) and API (Render) will run on different origins.
// Set `CORS_ORIGIN` to a comma-separated list of allowed origins (e.g. https://your-ui.vercel.app,http://localhost:5173).
// If not provided, we fall back to allowing any origin.
const allowedOrigins = (process.env.CORS_ORIGIN || "")
	.split(",")
	.map((s) => s.trim())
	.filter(Boolean);

const corsOptions = {
	origin: allowedOrigins.length ? allowedOrigins : true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: false
};

app.use(cors(corsOptions));
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
      .filter(Boolean)
      // Run schema against currently configured DB from pool and avoid cross-database drift.
      .filter((statement) => !/^CREATE\s+DATABASE/i.test(statement))
      .filter((statement) => !/^USE\s+/i.test(statement));

    for (const statement of statements) {
      await pool.query(statement);
    }

    console.log("[DB] queries.sql executed successfully.");
  } catch (error) {
    console.error("[DB] Failed to execute queries.sql:", error.message);
    throw error;
  }
}

async function ensureUserAccount({ name, email, password, phone, city, role, companyName, jobRole, addressLine }) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return existingUser;
  }

  await createUser({
    name,
    email,
    password,
    phone,
    city,
    role,
    companyName,
    jobRole,
    addressLine
  });

  return getUserByEmail(email);
}

async function seedDemoDataIfNeeded() {
  const customer = await ensureUserAccount({
    name: "Demo Customer",
    email: "customer.demo@readycool.local",
    password: "Customer@123",
    phone: "9990001001",
    city: "Lahore",
    role: "user",
    companyName: "Demo Cooling Pvt Ltd",
    jobRole: "Operations Lead",
    addressLine: "Demo Market, Lahore"
  });

  const workerCandidate = await ensureUserAccount({
    name: "Demo Worker",
    email: "worker.demo@readycool.local",
    password: "Worker@123",
    phone: "9990001002",
    city: "Lahore",
    role: "worker",
    companyName: "ReadyCool Services",
    jobRole: "Technician",
    addressLine: "Service Yard, Lahore"
  });

  const customer2 = await ensureUserAccount({
    name: "Demo Buyer",
    email: "buyer.demo@readycool.local",
    password: "Buyer@123",
    phone: "9990001003",
    city: "Karachi",
    role: "user",
    companyName: "Harbor Logistics",
    jobRole: "Procurement",
    addressLine: "Port Area, Karachi"
  });

  const [purchasesCountRows] = await tryOptionalQuery("SELECT COUNT(*) AS count FROM purchases", []);
  if ((purchasesCountRows?.[0]?.count ?? 0) === 0) {
    await pool.execute(
      `INSERT INTO purchases (buyer_id, sell_id, item_name, price, status)
       VALUES
        (?, NULL, 'Used 3-Ton Split AC', 185000, 'Recorded'),
        (?, NULL, 'Condensing Unit 5HP', 245000, 'Recorded')`,
      [customer2.userID, customer.userID]
    );
  }

  const [serviceCountRows] = await tryOptionalQuery("SELECT COUNT(*) AS count FROM service_requests", []);
  if ((serviceCountRows?.[0]?.count ?? 0) === 0) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [requestOne] = await connection.execute(
        `INSERT INTO service_requests (user_id, request_type, status)
         VALUES (?, 'Service Visit', 'Open')`,
        [customer.userID]
      );
      const requestOneId = requestOne.insertId;
      await connection.execute(
        `INSERT INTO service_request_details
          (request_id, title, equipment_category, brand, model, city, urgency, notes, imageUrl)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          requestOneId,
          'Office AC not cooling',
          'Air Conditioner',
          'Haier',
          'HSU-18',
          'Lahore',
          'High',
          'Second floor office unit needs urgent inspection.',
          null
        ]
      );

      const [requestTwo] = await connection.execute(
        `INSERT INTO service_requests (user_id, request_type, status)
         VALUES (?, 'AMC', 'Open')`,
        [customer2.userID]
      );
      const requestTwoId = requestTwo.insertId;
      await connection.execute(
        `INSERT INTO service_request_details
          (request_id, title, equipment_category, brand, model, city, urgency, notes, imageUrl)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          requestTwoId,
          'AMC contract for warehouse coolers',
          'Cold Room',
          'Carrier',
          'CRX-40',
          'Karachi',
          'Medium',
          'Need quarterly maintenance coverage and emergency response.',
          null
        ]
      );

      const [requestThree] = await connection.execute(
        `INSERT INTO service_requests (user_id, request_type, status)
         VALUES (?, 'Tender', 'Open')`,
        [customer.userID]
      );
      const requestThreeId = requestThree.insertId;
      await connection.execute(
        `INSERT INTO service_request_details
          (request_id, title, equipment_category, brand, model, city, urgency, notes, imageUrl)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          requestThreeId,
          'Tender for rooftop HVAC upgrade',
          'HVAC',
          'Daikin',
          'RTU-12',
          'Lahore',
          'Low',
          'Requesting a commercial quote for phased equipment replacement.',
          null
        ]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  const [workerCountRows] = await tryOptionalQuery("SELECT COUNT(*) AS count FROM workers", []);
  if ((workerCountRows?.[0]?.count ?? 0) === 0) {
    const worker = await getWorkerByUserId(workerCandidate.userID);
    if (worker) {
      await pool.execute(
        `UPDATE workers
         SET status = 'Active', availability_status = 'Full-time', onboarded = 1
         WHERE workerID = ?`,
        [worker.workerID]
      );

      await pool.execute(
        `UPDATE worker_profiles
         SET qualifications = ?, experience_years = ?, service_specialization = ?, certifications = ?
         WHERE worker_id = ?`,
        ['Diploma in HVAC', 4, 'Cooling system installation and maintenance', 'EPA Refrigerant Handling', worker.workerID]
      );
    }
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

async function createUser({ name, email, password, phone, companyName, jobRole, city, addressLine, role }) {
  if (password.length > PASSWORD_MAX_CHARS) {
    throw new Error(`Password must be ${PASSWORD_MAX_CHARS} characters or fewer for the current database setup.`);
  }

  // Store a bcrypt hash (not plaintext).
  const passwordHash = await bcrypt.hash(password, 10);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      "INSERT INTO users(userName, email, passwords) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    const userId = result.insertId;

    // Create user profile
    await connection.execute(
      `INSERT INTO user_profiles (user_id, phone, company_name, job_role, city, address_line)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         phone = VALUES(phone),
         company_name = VALUES(company_name),
         job_role = VALUES(job_role),
         city = VALUES(city),
         address_line = VALUES(address_line)`,
      [userId, phone || null, companyName || null, jobRole || null, city || null, addressLine || null]
    );

    // If role is worker, create worker record
    if (role === "worker") {
      await connection.execute(
        `INSERT INTO workers (user_id, role, status, phone, city, onboarded)
         VALUES (?, ?, 'Active', ?, ?, 0)`,
        [userId, "Service Technician", phone || null, city || null]
      );

      // Create empty worker profile
      const [workerResult] = await connection.execute(
        "SELECT workerID FROM workers WHERE user_id = ? LIMIT 1",
        [userId]
      );

      const workerId = workerResult[0].workerID;
      await connection.execute(
        `INSERT INTO worker_profiles (worker_id, qualifications, experience_years, service_specialization)
         VALUES (?, NULL, NULL, NULL)`,
        [workerId]
      );
    }

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getWorkerByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT
      w.workerID,
      w.user_id,
      w.role,
      w.status,
      w.phone,
      w.city,
      w.availability_status,
      w.onboarded,
      wp.qualifications,
      wp.experience_years,
      wp.service_specialization,
      wp.certifications
    FROM workers w
    LEFT JOIN worker_profiles wp ON wp.worker_id = w.workerID
    WHERE w.user_id = ?
    LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function getAllWorkers() {
  const rows = await tryOptionalQuery(
    `SELECT
      w.workerID,
      w.user_id,
      u.userName,
      u.email,
      w.role,
      w.status,
      w.phone,
      w.city,
      w.availability_status,
      w.onboarded,
      wp.qualifications,
      wp.experience_years,
      wp.service_specialization,
      wp.certifications,
      COUNT(wa.assignment_id) AS activeAssignments
    FROM workers w
    LEFT JOIN users u ON u.userID = w.user_id
    LEFT JOIN worker_profiles wp ON wp.worker_id = w.workerID
    LEFT JOIN worker_assignments wa ON wa.worker_id = w.workerID AND wa.status IN ('Assigned', 'In Progress')
    GROUP BY w.workerID
    ORDER BY w.status DESC, w.created_at DESC`
  );
  return rows || [];
}

async function getAdminUsersPayload() {
  const rows = await tryOptionalQuery(
    `SELECT
      u.userID AS id,
      u.userName,
      u.email,
      u.created_at,
      p.phone,
      p.company_name,
      p.job_role,
      p.city,
      p.address_line,
      w.workerID,
      w.role AS workerRole,
      w.status AS workerStatus,
      w.availability_status,
      w.onboarded,
      COALESCE(wa.activeAssignments, 0) AS activeAssignments
    FROM users u
    LEFT JOIN user_profiles p ON p.user_id = u.userID
    LEFT JOIN workers w ON w.user_id = u.userID
    LEFT JOIN (
      SELECT worker_id, COUNT(*) AS activeAssignments
      FROM worker_assignments
      WHERE status IN ('Assigned', 'In Progress')
      GROUP BY worker_id
    ) wa ON wa.worker_id = w.workerID
    ORDER BY u.created_at DESC`
  );

  const users = rows || [];
  const workerUsers = users.filter((user) => Boolean(user.workerID));

  return {
    summary: {
      totalUsers: users.length,
      workerAccounts: workerUsers.length,
      onboardedWorkers: workerUsers.filter((user) => user.onboarded).length
    },
    users,
    workerUsers
  };
}

async function updateWorkerOnboarding(workerId, { role, qualifications, experience_years, certifications, availability_status }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update worker record
    await connection.execute(
      `UPDATE workers
       SET role = ?, availability_status = ?, onboarded = 1
       WHERE workerID = ?`,
      [role || "Service Technician", availability_status || "Full-time", workerId]
    );

    // Update worker profile
    await connection.execute(
      `UPDATE worker_profiles
       SET qualifications = ?, experience_years = ?, certifications = ?
       WHERE worker_id = ?`,
      [qualifications || null, experience_years || null, certifications || null, workerId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getWorkerAssignments(workerId) {
  const [rows] = await pool.execute(
    `SELECT
      wa.assignment_id,
      wa.worker_id,
      wa.request_id,
      wa.status,
      wa.assigned_at,
      wa.completed_at,
      wa.notes,
      sr.request_type,
      sr.user_id,
      sr.status AS requestStatus,
      sr.created_at,
      u.userName,
      u.email,
      srd.title,
      srd.equipment_category,
      srd.brand,
      srd.model,
      srd.city,
      srd.urgency,
      srd.notes AS requestNotes,
      srd.imageUrl
    FROM worker_assignments wa
    JOIN workers w ON w.workerID = wa.worker_id
    JOIN service_requests sr ON sr.requestID = wa.request_id
    LEFT JOIN service_request_details srd ON srd.request_id = sr.requestID
    LEFT JOIN users u ON u.userID = sr.user_id
    WHERE wa.worker_id = ?
    ORDER BY wa.assigned_at DESC`,
    [workerId]
  );
  return rows;
}

async function getOpenWorkerRequests(worker) {
  const workerCity = (worker?.city || "").trim();
  const cityFilter = workerCity ? "AND (d.city = ? OR d.city IS NULL OR d.city = '')" : "";
  const values = workerCity ? [workerCity] : [];

  const [rows] = await pool.execute(
    `SELECT
      sr.requestID AS request_id,
      sr.user_id,
      sr.request_type,
      sr.status,
      sr.created_at,
      u.userName,
      u.email,
      d.title,
      d.equipment_category,
      d.brand,
      d.model,
      d.city,
      d.urgency,
      d.notes,
      d.imageUrl
    FROM service_requests sr
    LEFT JOIN service_request_details d ON d.request_id = sr.requestID
    LEFT JOIN users u ON u.userID = sr.user_id
    WHERE sr.status IN ('Open', 'Pending')
      AND NOT EXISTS (
        SELECT 1
        FROM worker_assignments wa
        WHERE wa.request_id = sr.requestID
      )
      ${cityFilter}
    ORDER BY sr.requestID DESC
    LIMIT 30`,
    values
  );

  return rows;
}

async function getWorkerHomePayload(userId) {
  const worker = await getWorkerByUserId(userId);
  if (!worker) {
    return null;
  }

  const [assignments, openRequests] = await Promise.all([
    getWorkerAssignments(worker.workerID),
    getOpenWorkerRequests(worker)
  ]);

  const summary = {
    totalAssignments: assignments.length,
    completedAssignments: assignments.filter((assignment) => assignment.status === "Completed").length,
    inProgressAssignments: assignments.filter((assignment) => assignment.status === "In Progress").length,
    assignedAssignments: assignments.filter((assignment) => assignment.status === "Assigned").length,
    openRequests: openRequests.length
  };

  return {
    worker,
    assignments,
    openRequests,
    summary
  };
}

async function assignRequestToWorker(workerId, requestId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [requestRows] = await connection.execute(
      "SELECT requestID, status FROM service_requests WHERE requestID = ? LIMIT 1",
      [requestId]
    );

    if (!requestRows.length) {
      throw new Error("Request not found.");
    }

    if (!["Open", "Pending"].includes(requestRows[0].status)) {
      throw new Error("This request is no longer open.");
    }

    const [existing] = await connection.execute(
      "SELECT assignment_id FROM worker_assignments WHERE request_id = ? LIMIT 1",
      [requestId]
    );

    if (existing.length > 0) {
      throw new Error("This request is already assigned.");
    }

    const [result] = await connection.execute(
      `INSERT INTO worker_assignments (worker_id, request_id, status)
       VALUES (?, ?, 'Assigned')`,
      [workerId, requestId]
    );

    await connection.execute(
      "UPDATE service_requests SET status = 'Assigned' WHERE requestID = ?",
      [requestId]
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

async function updateAssignmentStatus(assignmentId, status) {
  const validStatuses = ["Assigned", "In Progress", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const completedAt = status === "Completed" ? new Date() : null;
  await pool.execute(
    `UPDATE worker_assignments
     SET status = ?, completed_at = ?
     WHERE assignment_id = ?`,
    [status, completedAt, assignmentId]
  );
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
      s.sellID,
      s.item_name,
      s.description,
      s.price,
      s.quantity,
      s.status AS listingCondition,
      s.imageUrl,
      s.created_at,
      ld.category,
      ld.brand,
      ld.model,
      ld.manufacture_year,
      ld.city,
      ld.warranty_months,
      ld.negotiable,
      COALESCE(lv.verification_status, 'Pending Review') AS verificationStatus,
      COALESCE(lv.photo_complete, 0) AS photoComplete,
      COALESCE(lv.spec_complete, 0) AS specComplete,
      COALESCE(lv.model_category_match, 0) AS modelCategoryMatch,
      lv.manual_checklist AS manualCheckList
    FROM sell s
    LEFT JOIN listing_details ld ON ld.sell_id = s.sellID
    LEFT JOIN listing_verifications lv ON lv.sell_id = s.sellID
    ${whereSql}
    ORDER BY s.sellID DESC`;

  const [rows] = await pool.execute(query, values);
  return rows;
}

async function getMyListings(userId) {
  try {
    const [rows] = await pool.execute(
      `SELECT
        s.sellID,
        s.item_name,
        s.price,
        s.status AS listingCondition,
        s.description,
        s.imageUrl,
        COALESCE(lv.verification_status, 'Pending Review') AS verificationStatus,
        COALESCE(lv.photo_complete, 0) AS photoComplete,
        COALESCE(lv.spec_complete, 0) AS specComplete,
        COALESCE(lv.model_category_match, 0) AS modelCategoryMatch
      FROM sell s
      LEFT JOIN listing_verifications lv ON lv.sell_id = s.sellID
      WHERE s.user_id = ?
      ORDER BY s.sellID DESC`,
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
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.execute(
      "UPDATE users SET userName = ?, email = ?, passwords = ? WHERE userID = ?",
      [userName, email, passwordHash, userId]
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

async function upsertListingVerification(sellId, {
  verificationStatus = "Pending Review",
  photoComplete = 0,
  specComplete = 0,
  modelCategoryMatch = 0,
  manualChecklist = null
} = {}) {
  await pool.execute(
    `INSERT INTO listing_verifications
      (sell_id, verification_status, photo_complete, spec_complete, model_category_match, manual_checklist)
     VALUES
      (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      verification_status = VALUES(verification_status),
      photo_complete = VALUES(photo_complete),
      spec_complete = VALUES(spec_complete),
      model_category_match = VALUES(model_category_match),
      manual_checklist = VALUES(manual_checklist)`,
    [
      sellId,
      verificationStatus,
      photoComplete ? 1 : 0,
      specComplete ? 1 : 0,
      modelCategoryMatch ? 1 : 0,
      manualChecklist
    ]
  );
}

async function getListingById(sellId) {
  const [rows] = await pool.execute(
    `SELECT sellID, user_id, item_name, price, imageUrl, status AS listingCondition
     FROM sell
     WHERE sellID = ?
     LIMIT 1`,
    [sellId]
  );
  return rows[0] || null;
}

async function getDashboardPayload(userId) {
  const user = await getUserById(userId);
  const listings = await getMyListings(userId);

  const requests = await tryOptionalQuery(
    `SELECT
      r.requestID AS id,
      r.request_type,
      r.status,
      d.title,
      d.equipment_category,
      d.city,
      d.urgency,
      d.notes,
      r.created_at
    FROM service_requests r
    LEFT JOIN service_request_details d ON d.request_id = r.requestID
    WHERE r.user_id = ?
    ORDER BY r.requestID DESC
    LIMIT 20`,
    [userId]
  );

  const purchases = await tryOptionalQuery(
    "SELECT purchaseID AS id, item_name, price, status, purchased_at FROM purchases WHERE buyer_id = ? ORDER BY purchaseID DESC LIMIT 20",
    [userId]
  );

  const inquiriesSent = await tryOptionalQuery(
    `SELECT
      i.inquiryID AS id,
      i.status,
      i.message,
      i.created_at,
      s.item_name,
      s.price,
      s.imageUrl,
      COALESCE(lv.verification_status, 'Pending Review') AS verificationStatus
    FROM inquiries i
    JOIN sell s ON s.sellID = i.sell_id
    LEFT JOIN listing_verifications lv ON lv.sell_id = s.sellID
    WHERE i.buyer_id = ?
    ORDER BY i.inquiryID DESC
    LIMIT 20`,
    [userId]
  );

  const inquiriesReceived = await tryOptionalQuery(
    `SELECT
      i.inquiryID AS id,
      i.status,
      i.message,
      i.created_at,
      s.item_name,
      s.price,
      s.imageUrl,
      COALESCE(lv.verification_status, 'Pending Review') AS verificationStatus
    FROM inquiries i
    JOIN sell s ON s.sellID = i.sell_id
    LEFT JOIN listing_verifications lv ON lv.sell_id = s.sellID
    WHERE i.seller_id = ?
    ORDER BY i.inquiryID DESC
    LIMIT 20`,
    [userId]
  );

  return {
    user,
    listings,
    requests,
    inquiriesSent,
    inquiriesReceived,
    purchases,
    summary: {
      listingCount: listings.length,
      requestCount: requests.length,
      inquirySentCount: inquiriesSent.length,
      inquiryReceivedCount: inquiriesReceived.length,
      purchaseCount: purchases.length
    }
  };
}

async function getAdminServiceRequests() {
  const [rows] = await pool.execute(
    `SELECT
      r.requestID AS id,
      r.user_id,
      u.userName,
      u.email,
      r.request_type,
      r.status,
      r.created_at,
      d.title,
      d.equipment_category,
      d.brand,
      d.model,
      d.city,
      d.urgency,
      d.notes,
      d.imageUrl
    FROM service_requests r
    LEFT JOIN service_request_details d ON d.request_id = r.requestID
    LEFT JOIN users u ON u.userID = r.user_id
    ORDER BY r.requestID DESC`
  );

  return rows;
}

async function getAdminDashboardPayload() {
  const recentListings = await tryOptionalQuery(
    `SELECT
      s.sellID AS id,
      s.item_name,
      s.price,
      s.status,
      s.created_at,
      u.userName,
      u.email,
      COALESCE(lv.verification_status, 'Pending Review') AS verificationStatus
    FROM sell s
    LEFT JOIN users u ON u.userID = s.user_id
    LEFT JOIN listing_verifications lv ON lv.sell_id = s.sellID
    ORDER BY s.sellID DESC
    LIMIT 8`
  );

  const recentPurchases = await tryOptionalQuery(
    `SELECT
      p.purchaseID AS id,
      p.item_name,
      p.price,
      p.status,
      p.purchased_at,
      u.userName,
      u.email
    FROM purchases p
    LEFT JOIN users u ON u.userID = p.buyer_id
    ORDER BY p.purchaseID DESC
    LIMIT 8`
  );

  const serviceRequests = await tryOptionalQuery(
    `SELECT
      r.requestID AS id,
      r.user_id,
      u.userName,
      u.email,
      r.request_type,
      r.status,
      r.created_at,
      d.title,
      d.equipment_category,
      d.brand,
      d.model,
      d.city,
      d.urgency,
      d.notes,
      d.imageUrl
    FROM service_requests r
    LEFT JOIN service_request_details d ON d.request_id = r.requestID
    LEFT JOIN users u ON u.userID = r.user_id
    ORDER BY r.requestID DESC
    LIMIT 30`
  );

  const listingRows = recentListings || [];
  const purchaseRows = recentPurchases || [];
  const serviceRequestRows = serviceRequests || [];
  const serviceVisits = serviceRequestRows.filter((request) => request.request_type === "Service Visit");
  const amcTenderRequests = serviceRequestRows.filter((request) => ["AMC", "Tender"].includes(request.request_type));

  return {
    summary: {
      listingCount: listingRows.length,
      purchaseCount: purchaseRows.length,
      serviceRequestCount: serviceRequestRows.length,
      serviceVisitCount: serviceVisits.length,
      amcTenderCount: amcTenderRequests.length
    },
    recentListings: listingRows,
    recentPurchases: purchaseRows,
    serviceRequests: serviceRequestRows,
    serviceVisits,
    amcTenderRequests
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
  await seedDemoDataIfNeeded();
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
    const { email, password, role } = req.body;

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

    // If role is specified, verify it matches the user's role
    if (role === "worker") {
      const worker = await getWorkerByUserId(user.userID);
      if (!worker) {
        return res.status(401).json({ message: "Worker account not found for this user." });
      }

      return res.json({
        message: "login_success",
        userId: user.userID,
        name: user.userName,
        email: user.email,
        role: "worker",
        isWorker: true,
        needsOnboarding: !worker.onboarded
      });
    }

    return res.json({
      message: "login_success",
      userId: user.userID,
      name: user.userName,
      email: user.email,
      role: "user",
      isWorker: false
    });
  } catch (err) {
    return res.status(500).json({ message: "Unable to log in right now.", error: err.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, companyName, jobRole, city, addressLine, role } = req.body;

    if (!name || !email || !password || !phone || !city) {
      return res.status(400).json({ message: "Name, email, password, phone, and city are required." });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "An account already exists for this email." });
    }

    const result = await createUser({ name, email, password, phone, companyName, jobRole, city, addressLine, role });
    return res.status(201).json({
      message: "signup_success",
      userId: result.insertId,
      role: role || "user",
      needsOnboarding: role === "worker"
    });
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
      condition,
      category,
      brand,
      model,
      manufactureYear,
      city,
      warrantyMonths,
      negotiable
    } = req.body;

    const listingCondition = condition || status;

    if (!id || !item || !description || !price || !quantity || !listingCondition) {
      return res.status(400).json({ message: "All listing fields are required." });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const photoComplete = req.file ? 1 : 0;
    const specComplete = category && brand && model && city ? 1 : 0;
    const modelCategoryMatch = category && model ? 1 : 0;
    const verificationStatus =
      photoComplete && specComplete && modelCategoryMatch ? "Verified" : "Pending Review";

    const result = await addItem(id, item, description, price, quantity, listingCondition, imageUrl);
    await addListingDetails(result.insertId, {
      category,
      brand,
      model,
      manufacture_year: manufactureYear ? Number(manufactureYear) : null,
      city,
      warranty_months: warrantyMonths ? Number(warrantyMonths) : null,
      negotiable: String(negotiable) === "true"
    });

    await upsertListingVerification(result.insertId, {
      verificationStatus,
      photoComplete,
      specComplete,
      modelCategoryMatch,
      manualChecklist: null
    });

    return res.status(201).json({
      message: "Listing posted successfully.",
      insertedId: result.insertId,
      imageUrl,
      verificationStatus
    });
  } catch (err) {
    return res.status(500).json({ message: "Unable to post listing right now.", error: err.message });
  }
});

app.put("/listings/:id/verification", async (req, res) => {
  try {
    const sellId = Number(req.params.id);
    if (!Number.isFinite(sellId)) {
      return res.status(400).json({ message: "Invalid listing id." });
    }

    const { status, manualChecklist } = req.body;
    const allowed = new Set(["Pending Review", "Verified", "Rejected"]);
    if (!status || !allowed.has(status)) {
      return res.status(400).json({ message: "status must be one of Pending Review, Verified, Rejected." });
    }

    const [existingRows] = await pool.execute(
      `SELECT photo_complete, spec_complete, model_category_match
       FROM listing_verifications
       WHERE sell_id = ?
       LIMIT 1`,
      [sellId]
    );

    const existing = existingRows[0] || {};

    if (status === "Verified") {
      // Enforce that Verified can only be set when the required checks are complete.
      const photoOk = Number(existing.photo_complete ?? 0) === 1;
      const specOk = Number(existing.spec_complete ?? 0) === 1;
      const modelOk = Number(existing.model_category_match ?? 0) === 1;
      if (!photoOk || !specOk || !modelOk) {
        return res.status(400).json({
          message: "Cannot set verification to Verified unless photo/spec/model-category checks are complete."
        });
      }
    }

    await upsertListingVerification(sellId, {
      verificationStatus: status,
      photoComplete: existing.photo_complete ?? 0,
      specComplete: existing.spec_complete ?? 0,
      modelCategoryMatch: existing.model_category_match ?? 0,
      manualChecklist: manualChecklist || null
    });

    return res.json({ message: "verification_updated", sellId, status });
  } catch (err) {
    return res.status(500).json({ message: "Unable to update verification.", error: err.message });
  }
});

app.post("/inquiries", async (req, res) => {
  try {
    const { buyerId, sellId, message } = req.body;
    const bId = Number(buyerId);
    const sId = Number(sellId);

    if (!Number.isFinite(bId) || !Number.isFinite(sId)) {
      return res.status(400).json({ message: "buyerId and sellId are required." });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "message is required." });
    }

    const listing = await getListingById(sId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }
    if (listing.user_id === bId) {
      return res.status(400).json({ message: "You cannot inquire about your own listing." });
    }

    await pool.execute(
      `INSERT INTO inquiries
        (buyer_id, seller_id, sell_id, message, status)
       VALUES
        (?, ?, ?, ?, ?)`,
      [bId, listing.user_id, sId, message.trim(), "Sent"]
    );

    return res.status(201).json({ message: "inquiry_sent" });
  } catch (err) {
    return res.status(500).json({ message: "Unable to send inquiry right now.", error: err.message });
  }
});

app.post("/service-requests", upload.single("image"), async (req, res) => {
  try {
    const {
      userId,
      requestType,
      title,
      equipmentCategory,
      brand,
      model,
      city,
      urgency,
      notes
    } = req.body;

    const uId = Number(userId);
    if (!Number.isFinite(uId)) {
      return res.status(400).json({ message: "Valid userId is required." });
    }
    if (!requestType || !title) {
      return res.status(400).json({ message: "requestType and title are required." });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `INSERT INTO service_requests (user_id, request_type, status)
         VALUES (?, ?, 'Open')`,
        [uId, requestType]
      );

      const requestId = result.insertId;
      await connection.execute(
        `INSERT INTO service_request_details
          (request_id, title, equipment_category, brand, model, city, urgency, notes, imageUrl)
         VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          requestId,
          title,
          equipmentCategory || null,
          brand || null,
          model || null,
          city || null,
          urgency || null,
          notes || null,
          imageUrl
        ]
      );

      await connection.commit();
      return res.status(201).json({ message: "service_request_created", requestId });
    } catch (txErr) {
      await connection.rollback();
      throw txErr;
    } finally {
      connection.release();
    }
  } catch (err) {
    return res.status(500).json({ message: "Unable to create service request right now.", error: err.message });
  }
});

app.get("/admin/service-requests", async (req, res) => {
  try {
    const requests = await getAdminServiceRequests();
    return res.json({ message: "admin_service_requests_loaded", requests });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load admin service requests right now.", error: error.message });
  }
});

app.get("/admin/dashboard", async (req, res) => {
  try {
    const payload = await getAdminDashboardPayload();
    return res.json({ message: "admin_dashboard_loaded", ...payload });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load admin dashboard right now.", error: error.message });
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

// Worker Endpoints
app.post("/worker/onboard", async (req, res) => {
  try {
    const { userId, role, qualifications, experience_years, certifications, availability_status } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const worker = await getWorkerByUserId(userId);
    if (!worker) {
      return res.status(404).json({ message: "Worker account not found." });
    }

    await updateWorkerOnboarding(worker.workerID, {
      role,
      qualifications,
      experience_years,
      certifications,
      availability_status
    });

    return res.json({ message: "worker_onboarded", workerId: worker.workerID });
  } catch (error) {
    return res.status(500).json({ message: "Unable to complete worker onboarding.", error: error.message });
  }
});

app.get("/worker/assignments/:workerId", async (req, res) => {
  try {
    const workerId = Number(req.params.workerId);
    if (!Number.isFinite(workerId)) {
      return res.status(400).json({ message: "Invalid worker id." });
    }

    const assignments = await getWorkerAssignments(workerId);
    return res.json({ message: "worker_assignments_loaded", assignments });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load worker assignments.", error: error.message });
  }
});

// Get assignments for currently logged-in worker by user ID
app.get("/worker/assignments/current/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    // Get worker by user ID
    const worker = await getWorkerByUserId(userId);
    if (!worker) {
      return res.status(404).json({ message: "Worker account not found." });
    }

    const assignments = await getWorkerAssignments(worker.workerID);
    return res.json({ message: "worker_assignments_loaded", assignments });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load worker assignments.", error: error.message });
  }
});

app.get("/worker/home/current/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const payload = await getWorkerHomePayload(userId);
    if (!payload) {
      return res.status(404).json({ message: "Worker account not found." });
    }

    return res.json({ message: "worker_home_loaded", ...payload });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load worker home right now.", error: error.message });
  }
});

app.post("/worker/volunteer", async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    const userId_num = Number(userId);
    const requestId_num = Number(requestId);

    if (!Number.isFinite(userId_num) || !Number.isFinite(requestId_num)) {
      return res.status(400).json({ message: "userId and requestId are required." });
    }

    const worker = await getWorkerByUserId(userId_num);
    if (!worker) {
      return res.status(404).json({ message: "Worker account not found." });
    }

    const result = await assignRequestToWorker(worker.workerID, requestId_num);
    return res.status(201).json({ message: "request_volunteered", assignmentId: result.insertId });
  } catch (error) {
    if (error.message.includes("already assigned") || error.message.includes("no longer open")) {
      return res.status(409).json({ message: error.message });
    }

    return res.status(500).json({ message: "Unable to volunteer for request.", error: error.message });
  }
});

app.patch("/worker/assignments/:assignmentId", async (req, res) => {
  try {
    const assignmentId = Number(req.params.assignmentId);
    const { status } = req.body;

    if (!Number.isFinite(assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment id." });
    }

    if (!status) {
      return res.status(400).json({ message: "status is required." });
    }

    await updateAssignmentStatus(assignmentId, status);
    return res.json({ message: "assignment_updated", assignmentId, status });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update assignment.", error: error.message });
  }
});

app.get("/admin/workers", async (req, res) => {
  try {
    const workers = await getAllWorkers();
    return res.json({ message: "admin_workers_loaded", workers });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load workers.", error: error.message });
  }
});

app.get("/admin/users", async (req, res) => {
  try {
    const payload = await getAdminUsersPayload();
    return res.json({ message: "admin_users_loaded", ...payload });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load users.", error: error.message });
  }
});

app.post("/admin/assign-request", async (req, res) => {
  try {
    const { workerId, requestId } = req.body;

    const workerId_num = Number(workerId);
    const requestId_num = Number(requestId);

    if (!Number.isFinite(workerId_num) || !Number.isFinite(requestId_num)) {
      return res.status(400).json({ message: "workerId and requestId are required." });
    }

    const result = await assignRequestToWorker(workerId_num, requestId_num);
    return res.status(201).json({ message: "request_assigned", assignmentId: result.insertId });
  } catch (error) {
    if (error.message.includes("already assigned")) {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unable to assign request.", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
