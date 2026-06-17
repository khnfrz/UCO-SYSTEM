import type { APIRoute } from 'astro';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; 
import crypto from 'crypto';

// Helper to save uploaded files
const saveFile = async (file, uploadDir) => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filePath = path.join(uploadDir, file.name);
  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
  // Store path relative to the project root for DB
  return path.relative(path.join(process.cwd(), '..'), filePath);
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Extract text fields
    const userId = formData.get('user_id') as string;
    const email = formData.get('email') as string;
    const requestType = formData.get('requestType') as string;
    const mName = formData.get('requestedByName') as string;
    const nNo = formData.get('requestedByMobile') as string;
    const aName = formData.get('alternateContactName') as string;
    const aNo = formData.get('alternateContactMobile') as string;
    const socMed = formData.get('socialAccount') as string;
    const service = formData.get('serviceType') as string;
    const eventDetails = formData.get('eventDetails') as string;
    const office_name = formData.get('office_name') as string || 'UnknownOffice';

    // Sanitize office name and create timestamp for folder safety
    const safeOfficeName = office_name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = `${safeOfficeName}_${timestamp}`;

    // Path outside user-dashboard
    const uploadDir = path.join(process.cwd(), '..', 'uploads', folderName);

    let ppTemplate = null;
    let image = null;
    let video = null;
    let audio = null;

    const files = formData.getAll('files') as File[];

    for (const file of files) {
      if (file.size === 0) continue; // Skip empty file entries
      const savedPath = await saveFile(file, uploadDir);
      if (file.name.endsWith('.docx') || file.name.endsWith('.pdf')) ppTemplate = savedPath;
      else if (file.type.startsWith('image/')) image = savedPath;
      else if (file.type.startsWith('video/')) video = savedPath;
      else if (file.type.startsWith('audio/')) audio = savedPath;
    }

    // Database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306')
    });

    // Insert into MySQL
    await connection.execute(
      `INSERT INTO submissions (email, request_type, mName, nNo, aName, aNo, socMed, service, eventDetails, office_name, ppTemplate, image, video, audio, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, requestType, mName, nNo, aName, aNo, socMed, service, eventDetails, office_name, ppTemplate, image, video, audio, userId]
    );

    await connection.end();

    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Submission error:', error);
    return new Response(JSON.stringify({ message: 'Error processing submission', error: error.message }), { status: 500 });
  }
};
