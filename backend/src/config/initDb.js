const pool = require('./database');

const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'borrower' CHECK (role IN ('borrower', 'loan_officer', 'admin')),
        phone VARCHAR(15),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(10),
        date_of_birth DATE,
        pan_number VARCHAR(10),
        aadhaar_number VARCHAR(12),
        profile_image TEXT,
        is_active BOOLEAN DEFAULT true,
        reset_token TEXT,
        reset_token_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Loan applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS loan_applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        loan_type VARCHAR(50) NOT NULL CHECK (loan_type IN ('personal', 'education', 'vehicle', 'business', 'home')),
        loan_amount NUMERIC(15, 2) NOT NULL,
        interest_rate NUMERIC(5, 2) NOT NULL DEFAULT 12.00,
        tenure_months INTEGER NOT NULL,
        monthly_emi NUMERIC(15, 2),
        total_interest NUMERIC(15, 2),
        total_amount NUMERIC(15, 2),
        purpose TEXT,
        employment_type VARCHAR(30) CHECK (employment_type IN ('salaried', 'self_employed', 'business', 'freelancer')),
        employer_name VARCHAR(200),
        monthly_income NUMERIC(15, 2),
        annual_income NUMERIC(15, 2),
        experience_years INTEGER,
        status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'verified', 'approved', 'rejected', 'disbursed', 'closed')),
        officer_id INTEGER REFERENCES users(id),
        officer_remarks TEXT,
        rejection_reason TEXT,
        approved_at TIMESTAMP,
        disbursed_at TIMESTAMP,
        credit_score INTEGER,
        risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'very_high')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        loan_id INTEGER REFERENCES loan_applications(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('aadhaar', 'pan', 'salary_slip', 'bank_statement', 'address_proof', 'photo', 'other')),
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(50),
        is_verified BOOLEAN DEFAULT false,
        verified_by INTEGER REFERENCES users(id),
        verified_at TIMESTAMP,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // EMI schedules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS emi_schedules (
        id SERIAL PRIMARY KEY,
        loan_id INTEGER REFERENCES loan_applications(id) ON DELETE CASCADE,
        emi_number INTEGER NOT NULL,
        due_date DATE NOT NULL,
        emi_amount NUMERIC(15, 2) NOT NULL,
        principal_component NUMERIC(15, 2) NOT NULL,
        interest_component NUMERIC(15, 2) NOT NULL,
        outstanding_balance NUMERIC(15, 2) NOT NULL,
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'partially_paid')),
        paid_amount NUMERIC(15, 2) DEFAULT 0,
        paid_date TIMESTAMP,
        penalty_amount NUMERIC(15, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        loan_id INTEGER REFERENCES loan_applications(id) ON DELETE CASCADE,
        emi_id INTEGER REFERENCES emi_schedules(id),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        stripe_payment_id TEXT,
        stripe_session_id TEXT,
        amount NUMERIC(15, 2) NOT NULL,
        payment_method VARCHAR(30),
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
        transaction_id VARCHAR(100),
        receipt_url TEXT,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(30) CHECK (type IN ('emi_reminder', 'payment_success', 'loan_approved', 'loan_rejected', 'document_verified', 'general', 'warning')),
        is_read BOOLEAN DEFAULT false,
        link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Defaulters table
    await client.query(`
      CREATE TABLE IF NOT EXISTS defaulters (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        loan_id INTEGER REFERENCES loan_applications(id) ON DELETE CASCADE,
        emi_id INTEGER REFERENCES emi_schedules(id),
        overdue_amount NUMERIC(15, 2) NOT NULL,
        penalty_amount NUMERIC(15, 2) DEFAULT 0,
        days_overdue INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'legal')),
        reminder_sent BOOLEAN DEFAULT false,
        last_reminder_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Audit logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id INTEGER,
        details JSONB,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_loans_user ON loan_applications(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_loans_status ON loan_applications(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_emi_loan ON emi_schedules(loan_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_emi_status ON emi_schedules(payment_status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_payments_loan ON payments(loan_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_defaulters_user ON defaulters(user_id);`);

    await client.query('COMMIT');
    console.log('✅ Database tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = initDatabase;
