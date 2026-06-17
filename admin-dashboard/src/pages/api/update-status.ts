import type { APIRoute } from 'astro';
import mysql from 'mysql2/promise';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return new Response(JSON.stringify({ message: 'ID and Status are required', received: body }), { status: 400 });
    }

    const dbConfig = {
      host: import.meta.env.DB_HOST,
      user: import.meta.env.DB_USER,
      password: import.meta.env.DB_PASSWORD,
      database: import.meta.env.DB_NAME,
      port: parseInt(import.meta.env.DB_PORT || '3306')
    };

    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(
      'UPDATE submissions SET status = ? WHERE id = ?',
      [status, id]
    );

    await connection.end();

    return new Response(JSON.stringify({ message: 'Status updated successfully' }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return new Response(JSON.stringify({ 
      message: 'Error updating status', 
      error: error.message,
      stack: error.stack
    }), { status: 500 });
  }
};
