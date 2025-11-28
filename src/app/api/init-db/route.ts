import { NextResponse } from 'next/server';
import { getPgPool } from '@/lib/db';

export async function GET() {
    const pool = getPgPool();

    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Department', 'School'))
      );

      CREATE TABLE IF NOT EXISTS files (
        file_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        file_name VARCHAR(255) NOT NULL,
        file_path TEXT NOT NULL,
        description TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        message_id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(user_id),
        receiver_id INTEGER REFERENCES users(user_id),
        message_text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS issues (
        issue_id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES users(user_id),
        department_id INTEGER REFERENCES users(user_id),
        issue_description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        notification_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        type VARCHAR(50),
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Insert a default admin user if not exists
        await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('System Admin', 'admin@tetfund.gov.ng', 'admin123', 'Admin')
      ON CONFLICT (email) DO NOTHING;
    `);

        // Insert a default department user
        await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('ICT Department', 'ict@tetfund.gov.ng', 'dept123', 'Department')
      ON CONFLICT (email) DO NOTHING;
    `);

        // Insert a default school user
        await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('University of Lagos', 'unilag@edu.ng', 'school123', 'School')
      ON CONFLICT (email) DO NOTHING;
    `);

        return NextResponse.json({ message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Database initialization failed:', error);
        return NextResponse.json({ error: 'Database initialization failed' }, { status: 500 });
    }
}
