import React, { useState, useEffect } from 'react';
import SubmissionChat from './SubmissionChat';

export default function SubmissionOverview() {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [user, setUser] = useState(null);
  const viewerBase = 'http://localhost:3001';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subId = urlParams.get('id');
    setId(subId);

    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(savedUser);

    if (subId && savedUser.id) {
      fetch(`/api/my-submissions?userId=${savedUser.id}`)
        .then(res => res.json())
        .then(data => {
          const found = data.find(s => s.id.toString() === subId);
          if (found) {
            setSubmission(found);
            loadFiles(found);
          }
          setLoading(false);
        });
    } else {
        setLoading(false);
    }
  }, []);

  const loadFiles = (sub) => {
    const parsePath = (fullPath) => {
      if (!fullPath) return { folder: '', filename: '' };
      const parts = fullPath.split(/[\\/]/);
      const folderIndex = parts.findIndex(p => p.includes('_20'));
      if (folderIndex !== -1) {
        return { folder: parts[folderIndex], filename: parts[folderIndex + 1] };
      }
      return { folder: parts[parts.length - 2], filename: parts[parts.length - 1] };
    };

    const { folder } = parsePath(sub.ppTemplate || sub.image || sub.video || sub.audio);
    if (folder) {
      fetch(`${viewerBase}/list/${folder}`)
        .then(res => res.json())
        .then(data => {
          setFiles(data.map(f => ({ name: f, folder })));
          const initial = data.find(f => f.endsWith('.docx') || f.endsWith('.pdf'));
          if (initial) setActiveFile({ name: initial, folder });
        });
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse font-black uppercase text-slate-400">Loading Request Overview...</div>;
  if (!submission) return <div className="p-8 text-center text-rose-500 font-bold uppercase">Request not found or unauthorized.</div>;

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Left Column: Preview and Discussion */}
      <div className="flex-[2] space-y-8">
        {/* Discussion Section (Chat) */}
        <SubmissionChat submissionId={id} senderRole="user" />

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/20 border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Resource Preview</h3>
            {activeFile && <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">{activeFile.name}</span>}
          </div>
          <div className="h-[500px] md:h-[700px] bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
            {activeFile ? (
              <iframe 
                src={`${viewerBase}/${activeFile.name.endsWith('.docx') ? 'view/docx' : 'file'}/${activeFile.folder}/${activeFile.name}`}
                className="w-full h-full border-0"
              />
            ) : (
              <div className="text-center text-slate-400 dark:text-slate-600">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-[10px] font-black uppercase tracking-widest">Select a file to preview</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/20 border border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 border-b border-slate-50 dark:border-slate-800/80 pb-4 uppercase tracking-widest">Event Context</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium italic">
            {submission.eventDetails || 'No additional details provided.'}
          </p>
        </div>
      </div>

      {/* Right Column: Meta Details and Attachments */}
      <div className="flex-1 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/20 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8 border-b border-slate-50 dark:border-slate-800/80 pb-4">
            <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Request Status</h2>
            <span id="current-status-badge" className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
              submission.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
              submission.status === 'In-process' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' :
              submission.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' :
              'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
            }`}>
              {submission.status || 'Pending'}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-4">{submission.request_type}</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {[
                  { label: 'Office', value: submission.office_name },
                  { label: 'Service Requested', value: submission.service },
                  { label: 'Reference Mobile', value: submission.nNo },
                  { label: 'Social Media', value: submission.socMed }
                ].map(item => (
                  <div key={item.label} className="group border-l-2 border-slate-100 dark:border-slate-800 pl-4 hover:border-indigo-500 transition-colors">
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.label}</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{item.value}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-slate-950/20 border border-slate-100 dark:border-slate-800">
          <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-50 dark:border-slate-800/80 pb-4">Attached Materials</h2>
          <div className="space-y-3">
            {files.map(file => (
              <button 
                key={file.name}
                onClick={() => setActiveFile(file)}
                className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition flex items-center justify-between ${
                  activeFile?.name === file.name 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="truncate max-w-[200px]">{file.name}</span>
                <span className="text-lg">↗</span>
              </button>
            ))}
            {files.length === 0 && <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center font-medium">No files attached.</p>}
          </div>
        </div>

        <div className="bg-indigo-900 p-8 rounded-[2rem] shadow-2xl shadow-indigo-900/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-2">Communication Note</p>
            <p className="text-xs leading-relaxed font-medium">Use the discussion thread to coordinate with the UCO admin regarding this request.</p>
        </div>
      </div>
    </div>
  );
}
