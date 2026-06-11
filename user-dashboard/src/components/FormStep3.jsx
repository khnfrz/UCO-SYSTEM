import React from 'react';

const socialAccounts = ['Facebook', 'Twitter', 'Instagram', 'YouTube', 'TikTok'];
const serviceOptions = [
  'Posting by Official AdZU Social Media Accounts (Text, photos, and videos)',
  'Layout/Design and Posting of graphics (Social cards and infographics)',
  'Other'
];

export default function FormStep3({ formData, setFormData, onNext, onPrev }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      requestDetails: {
        ...formData.requestDetails,
        [name]: value
      }
    });
  };

  const details = formData.requestDetails || {};
  const isComplete = details.requestingOffice && details.requestedBy && details.socialAccount && details.serviceType;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Request Details</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Specifics for {formData.requestType}*</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-[0.15em]">Requesting Office / Unit*</label>
          <input 
            type="text" 
            name="requestingOffice"
            value={details.requestingOffice || ''}
            onChange={handleChange}
            placeholder="e.g. Office of Student Affairs"
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-[0.15em]">Requested by*</label>
            <input 
              type="text" 
              name="requestedBy"
              value={details.requestedBy || ''}
              onChange={handleChange}
              placeholder="Name & Mobile No."
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-[0.15em]">Alternate Contact</label>
            <input 
              type="text" 
              name="alternateContact"
              value={details.alternateContact || ''}
              onChange={handleChange}
              placeholder="Name & Mobile No."
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 mb-3 uppercase tracking-[0.15em]">Social Media Platform*</label>
          <div className="flex flex-wrap gap-2">
            {socialAccounts.map(account => (
              <button
                key={account}
                onClick={() => handleChange({ target: { name: 'socialAccount', value: account } })}
                className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${details.socialAccount === account ? 'bg-[#0A1C5C] border-[#0A1C5C] text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'}`}
              >
                {account}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 mb-3 uppercase tracking-[0.15em]">Specific Service Required*</label>
          <div className="space-y-3">
            {serviceOptions.map(option => (
              <button
                key={option}
                onClick={() => handleChange({ target: { name: 'serviceType', value: option } })}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${details.serviceType === option ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${details.serviceType === option ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`}>
                  {details.serviceType === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className={`text-xs font-bold leading-relaxed ${details.serviceType === option ? 'text-indigo-900' : 'text-slate-600'}`}>{option}</span>
              </button>
            ))}
            {details.serviceType === 'Other' && (
              <input 
                type="text" 
                name="otherService"
                value={details.otherService || ''}
                onChange={handleChange}
                placeholder="Please describe your specific requirement..."
                className="w-full p-4 mt-2 bg-white border-2 border-indigo-200 rounded-2xl focus:border-indigo-500 outline-none transition-all text-sm font-medium animate-in fade-in"
              />
            )}
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
          onClick={onNext} 
          disabled={!isComplete}
          className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${isComplete ? 'bg-[#0A1C5C] text-white hover:bg-indigo-700 hover:-translate-y-1 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
