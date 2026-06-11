import type { APIRoute } from 'astro';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

export const POST: APIRoute = async ({ request }) => {
  let data;
  try {
    data = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid JSON input', error: error.message }), { status: 400 });
  }

  const dirPath = 'C:\\Users\\ASUS\\Desktop\\uco system\\responsesDB';
  const filePath = path.join(dirPath, 'submissions.xlsx');

  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();

  // Load existing file or create a new one
  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
  } else {
    workbook.addWorksheet('Submissions');
  }

  const worksheet = workbook.getWorksheet('Submissions');

  // Add header if new file
  if (worksheet.rowCount === 0) {
    worksheet.addRow(['Name', 'Email', 'RequestType', 'Details', 'Timestamp']);
  }

  // Add data row
  worksheet.addRow([
    data.name,
    data.email,
    data.requestType,
    data.details,
    new Date().toISOString()
  ]);

  await workbook.xlsx.writeFile(filePath);

  return new Response(JSON.stringify({ message: 'Success' }), {
    status: 200,
    headers: {
      'content-type': 'application/json'
    }
  });
};
