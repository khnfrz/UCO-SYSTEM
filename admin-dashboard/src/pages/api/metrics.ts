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

    const whereClause = office ? 'WHERE office_name = ?' : '';
    const statusWhereClause = (status) => office ? `WHERE office_name = ? AND status = '${status}'` : `WHERE status = '${status}'`;
    const params = office ? [office] : [];

    // 1. Get Metrics
    const [totalRows] = await connection.execute(`SELECT COUNT(*) as total FROM submissions ${whereClause}`, params);
    const [pendingRows] = await connection.execute(`SELECT COUNT(*) as pending FROM submissions ${statusWhereClause('Pending')}`, params); 
    const [inProcessRows] = await connection.execute(`SELECT COUNT(*) as inProcess FROM submissions ${statusWhereClause('In-process')}`, params);
    const [completedRows] = await connection.execute(`SELECT COUNT(*) as completed FROM submissions ${statusWhereClause('Completed')}`, params);
    const [rejectedRows] = await connection.execute(`SELECT COUNT(*) as rejected FROM submissions ${statusWhereClause('Rejected')}`, params);
    
    // 2. Get Velocity (Group by month)
    const [velocityRows] = await connection.execute(`
        SELECT MONTH(created_at) as month, COUNT(*) as count 
        FROM submissions 
        ${office ? 'WHERE office_name = ? AND' : 'WHERE'} YEAR(created_at) = YEAR(CURDATE())
        GROUP BY MONTH(created_at)
    `, params);

    // 3. Get Request Type Distribution
    const [requestTypeRows] = await connection.execute(`
        SELECT request_type, COUNT(*) as count 
        FROM submissions 
        ${whereClause}
        GROUP BY request_type
    `, params);

    // 4. Get Service Type Distribution
    const [serviceTypeRows] = await connection.execute(`
        SELECT service, COUNT(*) as count 
        FROM submissions 
        ${whereClause}
        GROUP BY service
    `, params);

    await connection.end();

    const total = (totalRows as any)[0]?.total || 0;
    const pending = (pendingRows as any)[0]?.pending || 0;
    const inProcess = (inProcessRows as any)[0]?.inProcess || 0;
    const completed = (completedRows as any)[0]?.completed || 0;
    const rejected = (rejectedRows as any)[0]?.rejected || 0;

    return new Response(JSON.stringify({
        metrics: {
            total,
            pending,
            inProcess,
            completed,
            rejected
        },
        velocity: velocityRows || [],
        requestTypes: requestTypeRows || [],
        serviceTypes: serviceTypeRows || []
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return new Response(JSON.stringify({ message: 'Error fetching metrics' }), { status: 500 });
  }
};
