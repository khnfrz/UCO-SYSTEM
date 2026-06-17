import React, { useState, useEffect } from "react";
import { useResponsiveLayout } from "./layout/ResponsiveLayout";
import { DesktopDashboardWrapper } from "./layout/DesktopViewing";
import { MobileDashboardWrapper } from "./layout/MobileViewing";
import SearchBar from "./SearchBar";

export default function SubmissionsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const { isMobile } = useResponsiveLayout();
  const DashboardWrapper = isMobile
    ? MobileDashboardWrapper
    : DesktopDashboardWrapper;

  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/submissions")
      .then((res) => res.json())
      .then((data) => {
        const sortedData = [...data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setSubmissions(sortedData);
        setTotal(sortedData.length);
      })
      .catch((err) => console.error("Failed to fetch submissions:", err));
  }, []);

  const submissionMatches = submissions.filter(s => 
    (s.mName && s.mName.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.request_type && s.request_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.service && s.service.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderSearchResults = () => {
    if (!searchQuery) return null;
    return (
      <div className="absolute top-full right-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto no-scrollbar py-2">
        {submissionMatches.length > 0 ? (
            submissionMatches.map(s => (
              <div 
                key={s.id} 
                className="px-4 py-2.5 text-[11px] hover:bg-[#F4F7FE] cursor-pointer flex flex-col transition-colors"
                onClick={() => window.location.href = `/submission?id=${s.id}`}
              >
                <span className="font-black text-[#1B2559] uppercase">{s.mName || 'Unknown Name'} <span className="text-[9px] font-bold text-[#A3AED0] ml-1">#{s.id}</span></span>
                <span className="text-[10px] text-[#707EAE]">{s.email || 'No email'} - {s.request_type || 'Unknown type'}</span>
              </div>
            ))
        ) : (
          <div className="px-4 py-6 text-center text-[11px] font-bold text-[#707EAE]">No matches found for "{searchQuery}"</div>
        )}
      </div>
    );
  };

  return (
    <DashboardWrapper>
      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-black text-[#1B2559] uppercase tracking-wider">
            ALL SUBMISSIONS
          </h2>

          <p className="text-[15px] font-black text-[#A3AED0] uppercase tracking-widest mt-1">
            TOTAL RESPONSES: <span className="text-[#1B2559]">{submissionMatches.length}</span>
          </p>
        </div>
        <SearchBar
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchDropdown(true);
          }}
          onFocus={() => setShowSearchDropdown(true)}
          onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
        >
          {showSearchDropdown && renderSearchResults()}
        </SearchBar>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[30px] shadow-[0_18px_40px_rgba(112,144,176,0.12)] overflow-hidden">
        <div className="p-8 pb-4">
          <h2 className="text-lg font-black text-[#1B2559]">
            Form Responses Box
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#F4F7FE]">
                <th className="px-8 py-4 text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">
                  REQUESTOR
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">
                  EMAIL
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">
                  OFFICE
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">
                  REQUEST TYPE
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">
                  SERVICE
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">
                  DATE
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-[#A3AED0] uppercase tracking-widest text-center">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F7FE]">
              {submissionMatches.map((s) => {
                const status = s.status || "Pending";
                let statusClass = "bg-[#FFF9E6] text-[#FFB800]";
                if (status === "In-process")
                  statusClass = "bg-[#E5F1FF] text-[#0075FF]";
                else if (status === "Completed")
                  statusClass = "bg-[#E6FFF5] text-[#05CD99]";
                else if (status === "Rejected")
                  statusClass = "bg-[#FFE6E6] text-[#EE5D50]";

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-[#F4F7FE]/50 transition-colors cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/submission?id=${s.id}`)
                    }
                  >
                    <td className="px-8 py-5 text-[10px] font-black text-[#1B2559] uppercase">
                      {s.mName}
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-[#1B2559] lowercase">
                      {s.email}
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-[#707EAE]">
                      {s.office || "University Communications Office"}
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-[#707EAE] truncate max-w-[150px]">
                      {s.request_type}
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-[#707EAE] truncate max-w-[200px]">
                      {s.service}
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-[#707EAE]">
                      {new Date(s.created_at).toLocaleDateString()}
                      <br />
                      <span className="text-[9px] opacity-70">
                        {new Date(s.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${statusClass}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardWrapper>
  );
}
