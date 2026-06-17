import type { APIRoute } from 'astro';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password, fullName, office } = await request.json();

    if (!email || !password || !fullName || !office) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: import.meta.env.DB_HOST,
      user: import.meta.env.DB_USER,
      password: import.meta.env.DB_PASSWORD,
      database: import.meta.env.DB_NAME,
      port: parseInt(import.meta.env.DB_PORT || '3306')
    });

    // Check if user exists
    const [existing] = await connection.execute('SELECT id FROM user_accounts WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      await connection.end();
      return new Response(JSON.stringify({ message: 'Email already registered' }), { status: 400 });
    }

    // Hash password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Insert user
    const [result] = await connection.execute(
      'INSERT INTO user_accounts (email, password, full_name, office) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, fullName, office]
    );

    const userId = (result as any).insertId;
    const user = { id: userId, email, fullName, office };

    await connection.end();

    return new Response(JSON.stringify({ message: 'User registered successfully', user }), { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
};
