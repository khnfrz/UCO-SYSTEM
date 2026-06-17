import type { APIRoute } from 'astro';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'uco_system'
    });

    await connection.execute(
      'INSERT INTO admin_accounts (email, password_hash) VALUES (?, ?)',
      [email, hashedPassword]
    );

    await connection.end();

    return new Response(JSON.stringify({ message: 'Admin registered successfully' }), {
      status: 201,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ message: 'Error registering admin' }), { status: 500 });
  }
};
