CREATE DATABASE IF NOT EXISTS readycool;
USE readycool;

CREATE TABLE IF NOT EXISTS users (
  userID INT AUTO_INCREMENT PRIMARY KEY,
  userName VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  passwords VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ensure bcrypt hashes fit even if the DB was created earlier.
ALTER TABLE users MODIFY passwords VARCHAR(255) NOT NULL;

CREATE TABLE IF NOT EXISTS sell (
  sellID INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_name VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  status VARCHAR(60) NOT NULL,
  imageUrl VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sell_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  profile_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  phone VARCHAR(20) NULL,
  company_name VARCHAR(120) NULL,
  job_role VARCHAR(80) NULL,
  city VARCHAR(80) NULL,
  address_line VARCHAR(200) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_profiles_user (user_id),
  CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listing_details (
  detail_id INT AUTO_INCREMENT PRIMARY KEY,
  sell_id INT NOT NULL,
  category VARCHAR(80) NULL,
  brand VARCHAR(80) NULL,
  model VARCHAR(120) NULL,
  manufacture_year INT NULL,
  city VARCHAR(80) NULL,
  warranty_months INT NULL,
  negotiable TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_listing_details_sell (sell_id),
  CONSTRAINT fk_listing_details_sell FOREIGN KEY (sell_id) REFERENCES sell(sellID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listing_verifications (
  sell_id INT NOT NULL,
  verification_status VARCHAR(60) NOT NULL DEFAULT 'Pending Review',
  photo_complete TINYINT(1) NOT NULL DEFAULT 0,
  spec_complete TINYINT(1) NOT NULL DEFAULT 0,
  model_category_match TINYINT(1) NOT NULL DEFAULT 0,
  manual_checklist TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (sell_id),
  CONSTRAINT fk_listing_verifications_sell FOREIGN KEY (sell_id) REFERENCES sell(sellID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS service_requests (
  requestID INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  request_type VARCHAR(120) NOT NULL,
  status VARCHAR(50) DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_service_requests_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS service_request_details (
  request_id INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  equipment_category VARCHAR(80) NULL,
  brand VARCHAR(80) NULL,
  model VARCHAR(120) NULL,
  city VARCHAR(80) NULL,
  urgency VARCHAR(30) NULL,
  notes TEXT NULL,
  imageUrl VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (request_id),
  CONSTRAINT fk_service_request_details_request FOREIGN KEY (request_id) REFERENCES service_requests(requestID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchases (
  purchaseID INT AUTO_INCREMENT PRIMARY KEY,
  buyer_id INT NOT NULL,
  sell_id INT NULL,
  item_name VARCHAR(180) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Recorded',
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_purchases_buyer_id (buyer_id)
);

CREATE TABLE IF NOT EXISTS inquiries (
  inquiryID INT AUTO_INCREMENT PRIMARY KEY,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  sell_id INT NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Sent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_inquiries_buyer_id (buyer_id),
  INDEX idx_inquiries_seller_id (seller_id),
  CONSTRAINT fk_inquiries_buyer FOREIGN KEY (buyer_id) REFERENCES users(userID) ON DELETE CASCADE,
  CONSTRAINT fk_inquiries_seller FOREIGN KEY (seller_id) REFERENCES users(userID) ON DELETE CASCADE,
  CONSTRAINT fk_inquiries_sell FOREIGN KEY (sell_id) REFERENCES sell(sellID) ON DELETE CASCADE
);

-- Worker Management Tables
CREATE TABLE IF NOT EXISTS workers (
  workerID INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role VARCHAR(80) NOT NULL,
  status VARCHAR(30) DEFAULT 'Active',
  phone VARCHAR(20) NULL,
  city VARCHAR(80) NULL,
  availability_status VARCHAR(30) DEFAULT 'Full-time',
  onboarded TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_workers_user (user_id),
  CONSTRAINT fk_workers_user FOREIGN KEY (user_id) REFERENCES users(userID) ON DELETE CASCADE,
  INDEX idx_workers_status (status)
);

CREATE TABLE IF NOT EXISTS worker_profiles (
  worker_profile_id INT AUTO_INCREMENT PRIMARY KEY,
  worker_id INT NOT NULL,
  qualifications VARCHAR(255) NULL,
  experience_years INT NULL,
  service_specialization VARCHAR(200) NULL,
  certifications VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_worker_profiles_worker (worker_id),
  CONSTRAINT fk_worker_profiles_worker FOREIGN KEY (worker_id) REFERENCES workers(workerID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS worker_assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  worker_id INT NOT NULL,
  request_id INT NOT NULL,
  status VARCHAR(30) DEFAULT 'Assigned',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  notes TEXT NULL,
  INDEX idx_worker_assignments_worker (worker_id),
  INDEX idx_worker_assignments_request (request_id),
  INDEX idx_worker_assignments_status (status),
  CONSTRAINT fk_worker_assignments_worker FOREIGN KEY (worker_id) REFERENCES workers(workerID) ON DELETE CASCADE,
  CONSTRAINT fk_worker_assignments_request FOREIGN KEY (request_id) REFERENCES service_requests(requestID) ON DELETE CASCADE
);

-- Intentionally no debug SELECT statements.