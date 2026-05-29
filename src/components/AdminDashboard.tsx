import React, { useState, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, Trash2, Edit2, Download, Eye, 
  HelpCircle, Calendar, Plus, CheckCircle, Clock, ShieldAlert,
  ArrowRight, FileSpreadsheet, RefreshCcw, Filter, EyeOff, UserCheck
} from 'lucide-react';
import { GuestRegistration, Attachment } from '../types';

interface AdminDashboardProps {
  registrations: GuestRegistration[];
  onEditRegistration: (reg: GuestRegistration) => void;
  onDeleteRegistration: (id: string) => void;
  onAddNewRegistrationClick: () => void;
}

export default function AdminDashboard({ 
  registrations, 
  onEditRegistration, 
  onDeleteRegistration,
  onAddNewRegistrationClick 
}: AdminDashboardProps) {
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [occupancyFilter, setOccupancyFilter] = useState<'All' | 'Single' | 'Double'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Checked-In' | 'Completed'>('All');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Selected Detail Modal Record state
  const [viewingRecord, setViewingRecord] = useState<GuestRegistration | null>(null);

  // Statistics/KPI Computations
  const stats = useMemo(() => {
    const total = registrations.length;
    const checkedIn = registrations.filter(r => r.status === 'Checked-In').length;
    const pending = registrations.filter(r => r.status === 'Pending').length;
    
    const double = registrations.filter(r => r.occupancyType === 'Double').length;
    const ratio = total > 0 ? Math.round((double / total) * 100) : 0;

    return { total, checkedIn, pending, ratio };
  }, [registrations]);

  // Handle Search & Filtration Logic
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      // Basic free-text Search
      const textToSearch = [
        reg.id,
        reg.guestName,
        reg.companyName,
        reg.companyAddress,
        reg.emailId,
        reg.mobileNumber,
        reg.remarks
      ].join(' ').toLowerCase();

      const matchesSearch = textToSearch.includes(searchTerm.toLowerCase());

      // Occupancy Filter
      const matchesOccupancy = occupancyFilter === 'All' || reg.occupancyType === occupancyFilter;

      // Status Filter
      const matchesStatus = statusFilter === 'All' || reg.status === statusFilter;

      // Date Range Filter
      let matchesDates = true;
      if (startDateFilter) {
        matchesDates = matchesDates && reg.checkInDate >= startDateFilter;
      }
      if (endDateFilter) {
        matchesDates = matchesDates && reg.checkInDate <= endDateFilter;
      }

      return matchesSearch && matchesOccupancy && matchesStatus && matchesDates;
    });
  }, [registrations, searchTerm, occupancyFilter, statusFilter, startDateFilter, endDateFilter]);

  // Export registrations as CSV format download
  const handleExportCSV = () => {
    if (registrations.length === 0) return;

    const headers = [
      'Registration ID', 'Guest Name', 'Company Name', 'Address', 
      'Email ID', 'Mobile Number', 'Occupancy Type', 'Check-In Date', 
      'Check-Out Date', 'Submitted Timestamp', 'Status', 'Remarks'
    ];

    const rows = registrations.map((reg) => [
      reg.id,
      `"${reg.guestName.replace(/"/g, '""')}"`,
      `"${reg.companyName.replace(/"/g, '""')}"`,
      `"${reg.companyAddress.replace(/"/g, '""')}"`,
      reg.emailId,
      reg.mobileNumber,
      reg.occupancyType,
      reg.checkInDate,
      reg.checkOutDate,
      reg.submittedAt,
      reg.status,
      `"${(reg.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TRC_Guest_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Checked-In':
        return <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
          <UserCheck className="w-3 h-3" /> Checked In
        </span>;
      case 'Completed':
        return <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
          <CheckCircle className="w-3 h-3" /> Checked Out
        </span>;
      default:
        return <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
          <Clock className="w-3 h-3 animate-pulse" /> Pending Arrivals
        </span>;
    }
  };

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Upper Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Guest House Onboardings
          </h2>
          <p className="text-xs text-slate-500 font-medium font-sans">
            Oversee and search current corporate registrations
          </p>
        </div>
        
        {/* Actions Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            id="btn-export-records"
            title="Export all database registrations as a clean CSV format."
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-150 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden xs:inline">Export CSV</span>
          </button>
          
          <button
            onClick={onAddNewRegistrationClick}
            id="btn-new-onboarding"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Onboarding</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Modules */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
        
        {/* KPI: Total Stays */}
        <div className="bg-white rounded-2xl border border-sky-100/60 p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Database Size</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-800 font-mono">{stats.total}</span>
            <span className="text-[11px] font-semibold text-slate-400">Stays</span>
          </div>
          <p className="text-[9px] text-slate-450 mt-1 leading-none">Registered records total</p>
        </div>

        {/* KPI: Checking Inside */}
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block">Onboard Stayers</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-700 font-mono">{stats.checkedIn}</span>
            <span className="text-[11px] font-bold text-emerald-500">Live</span>
          </div>
          <p className="text-[9px] text-emerald-600/80 mt-1 leading-none">Active rooms checked-in</p>
        </div>

        {/* KPI: Pending Onboardings */}
        <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">Scheduled Arrivals</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-700 font-mono">{stats.pending}</span>
            <span className="text-[11px] font-bold text-amber-550">Keys</span>
          </div>
          <p className="text-[9px] text-amber-600/85 mt-1 leading-none">Approaching company guests</p>
        </div>

        {/* KPI: Suite distribution ratios */}
        <div className="bg-sky-50/50 rounded-2xl border border-sky-100 p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 block">Double Room Ratio</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-sky-700 font-mono">{stats.ratio}%</span>
            <span className="text-[11px] font-semibold text-sky-400">Total</span>
          </div>
          <p className="text-[9px] text-sky-600/80 mt-1 leading-none">Double sharing room layouts</p>
        </div>

      </div>

      {/* Advanced Filter / Search Toolbar Panel */}
      <div className="bg-white rounded-[24px] border border-sky-100/50 p-4.5 shadow-sm space-y-3.5">
        
        {/* Search Input and Toggle Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              id="input-dashboard-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Guest name, Company, Email contact, Booking Ref sequence..."
              className="w-full pl-9.5 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl text-xs font-semibold outline-none transition shadow-inner"
            />
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            id="btn-advanced-filters-toggle"
            className={`flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border text-xs font-bold transition shadow-sm whitespace-nowrap ${
              showAdvancedFilters || statusFilter !== 'All' || occupancyFilter !== 'All' || startDateFilter || endDateFilter
                ? 'bg-sky-50 border-sky-200 text-sky-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Collapsible Filter settings block */}
        {(showAdvancedFilters || statusFilter !== 'All' || occupancyFilter !== 'All' || startDateFilter || endDateFilter) && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
            
            {/* Occupancy selection filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Rooms Occupancy</label>
              <select
                id="filter-occupancy"
                value={occupancyFilter}
                onChange={(e) => setOccupancyFilter(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-700 focus:border-sky-500 transition"
              >
                <option value="All">All Types</option>
                <option value="Single">Single Bed</option>
                <option value="Double">Double Shared</option>
              </select>
            </div>

            {/* Attendance Status selection filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Stay Status</label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-700 focus:border-sky-500 transition"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending Arrivals</option>
                <option value="Checked-In">Checked In</option>
                <option value="Completed">Checked Out (Done)</option>
              </select>
            </div>

            {/* Check-In Starting Date Limit */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Checkin Start</label>
              <input
                type="date"
                id="filter-date-start"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-700 focus:border-sky-500 transition"
              />
            </div>

            {/* Check-In Ending Date Limit */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Checkin Finish</label>
              <input
                type="date"
                id="filter-date-end"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-700 focus:border-sky-500 transition"
              />
            </div>

            {/* Clean filter helper resetter button */}
            <div className="col-span-2 sm:col-span-4 flex justify-end">
              <button
                type="button"
                id="btn-filters-reset"
                onClick={() => {
                  setOccupancyFilter('All');
                  setStatusFilter('All');
                  setStartDateFilter('');
                  setEndDateFilter('');
                  setSearchTerm('');
                  addSoundHapticFeedback();
                }}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg border border-sky-150 transition select-none"
              >
                <RefreshCcw className="w-3 h-3" /> Reset Advanced Filters
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Main Listing View (Responsive Table Card) */}
      <div className="bg-white rounded-[24px] border border-sky-50/80 shadow-md overflow-hidden">
        
        {filteredRegistrations.length > 0 ? (
          <div>
            {/* Desktop Table View Layout (md: and above) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs select-text">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-5">Gueststay ID</th>
                    <th className="py-3 px-5">Participant Details</th>
                    <th className="py-3 px-5">Stay Dates (In / Out)</th>
                    <th className="py-3 px-5">Format</th>
                    <th className="py-3 px-5">Stay Status</th>
                    <th className="py-3 px-5 text-right">Corporate Tools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/40 transition-colors">
                      {/* Booking ID badge */}
                      <td className="py-4 px-5">
                        <span className="inline-block font-mono text-[11px] text-sky-700 bg-sky-50/80 border border-sky-100 font-black px-2 py-1 rounded-lg select-all">
                          {reg.id}
                        </span>
                      </td>
                      
                      {/* Guest and Company Profile details */}
                      <td className="py-4 px-5 max-w-[220px]">
                        <p className="font-extrabold text-slate-800 text-sm truncate leading-tight">{reg.guestName}</p>
                        <p className="text-[11px] text-slate-450 truncate font-semibold mt-0.5">{reg.companyName}</p>
                        <p className="text-[10px] text-sky-600 font-medium truncate mt-0.5 font-sans flex items-center gap-1">
                          {reg.emailId}
                        </p>
                      </td>

                      {/* Booking Dates range */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1 text-slate-800 font-bold">
                          <span>{reg.checkInDate}</span>
                          <span className="text-slate-350">→</span>
                          <span>{reg.checkOutDate}</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-450 mt-0.5">
                          {calculateDaysOfStay(reg.checkInDate, reg.checkOutDate)} nights duration
                        </p>
                      </td>

                      {/* Beds Configuration */}
                      <td className="py-4 px-5">
                        <span className="font-extrabold text-slate-650 bg-sky-50 text-[10px] px-2 py-0.5 rounded border border-sky-100">
                          {reg.occupancyType} Room
                        </span>
                        {reg.attachments.length > 0 && (
                          <p className="text-[10px] font-mono text-emerald-600 mt-1 font-semibold flex items-center gap-0.5">
                            📎 {reg.attachments.length} files attached
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        {getStatusBadge(reg.status)}
                      </td>

                      {/* Operations Actions bar */}
                      <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap select-none">
                        <button
                          onClick={() => setViewingRecord(reg)}
                          id={`btn-view-${reg.id}`}
                          title="View complete form data summary and access attached compliance documents."
                          className="p-1.5 hover:bg-sky-50 rounded-lg text-slate-400 hover:text-sky-600 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => onEditRegistration(reg)}
                          id={`btn-edit-${reg.id}`}
                          title="Modify existing check-in metadata, dates, or attachment records."
                          className="p-1.5 hover:bg-sky-50 rounded-lg text-slate-400 hover:text-sky-600 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to securely delete registration record: ${reg.id}? This operation is irreversible.`)) {
                              onDeleteRegistration(reg.id);
                            }
                          }}
                          id={`btn-delete-${reg.id}`}
                          title="Erase registration securely from local storage database."
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards List Layout (rendered for sm: and below screens) */}
            <div className="block md:hidden divide-y divide-slate-100 select-none">
              {filteredRegistrations.map((reg) => (
                <div key={reg.id} className="p-4 space-y-3 hover:bg-slate-50/20 active:bg-slate-50/50 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block font-mono text-[10px] text-sky-700 bg-sky-50 border border-sky-100 font-bold px-1.5 py-0.5 rounded mb-1 select-all">
                        {reg.id}
                      </span>
                      <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{reg.guestName}</h4>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{reg.companyName}</p>
                    </div>
                    {getStatusBadge(reg.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Stay Info</span>
                      <span className="font-bold text-slate-700 flex items-center gap-0.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" /> {reg.checkInDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Occupancy</span>
                      <span className="font-extrabold text-sky-600 mt-0.5 block">{reg.occupancyType} Room</span>
                    </div>
                  </div>

                  {reg.attachments.length > 0 && (
                    <p className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded w-max">
                      📎 {reg.attachments.length} files shared
                    </p>
                  )}

                  {/* Operational actions bar for small screens */}
                  <div className="flex justify-end gap-1.5 pt-1 border-t border-dashed border-slate-100">
                    <button
                      onClick={() => setViewingRecord(reg)}
                      id={`btn-mob-view-${reg.id}`}
                      className="flex items-center gap-1.5 py-1.5 px-3 hover:bg-sky-50 text-sky-700 rounded-lg text-[10px] font-bold border border-sky-100 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    
                    <button
                      onClick={() => onEditRegistration(reg)}
                      className="flex items-center gap-1.5 py-1.5 px-3 hover:bg-sky-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-200 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Erase registration record: ${reg.id}?`)) {
                          onDeleteRegistration(reg.id);
                        }
                      }}
                      className="flex items-center gap-1.5 py-1.5 px-2.5 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty Search results matching notice */
          <div className="p-12 text-center select-none">
            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-extrabold text-slate-700">No Onboardings Match Filter</h4>
            <p className="text-xs text-slate-450 mt-1 max-w-sm mx-auto">
              Please modify your keyword search text, reset dates filters, or add a fresh registration.
            </p>
          </div>
        )}

      </div>

      {/* Record Inspect Overlay Modal Component */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] border border-sky-100 shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b pb-4.5 select-none">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400">{viewingRecord.id}</span>
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Inspect Registered Guest</h3>
              </div>
              <button
                onClick={() => setViewingRecord(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-250 flex items-center justify-center font-bold text-slate-400 hover:text-slate-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs select-text leading-relaxed">
              {/* Personal Block */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Guest Profile</h4>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-2.5">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Full Name</span>
                    <span className="font-extrabold text-slate-800">{viewingRecord.guestName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Official Email ID</span>
                    <span className="font-bold text-sky-655 font-mono">{viewingRecord.emailId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mobile Contact</span>
                    <span className="font-bold text-slate-800 font-mono">{viewingRecord.mobileNumber}</span>
                  </div>
                </div>
              </div>

              {/* Corporate details block */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Company Sponsor</h4>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Company Name</span>
                    <span className="font-bold text-slate-800">{viewingRecord.companyName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1 font-sans">Business Address</span>
                    <span className="font-medium text-slate-600 block bg-white p-2.5 rounded-xl border border-slate-100/60 font-sans">
                      {viewingRecord.companyAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendance and Stay details block */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Onboarding & Stay Status</h4>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 grid grid-cols-2 gap-x-2 gap-y-2.5">
                  <div>
                    <span className="text-slate-450 block mb-0.5">Check-In Date</span>
                    <span className="font-extrabold text-slate-800">{viewingRecord.checkInDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-450 block mb-0.5">Check-Out Date</span>
                    <span className="font-extrabold text-slate-800">{viewingRecord.checkOutDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-450 block mb-0.5">Occupancy Class</span>
                    <span className="font-bold text-sky-600 font-mono">{viewingRecord.occupancyType} Room</span>
                  </div>
                  <div>
                    <span className="text-slate-450 block mb-0.5">Live Status</span>
                    {getStatusBadge(viewingRecord.status)}
                  </div>
                </div>
              </div>

              {/* Remarks/Remarks */}
              {viewingRecord.remarks && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Remarks / Requests</h4>
                  <p className="italic text-slate-600 bg-amber-50/20 border border-amber-100/60 p-3.5 rounded-2xl">
                    "{viewingRecord.remarks}"
                  </p>
                </div>
              )}

              {/* Checked/Compliance Attachments listings */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Attached ID proofs</h4>
                {viewingRecord.attachments.length > 0 ? (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {viewingRecord.attachments.map((att) => (
                      <div 
                        key={att.id} 
                        onClick={() => {
                          if (att.dataUrl) {
                            // Give user an interactive file preview option
                            const win = window.open();
                            if (win) {
                              win.document.write(`<iframe src="${att.dataUrl}" style="border:none; width:100%; height:100%;"></iframe>`);
                            } else {
                              alert('Popup blocker prevented loading document preview.');
                            }
                          } else {
                            alert('This is a simulated document and does not possess active base64 payload.');
                          }
                        }}
                        className="flex items-center justify-between p-3.5 border border-slate-200 hover:border-sky-300 rounded-xl cursor-all bg-sky-50/10 hover:bg-sky-50/30 transition select-none"
                      >
                        <span className="font-bold text-slate-705 truncate max-w-[80%] flex items-center gap-1.5">
                          📎 {att.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold">
                          {Math.round(att.size / 1024)} KB <span className="text-sky-500 font-black">↗</span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    No compliance attachments provided for validation.
                  </p>
                )}
              </div>

            </div>

            <div className="flex justify-end pt-2 select-none border-t border-slate-100">
              <button
                type="button"
                id="btn-close-record-modal"
                onClick={() => setViewingRecord(null)}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Close Summary
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );

  // Helper calculation for days of stay
  function calculateDaysOfStay(inStr: string, outStr: string): number {
    if (!inStr || !outStr) return 0;
    const dateIn = new Date(inStr);
    const dateOut = new Date(outStr);
    const diffTime = Math.abs(dateOut.getTime() - dateIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) ? 0 : diffDays;
  }

  function addSoundHapticFeedback() {
    // Basic interaction visual cue / simulated sound feedback
    console.log('[System Simulation] Dashboard Filters scrubbed successfully.');
  }
}
