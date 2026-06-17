import type { APIRoute } from 'astro';
import mysql from 'mysql2/promise';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const office = url.searchParams.get('office');

    const connection = await mysql.createConnection({
      host: import.meta.env.DB_HOST,
      user: import.meta.env.DB_USER,
      password: import.meta.env.DB_PASSWORD,
      database: import.meta.env.DB_NAME,
      port: parseInt(import.meta.env.DB_PORT || '3306')
    });

    let query = 'SELECT * FROM submissions';
    let params = [];

    if (office) {
        query += ' WHERE office_name = ?';
        params.push(office);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await connection.execute(query, params);
    await connection.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return new Response(JSON.stringify({ message: 'Error fetching submissions' }), { status: 500 });
  }
};
