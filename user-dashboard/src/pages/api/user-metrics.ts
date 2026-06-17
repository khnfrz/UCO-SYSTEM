import type { APIRoute } from 'astro';
import mysql from 'mysql2/promise';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: import.meta.env.DB_HOST,
      user: import.meta.env.DB_USER,
      password: import.meta.env.DB_PASSWORD,
      database: import.meta.env.DB_NAME,
      port: parseInt(import.meta.env.DB_PORT || '3306')
    });

    const [rows] = await connection.execute(
      `SELECT 
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'In-process' THEN 1 END) as inProcess,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'Rejected' THEN 1 END) as rejected
       FROM submissions WHERE user_id = ?`,
      [userId]
    );

    await connection.end();

    const metrics = (rows as any[])[0] || { pending: 0, inProcess: 0, completed: 0, rejected: 0 };

    return new Response(JSON.stringify(metrics), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
};
