import React from 'react';

export default function FormStep4({ formData, setFormData, onSubmit, onPrev }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      eventInfo: {
        ...formData.eventInfo,
        [name]: value
      }
    });
  };

  const info = formData.eventInfo || {};
  const isComplete = info.eventDetails && info.filesUploaded;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Finalize Request</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Information & Verification*</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-[0.15em]">Event Details / Context*</label>
          <textarea 
            name="eventDetails"
            value={info.eventDetails || ''}
            onChange={handleChange}
            rows="5"
            placeholder="Please provide comprehensive details about the event, intended message, and specific posting requirements..."
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium resize-none"
          ></textarea>
        </div>

        <div className={`p-8 border-2 border-dashed rounded-[2rem] transition-all text-center cursor-pointer group ${info.filesUploaded ? 'bg-green-50 border-green-200' : 'bg-slate-50/50 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
             onClick={() => setFormData({...formData, eventInfo: {...info, filesUploaded: true}})}>
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110 ${info.filesUploaded ? 'bg-green-100' : 'bg-white shadow-sm'}`}>
              {info.filesUploaded ? '✅' : '📁'}
            </div>
            <p className={`text-sm font-black tracking-tight ${info.filesUploaded ? 'text-green-700' : 'text-slate-700'}`}>
              {info.filesUploaded ? 'Files Successfully Attached' : 'Attach Event Materials*'}
            </p>
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed max-w-[200px]">
              Press Release Template & up to 4 high-quality photos.
            </p>
            {!info.filesUploaded && (
               <button className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm hover:shadow-md transition-all">Select Files</button>
            )}
          </div>
        </div>

        <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100/50">
          <h3 className="text-[10px] font-black text-[#0A1C5C] uppercase tracking-[0.2em] mb-3">Disclaimer & Consent</h3>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            By submitting, you certify that all information is correct and that necessary permissions have been granted for the use of photos/data in public University promotions.
          </p>
          <div className="mt-4 flex items-center gap-4 border-t border-blue-100/50 pt-4">
             <div className="flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Processing Time</p>
                <p className="text-xs font-bold text-slate-700">3 Working Days</p>
             </div>
             <div className="flex-1 text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Confirmation</p>
                <p className="text-xs font-bold text-slate-700 tracking-tight">Call Local 2025</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button 
          onClick={onPrev}
          className="flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
        >
          Back
        </button>
        <button 
          onClick={onSubmit} 
          disabled={!isComplete}
          className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-200 ${isComplete ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}
