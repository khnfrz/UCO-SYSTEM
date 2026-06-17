const mysql = require('mysql2/promise');

async function generateSubmissions() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'uco_system'
  });

  const requestTypes = [
    "LOCAL MEDIA AND OTHER SERVICES",
    "OFFICIAL ADZU WEBSITE",
    "OFFICIAL ADZU SOCIAL MEDIA ACCOUNTS",
    "PRINT MEDIA",
    "PHOTO/VIDEO DOCUMENTATIONS",
    "FILE PHOTOS",
    "FACEBOOK LIVE",
    "MASCOT"
  ];

  const serviceTypes = [
    "POSTING BY OFFICIAL ADZU SOCIAL MEDIA ACCOUNTS (TEXT, PHOTOS,AND VIDEOS)",
    "LAYOUT/DESIGN AND POSTING OF GRAPHICS (SOCIAL CARDS AND INFOGRAPHICS",
    "OTHER"
  ];

  const statuses = ["Pending", "In-process", "Completed", "Rejected"];

  console.log('Generating 50 synthetic submissions...');

  for (let i = 0; i < 50; i++) {
    const email = `user${i}@example.com`;
    const mName = `User ${i}`;
    const requestType = requestTypes[Math.floor(Math.random() * requestTypes.length)];
    const service = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().slice(0, 19).replace('T', ' ');

    await connection.execute(
      `INSERT INTO submissions (email, request_type, mName, service, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, requestType, mName, service, status, createdAt]
    );
  }

  console.log('50 synthetic submissions inserted successfully.');
  await connection.end();
}

generateSubmissions().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
