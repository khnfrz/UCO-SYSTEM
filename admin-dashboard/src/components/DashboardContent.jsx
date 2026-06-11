import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

// --- GOOGLE FORMS DATA SIMULATION SERVICE ---
const getFormSubmissionData = (period) => {
  const multipliers = { '12 Months': 1.5, '6 Months': 1.0, '30 Days': 0.7, '7 Days': 0.3 };
  const mult = multipliers[period] || 1;

  return {
    metrics: [
      { title: 'Total Responses Submitted', value: Math.round(342 * mult), change: '+18.2%' },
      { title: 'Pending Review', value: Math.round(14 * mult), change: 'Requires Action' },
      { title: 'Fulfilled Requests', value: Math.round(328 * mult), change: '95.9% Rate' },
    ],
    submissionChart: {
      series: [{
        name: 'Form Submissions',
        data: [
          Math.round(25*mult), Math.round(30*mult), Math.round(45*mult), Math.round(22*mult), 
          Math.round(55*mult), Math.round(62*mult), Math.round(48*mult), Math.round(38*mult), 
          Math.round(74*mult), Math.round(85*mult), Math.round(40*mult), Math.round(50*mult)
        ],
      }],
      avgPerMonth: Math.round(47 * mult),
      medianSubmissions: 45,
    },
    requestTypeChart: {
      series: [
        Math.round(115 * mult), // Social Media (Largest - Base Navy)
        Math.round(72 * mult),  // Photo/Video Doc (Vibrant Sky Blue)
        Math.round(58 * mult),  // Print Media (Soft Powder Blue)
        Math.round(45 * mult),  // Website Story (Muted Navy)
        Math.round(22 * mult),  // Local Media (Alternating Sky Blue)
        Math.round(18 * mult),  // File Photos (Alternating Powder Blue)
        Math.round(12 * mult)   // FB Live (Light Tint Accent)
      ],
      labels: [
        'Official AdZU Social Media Accounts',
        'Photo/Video Documentation',
        'Print Media (Design/Layout)',
        'Official AdZU Website (Story)',
        'Local Media and Other Services',
        'File Photos',
        'Facebook Live'
      ]
    },
    serviceTypeChart: {
      series: [
        Math.round(65 * mult),  // Posting by Official AdZU Social Media (Base Navy)
        Math.round(42 * mult),  // Layout/Design and Posting of graphics (Vibrant Sky Blue)
        Math.round(12 * mult)   // Other (Soft Powder Blue)
      ],
      labels: [
        'Posting by Official AdZU Social Media Accounts (Text, photos, and videos)',
        'Layout/Design and Posting of graphics (Social cards and infographics)',
        'Other'
      ]
    },
    submittedResponses: [
      { id: 1, name: 'Dr. Jane Smith', dept: 'College of Science', type: 'Photo/Video Documentation', date: 'June 09, 2026', status: 'Pending' },
      { id: 2, name: 'Prof. Alan Turing', dept: 'Computer Science', type: 'Official AdZU Social Media Accounts', date: 'June 08, 2026', status: 'In Progress' },
      { id: 3, name: 'Coach Eric Red', dept: 'Athletics Department', type: 'Print Media (Design/Layout)', date: 'June 06, 2026', status: 'Completed' },
      { id: 4, name: 'Sarah Jenkins', dept: 'Alumni Affairs', type: 'Official AdZU Website (Story)', date: 'June 05, 2026', status: 'Completed' },
      { id: 5, name: 'Michael Chang', dept: 'Student Council', type: 'File Photos', date: 'June 02, 2026', status: 'Rejected' },
    ].slice(0, Math.round(5 * mult)),
  };
};

const periods = ['12 Months', '6 Months', '30 Days', '7 Days'];

const statusColors = {
  'Pending': 'text-amber-900 bg-amber-200/80',
  'In Progress': 'text-blue-900 bg-blue-200/80',
  'Completed': 'text-green-900 bg-green-200/80',
  'Rejected': 'text-rose-900 bg-rose-200/80',
};



const CustomLegend = ({ labels, colors }) => (
  <div className="flex flex-col gap-2 mt-4">
    {labels.map((label, index) => (
      <div key={label} className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></span>
        <span className="text-xs text-slate-600 font-medium">{label}</span>
      </div>
    ))}
  </div>
);

export default function DashboardContent() {
  const [timePeriod, setTimePeriod] = useState('30 Days');
  const [data, setData] = useState(getFormSubmissionData('30 Days'));
  
  // High-energy palette used for both charts and custom legends
  const chartColors = ['#0A1C5C', '#4FA3FF', '#A4CFFF', '#1E3275', '#63AFFF', '#BCD8FF', '#05103B'];

  useEffect(() => {
    setData(getFormSubmissionData(timePeriod));
  }, [timePeriod]);

  const chartFontFamily = '"Plus Jakarta Sans", "Inter", sans-serif';

  // 1. Bar Chart Config with "Bright Tech" accents
  const barChartOptions = {
    chart: { type: 'bar', height: 320, fontFamily: chartFontFamily, toolbar: { show: false }, background: 'transparent' },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '55%', distributed: true } },
    // Inactive months use a clean slate gray, while primary/active data uses the vibrant tech palette highlights
    colors: ['#cbd5e1', '#cbd5e1', '#cbd5e1', '#cbd5e1', '#cbd5e1', '#cbd5e1', '#cbd5e1', '#cbd5e1', '#A4CFFF', '#4FA3FF', '#0A1C5C', '#cbd5e1'], 
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    grid: { borderColor: '#e2e8f0' },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { y: { formatter: (val) => `${val} Requests` } },
  };

  // 2. Pie/Donut Chart Options Generator configured with the High Energy palette
  const getDonutOptions = (labels, totalLabel) => ({
    chart: { type: 'donut', height: 340, fontFamily: chartFontFamily, background: 'transparent' },
    labels: labels,
    // Sequential high-energy looping: Base Navy, Vibrant Sky Blue, Soft Powder Blue, and safe contrast variations
    colors: ['#0A1C5C', '#4FA3FF', '#A4CFFF', '#1E3275', '#63AFFF', '#BCD8FF', '#05103B'],
    stroke: { width: 2, colors: ['#f8fafc'] }, // Blends clean stroke edges into your off-white card backgrounds
    dataLabels: { enabled: false },
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              show: true,
              label: totalLabel,
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    },
    tooltip: { y: { formatter: (val) => `${val} Submissions` } }
  });

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans max-w-[1600px] mx-auto bg-slate-200 min-h-screen">
      
      {/* 1. View Navigation Filter Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200 pb-2">
        {['All Responses', 'By Department', 'By Media Type', 'Archived Forms'].map((tab, i) => (
          <button key={tab} className={`pb-2 text-sm font-semibold transition ${i === 0 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>{tab}</button>
        ))}
      </div>

      {/* 2. Status Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.metrics.map((metric, i) => (
          <div key={i} className="bg-slate-50/90 p-6 rounded-2xl shadow-xs border border-slate-200/60">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{metric.title}</p>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${i === 1 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                {metric.change}
              </span>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* 3. Main Velocity Bar Chart Component */}
      <div className="bg-slate-50/90 p-6 rounded-2xl shadow-xs border border-slate-200/60 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Form Submission Velocity</h2>
            <p className="text-xs text-gray-400">Total volume tracking across calendar months</p>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl text-xs font-medium">
            {periods.map(period => (
              <button 
                key={period} 
                onClick={() => setTimePeriod(period)}
                className={`px-3 py-1.5 rounded-lg transition ${timePeriod === period ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-200/60 pb-4 md:pb-0 md:pr-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Avg. / Month</p>
            <p className="text-3xl font-black text-gray-900 my-1">{data.submissionChart.avgPerMonth}</p>
            <p className="text-[11px] text-gray-400">Calculated within timeframe.</p>
          </div>
          <div className="md:col-span-3">
            <Chart options={barChartOptions} series={data.submissionChart.series} type="bar" height={260} />
          </div>
        </div>
      </div>

      {/* 4. Side-by-Side Pie Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Type of Request Donut Chart */}
        <div className="bg-slate-50/90 p-6 rounded-2xl shadow-xs border border-slate-200/60 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Type of Request</h2>
            <p className="text-xs text-gray-400 mb-4">Distribution by Google Form selection rules</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="min-w-[200px]">
                <Chart 
                  options={getDonutOptions(data.requestTypeChart.labels, 'Total Requests')} 
                  series={data.requestTypeChart.series} 
                  type="donut" 
                  width="100%" 
                  height={240} 
                />
            </div>
            <CustomLegend labels={data.requestTypeChart.labels} colors={chartColors} />
          </div>
        </div>

        {/* Right Side: Service Type Sub-Category Donut Chart */}
        <div className="bg-slate-50/90 p-6 rounded-2xl shadow-xs border border-slate-200/60 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Service Type Breakdown</h2>
            <p className="text-xs text-gray-400 mb-4">Social media assets and layout request segmentation</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="min-w-[200px]">
                <Chart 
                  options={getDonutOptions(data.serviceTypeChart.labels, 'Total Assets')} 
                  series={data.serviceTypeChart.series} 
                  type="donut" 
                  width="100%" 
                  height={240} 
                />
            </div>
            <CustomLegend labels={data.serviceTypeChart.labels} colors={chartColors} />
          </div>
        </div>

      </div>

      {/* 5. Form Submissions Inbox Table */}
      <div className="bg-slate-50/90 rounded-2xl shadow-xs border border-slate-200/60 overflow-hidden">
        <div className="p-6 border-b border-slate-200/60 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Form Responses Inbox</h2>
            <p className="text-xs text-gray-400">Real-time processing deck</p>
          </div>
          <span className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-semibold">Live Feed Synced</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-slate-200/40 border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Requestor</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Media Service Type</th>
                <th className="px-6 py-4">Date Submitted</th>
                <th className="px-6 py-4">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {data.submittedResponses.map((response) => (
                <tr key={response.id} className="hover:bg-slate-200/30 transition">
                  <td className="px-6 py-4 text-gray-400 font-mono">#{response.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{response.name}</td>
                  <td className="px-6 py-4 font-semibold text-gray-600">{response.dept}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-200 font-semibold text-slate-800 text-xs px-2.5 py-1 rounded-md font-medium max-w-[220px] inline-block truncate" title={response.type}>
                      {response.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-500">{response.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[response.status]}`}>
                      {response.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}