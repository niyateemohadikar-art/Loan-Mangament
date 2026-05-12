const bcrypt = require('bcryptjs');
const pool = require('./src/config/database');
const initDatabase = require('./src/config/initDb');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await initDatabase();

    // Check if data already exists
    const existing = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(existing.rows[0].count) > 0) {
      console.log('⚠️ Database already has data. Skipping seed.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);

    // Create admin
    const adminPass = await bcrypt.hash('admin123', salt);
    await pool.query(
      `INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5)`,
      ['Admin User', 'admin@loansystem.com', adminPass, 'admin', '9999999999']
    );

    // Create loan officer
    const officerPass = await bcrypt.hash('officer123', salt);
    await pool.query(
      `INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5)`,
      ['Rajesh Kumar', 'officer@loansystem.com', officerPass, 'loan_officer', '9888888888']
    );

    // Create demo borrowers
    const borrowerPass = await bcrypt.hash('borrower123', salt);
    const borrowers = [
      ['Amit Sharma', 'amit@example.com', '9777777777'],
      ['Priya Patel', 'priya@example.com', '9666666666'],
      ['Rahul Verma', 'rahul@example.com', '9555555555'],
    ];

    for (const [name, email, phone] of borrowers) {
      await pool.query(
        `INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5)`,
        [name, email, borrowerPass, 'borrower', phone]
      );
    }

    // Create sample loan applications
    const loans = [
      [3, 'personal', 500000, 12.5, 36, 'Home renovation', 'salaried', 'TCS', 75000, 900000, 5, 'submitted'],
      [4, 'education', 1000000, 10.0, 48, 'MBA program', 'salaried', 'Infosys', 60000, 720000, 3, 'approved'],
      [5, 'vehicle', 300000, 11.0, 24, 'Car purchase', 'self_employed', 'Self', 50000, 600000, 7, 'under_review'],
      [3, 'business', 2000000, 14.0, 60, 'Business expansion', 'business', 'Own Business', 150000, 1800000, 10, 'rejected'],
    ];

    for (const loan of loans) {
      const P = loan[3]; // loan_amount stored at index 3
      const R = loan[4] / 12 / 100;
      const N = loan[5];
      const loanAmount = loan[3];
      const rate = loan[4];
      const tenure = loan[5];
      const monthlyRate = rate / 12 / 100;
      const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
      const totalAmount = emi * tenure;
      const totalInterest = totalAmount - loanAmount;

      const result = await pool.query(
        `INSERT INTO loan_applications 
         (user_id, loan_type, loan_amount, interest_rate, tenure_months, monthly_emi,
          total_interest, total_amount, purpose, employment_type, employer_name,
          monthly_income, annual_income, experience_years, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
        [loan[0], loan[1], loan[2], loan[3], loan[4],
         Math.round(emi * 100) / 100, Math.round(totalInterest * 100) / 100, 
         Math.round(totalAmount * 100) / 100,
         loan[6], loan[7], loan[8], loan[9], loan[10], loan[11], loan[12]]
      );

      // Generate EMI schedule for approved loans
      if (loan[12] === 'approved') {
        let balance = loanAmount;
        for (let i = 1; i <= tenure; i++) {
          const interest = Math.round(balance * monthlyRate * 100) / 100;
          const principal = Math.round((emi - interest) * 100) / 100;
          balance = Math.round((balance - principal) * 100) / 100;
          if (balance < 0) balance = 0;

          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + i);

          const status = i <= 3 ? 'paid' : 'pending';
          await pool.query(
            `INSERT INTO emi_schedules (loan_id, emi_number, due_date, emi_amount, principal_component, 
             interest_component, outstanding_balance, payment_status, paid_amount, paid_date)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [result.rows[0].id, i, dueDate.toISOString().split('T')[0],
             Math.round(emi * 100) / 100, principal, interest, balance, status,
             status === 'paid' ? Math.round(emi * 100) / 100 : 0,
             status === 'paid' ? new Date() : null]
          );
        }
      }
    }

    // Create sample notifications
    const notifs = [
      [3, 'Welcome! 🎉', 'Welcome to Smart Loan Management System.', 'general'],
      [3, 'Loan Application Submitted 📋', 'Your personal loan application has been submitted.', 'general'],
      [4, 'Loan Approved! ✅', 'Your education loan has been approved.', 'loan_approved'],
    ];

    for (const [userId, title, message, type] of notifs) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)`,
        [userId, title, message, type]
      );
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('  Admin:        admin@loansystem.com / admin123');
    console.log('  Loan Officer: officer@loansystem.com / officer123');
    console.log('  Borrower:     amit@example.com / borrower123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
