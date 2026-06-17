import type { APIRoute } from 'astro';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: import.meta.env.DB_HOST,
      user: import.meta.env.DB_USER,
      password: import.meta.env.DB_PASSWORD,
      database: import.meta.env.DB_NAME,
      port: parseInt(import.meta.env.DB_PORT || '3306')
    });

    // Hash incoming password to compare
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Find user
    const [rows] = await connection.execute(
      'SELECT id, email, full_name as fullName, office FROM user_accounts WHERE email = ? AND password = ?',
      [email, hashedPassword]
    );

    const user = (rows as any[])[0];

    await connection.end();

    if (user) {
      return new Response(JSON.stringify({ message: 'Login successful', user }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
};
