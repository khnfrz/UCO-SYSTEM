import type { APIRoute } from 'astro';
import mysql from 'mysql2/promise';

export const prerender = false;

const dbConfig = {
  host: import.meta.env.DB_HOST,
  user: import.meta.env.DB_USER,
  password: import.meta.env.DB_PASSWORD,
  database: import.meta.env.DB_NAME,
  port: parseInt(import.meta.env.DB_PORT || '3306')
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const submissionId = url.searchParams.get('submissionId');

    if (!submissionId) {
      return new Response(JSON.stringify({ message: 'submissionId is required' }), { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM submission_messages WHERE submission_id = ? ORDER BY created_at ASC',
      [submissionId]
    );
    await connection.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(JSON.stringify({ message: 'Error fetching messages' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { submissionId, message, senderRole } = body;

    if (!submissionId || !message || !senderRole) {
      return new Response(JSON.stringify({ message: 'submissionId, message, and senderRole are required' }), { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO submission_messages (submission_id, message, sender_role) VALUES (?, ?, ?)',
      [submissionId, message, senderRole]
    );
    await connection.end();

    return new Response(JSON.stringify({ message: 'Message sent successfully' }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return new Response(JSON.stringify({ message: 'Error sending message' }), { status: 500 });
  }
};
