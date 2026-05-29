import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Building2, MapPin, Mail, Phone, Calendar, FileText, 
  Paperclip, Trash2, ChevronLeft, ChevronRight, CheckCircle, 
  HelpCircle, AlertCircle, RefreshCw, UploadCloud, FileImage
} from 'lucide-react';
import { GuestRegistration, Attachment } from '../types';

interface RegistrationFormProps {
  initialData?: GuestRegistration;
  onSubmit: (formData: Omit<GuestRegistration, 'id' | 'submittedAt' | 'status'>) => void;
  onCancel?: () => void;
  isDialogView?: boolean;
}

export default function RegistrationForm({ initialData, onSubmit, onCancel, isDialogView = false }: RegistrationFormProps) {
  // Active sub-step in the form: 
  // 1: Personal & Corporate Info
  // 2: Booking Details & Dates
  // 3: File Attachments
  // 4: Final Form Review & Submit
  const [step, setStep] = useState<number>(1);

  // Form Fields State
  const [guestName, setGuestName] = useState(initialData?.guestName || '');
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [companyAddress, setCompanyAddress] = useState(initialData?.companyAddress || '');
  const [emailId, setEmailId] = useState(initialData?.emailId || '');
  const [mobileNumber, setMobileNumber] = useState(initialData?.mobileNumber || '');
  const [occupancyType, setOccupancyType] = useState<'Single' | 'Double'>(initialData?.occupancyType || 'Single');
  const [checkInDate, setCheckInDate] = useState(initialData?.checkInDate || '');
  const [checkOutDate, setCheckOutDate] = useState(initialData?.checkOutDate || '');
  const [remarks, setRemarks] = useState(initialData?.remarks || '');
  const [attachments, setAttachments] = useState<Attachment[]>(initialData?.attachments || []);

  const [dragOver, setDragOver] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate dynamic form completion progress
  useEffect(() => {
    const fields = [
      !!guestName.trim(),
      !!companyName.trim(),
      !!companyAddress.trim(),
      !!emailId.trim(),
      !!mobileNumber.trim(),
      !!occupancyType,
      !!checkInDate,
      !!checkOutDate,
      !!remarks.trim(),
      attachments.length > 0
    ];
    
    const completedCount = fields.filter(Boolean).length;
    const computedProgress = Math.round((completedCount / fields.length) * 100);
    setProgress(computedProgress);
  }, [guestName, companyName, companyAddress, emailId, mobileNumber, occupancyType, checkInDate, checkOutDate, remarks, attachments]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const processFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file format. Only JPEG, PNG, GIF, and PDF documents are allowed.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Maximum size allowed is 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const newAttachment: Attachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result as string
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  // Perform validation checks for step navigation
  const isStepValid = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!guestName.trim()) return false;
      if (!companyName.trim()) return false;
      if (!companyAddress.trim()) return false;
      
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailId.trim() || !emailPattern.test(emailId)) return false;

      const phonePattern = /^\+?[0-9\s\-()]{8,20}$/;
      if (!mobileNumber.trim() || !phonePattern.test(mobileNumber)) return false;
    }

    if (currentStep === 2) {
      if (!checkInDate) return false;
      if (!checkOutDate) return false;
      
      if (checkInDate && checkOutDate) {
        const inDate = new Date(checkInDate);
        const outDate = new Date(checkOutDate);
        if (outDate <= inDate) return false;
      }
    }

    return true;
  };

  // Perform validation checks for step navigation and show error messages
  const validateStep = (currentStep: number): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!guestName.trim()) errors.guestName = 'Guest name is required';
      if (!companyName.trim()) errors.companyName = 'Company name is required';
      if (!companyAddress.trim()) errors.companyAddress = 'Corporate address is required';
      
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailId.trim()) {
        errors.emailId = 'Email ID is required';
      } else if (!emailPattern.test(emailId)) {
        errors.emailId = 'Please enter a valid business email';
      }

      const phonePattern = /^\+?[0-9\s\-()]{8,20}$/;
      if (!mobileNumber.trim()) {
        errors.mobileNumber = 'Mobile number is required';
      } else if (!phonePattern.test(mobileNumber)) {
        errors.mobileNumber = 'Please enter a valid mobile number (min 8 digits)';
      }
    }

    if (currentStep === 2) {
      if (!checkInDate) errors.checkInDate = 'Check-in date is required';
      if (!checkOutDate) errors.checkOutDate = 'Check-out date is required';
      
      if (checkInDate && checkOutDate) {
        const inDate = new Date(checkInDate);
        const outDate = new Date(checkOutDate);
        if (outDate <= inDate) {
          errors.checkOutDate = 'Check-out must be after check-in date';
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(1) && validateStep(2)) {
      onSubmit({
        guestName: guestName.trim(),
        companyName: companyName.trim(),
        companyAddress: companyAddress.trim(),
        emailId: emailId.trim(),
        mobileNumber: mobileNumber.trim(),
        occupancyType,
        checkInDate,
        checkOutDate,
        remarks: remarks.trim(),
        attachments
      });
    } else {
      // Go back to the step with errors
      if (Object.keys(validationErrors).some(k => ['guestName', 'companyName', 'companyAddress', 'emailId', 'mobileNumber'].includes(k))) {
        setStep(1);
      } else {
        setStep(2);
      }
    }
  };

  // Helper to format file sizes
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={`p-4 md:p-6 w-full ${isDialogView ? '' : 'max-w-2xl mx-auto'}`}>
      
      {/* Title & Cancel Toggle Header */}
      <div className="flex items-center justify-between mb-4 select-none">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
            {initialData ? 'Modify Registration' : 'New Guest Stay Form'}
          </h2>
          <p className="text-xs text-slate-500 font-medium font-sans">
            Please register guest details for corporate onboarding
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-3.5 py-1.5 rounded-xl transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Dynamic Animated Completion Progress Bar */}
      <div className="bg-white border border-sky-100/80 rounded-2xl p-3.5 shadow-sm mb-6 select-none">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest font-mono">App Form Progress</span>
          <span className="text-xs font-black text-sky-700 font-mono">{progress}% Complete</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-sky-450 to-sky-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Step Indicators Bar */}
      <div className="grid grid-cols-4 gap-2 mb-6 select-none font-sans">
        {[
          { label: 'Corporate', num: 1 },
          { label: 'Stay Info', num: 2 },
          { label: 'Documents', num: 3 },
          { label: 'Review', num: 4 }
        ].map((item) => (
          <button
            key={item.num}
            type="button"
            disabled={item.num > step && !isStepValid(step)}
            onClick={() => {
              if (item.num < step || validateStep(step)) {
                setStep(item.num);
              }
            }}
            className={`flex flex-col items-center py-2 border-b-2 transition ${
              step === item.num
                ? 'border-sky-500 text-sky-600 font-extrabold'
                : step > item.num
                ? 'border-emerald-500 text-emerald-600 font-bold'
                : 'border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="text-[10px] uppercase font-mono tracking-wider">Step {item.num}</span>
            <span className="text-[11px] hidden xs:block">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Multi-Step Form Layout */}
      <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
        
        {/* STEP 1: Personal & Corporate Info */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="block text-xs font-bold text-slate-400 uppercase mb-1">Corporate Profile</h3>
            
            {/* Guest Name */}
            <div className="space-y-1">
              <label htmlFor="input-guest-name" className="block text-xs font-bold text-slate-400 uppercase mb-2">Guest Full Name *</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="input-guest-name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter guest's first and last name"
                  className={`w-full pl-9 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border ${
                    validationErrors.guestName ? 'border-rose-455 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-sky-505 focus:ring-sky-200'
                  } focus:ring-2 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all duration-200`}
                />
              </div>
              {validationErrors.guestName && (
                <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.guestName}
                </p>
              )}
            </div>

            {/* Company Name */}
            <div className="space-y-1">
              <label htmlFor="input-company-name" className="block text-xs font-bold text-slate-400 uppercase mb-2">Sponsoring Company Name *</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <Building2 className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="input-company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Infosys, TCS, Google"
                  className={`w-full pl-9 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border ${
                    validationErrors.companyName ? 'border-rose-455 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-sky-505 focus:ring-sky-200'
                  } focus:ring-2 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all duration-200`}
                />
              </div>
              {validationErrors.companyName && (
                <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.companyName}
                </p>
              )}
            </div>

            {/* Corporate Address */}
            <div className="space-y-1">
              <label htmlFor="input-company-address" className="block text-xs font-bold text-slate-400 uppercase mb-2">Company Registered Address *</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <MapPin className="w-4 h-4" />
                </span>
                <textarea
                  id="input-company-address"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Full office address details"
                  rows={2}
                  className={`w-full pl-9 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border ${
                    validationErrors.companyAddress ? 'border-rose-455 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-sky-505 focus:ring-sky-200'
                  } focus:ring-2 focus:bg-white rounded-xl text-xs font-medium outline-none transition resize-none duration-250`}
                />
              </div>
              {validationErrors.companyAddress && (
                <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.companyAddress}
                </p>
              )}
            </div>

            {/* Contact Grid: Email & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Email ID */}
              <div className="space-y-1">
                <label htmlFor="input-email" className="block text-xs font-bold text-slate-400 uppercase mb-2">Official Business Email ID *</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    id="input-email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="guest@corporate.com"
                    className={`w-full pl-9 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border ${
                      validationErrors.emailId ? 'border-rose-455 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-sky-505 focus:ring-sky-200'
                    } focus:ring-2 focus:bg-white rounded-xl text-xs font-medium outline-none transition duration-200`}
                  />
                </div>
                {validationErrors.emailId && (
                  <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.emailId}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label htmlFor="input-mobile" className="block text-xs font-bold text-slate-400 uppercase mb-2">Mobile Contact Number *</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    id="input-mobile"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className={`w-full pl-9 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border ${
                      validationErrors.mobileNumber ? 'border-rose-455 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-sky-505 focus:ring-sky-200'
                    } focus:ring-2 focus:bg-white rounded-xl text-xs font-medium outline-none transition duration-200`}
                  />
                </div>
                {validationErrors.mobileNumber && (
                  <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.mobileNumber}
                  </p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: Occupancy & Stay Details */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="block text-xs font-bold text-slate-400 uppercase mb-1">Reservation Profile</h3>

            {/* Occupancy Type (Single / Double) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Room Occupancy Code *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-occupancy-single"
                  onClick={() => setOccupancyType('Single')}
                  className={`py-3 px-4 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    occupancyType === 'Single'
                      ? 'border-sky-500 bg-sky-50 text-sky-620 shadow-inner'
                      : 'border-slate-200 bg-slate-50/30 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  Single Bed Occupancy
                </button>
                <button
                  type="button"
                  id="btn-occupancy-double"
                  onClick={() => setOccupancyType('Double')}
                  className={`py-3 px-4 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    occupancyType === 'Double'
                      ? 'border-sky-500 bg-sky-50 text-sky-620 shadow-inner'
                      : 'border-slate-200 bg-slate-50/30 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                  Double Shared Occupancy
                </button>
              </div>
            </div>

            {/* Dates Picker Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Check-In Date */}
              <div className="space-y-1">
                <label htmlFor="input-checkin-date" className="block text-xs font-bold text-slate-400 uppercase mb-2">Check-in Date *</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    id="input-checkin-date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className={`w-full pl-9 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border ${
                      validationErrors.checkInDate ? 'border-rose-455 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-sky-505 focus:ring-sky-200'
                    } focus:ring-2 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all duration-200`}
                  />
                </div>
                {validationErrors.checkInDate && (
                  <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.checkInDate}
                  </p>
                )}
              </div>

              {/* Check-Out Date */}
              <div className="space-y-1">
                <label htmlFor="input-checkout-date" className="block text-xs font-bold text-slate-400 uppercase mb-2">Check-out Date *</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    id="input-checkout-date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className={`w-full pl-9 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border ${
                      validationErrors.checkOutDate ? 'border-rose-455 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-sky-505 focus:ring-sky-200'
                    } focus:ring-2 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all duration-200`}
                  />
                </div>
                {validationErrors.checkOutDate && (
                  <p className="text-[10px] text-rose-550 font-semibold flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.checkOutDate}
                  </p>
                )}
              </div>

            </div>

            {/* Description / Remarks */}
            <div className="space-y-1">
              <label htmlFor="input-remarks" className="block text-xs font-bold text-slate-400 uppercase mb-2">Remarks & Support Needs</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <FileText className="w-4 h-4" />
                </span>
                <textarea
                  id="input-remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Special food diet, early onboarding, luggage needs, workspace constraints, billing guidelines etc."
                  rows={3}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-250/20 focus:bg-white rounded-xl text-xs font-medium outline-none transition resize-none duration-200"
                />
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: Attach Images & PDF Documents */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn select-none">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Compliance Documents</h3>
              <span className="text-[10px] font-bold text-sky-500 bg-sky-50 px-2 py-0.5 rounded-full">
                Max 5 files (5MB cap)
              </span>
            </div>

            {/* Large Drag and Drop Zone with Upload Trigger */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                dragOver 
                  ? 'border-sky-500 bg-sky-50/60 scale-[0.99]' 
                  : 'border-slate-200 bg-slate-50/30 hover:border-sky-350 hover:bg-slate-50/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="file-attachments"
                multiple
                accept="image/jpeg,image/png,image/gif,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <UploadCloud className="w-12 h-12 text-sky-500 mb-3 stroke-[1.5] animate-bounce" />
              <h4 className="text-xs font-extrabold text-slate-700">Drag & Drop Documents or click to Browse</h4>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[280px]">
                Attach official Company ID photocopy, Corporate Travel Order letter, passport bio copies, or visa slip (PDF, PNG, JPG).
              </p>
            </div>

            {/* List of Loaded Attachments */}
            {attachments.length > 0 ? (
              <div className="space-y-2 mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Attached Resources ({attachments.length})
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {attachments.map((att) => (
                    <div 
                      key={att.id} 
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate max-w-[80%]">
                        <div className="p-2 bg-white rounded-lg border border-slate-200 shrink-0">
                          {att.type.startsWith('image/') ? (
                            <FileImage className="w-4 h-4 text-sky-500" />
                          ) : (
                            <FileText className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-slate-700 truncate">{att.name}</p>
                          <p className="text-[10px] text-slate-450 font-mono">{formatSize(att.size)}</p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAttachment(att.id);
                        }}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-3 text-xs text-amber-800">
                <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">No Attachments Placed</p>
                  <p className="text-[10px] text-amber-700 mt-0.5">
                    It is highly recommended to attach proof of organization or corporate ID cards for seamless check-in verification. You can skip this step if not available.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Form Review & Submissions */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verify Guest Summary</h3>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3.5 text-xs select-text">
              {/* Profile details list */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-b border-dashed border-slate-200 pb-3.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Guest Name</span>
                  <span className="font-extrabold text-slate-800">{guestName || <em className="text-slate-350">empty</em>}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Sponsoring Company</span>
                  <span className="font-bold text-slate-800">{companyName || <em className="text-slate-350">empty</em>}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Corporate Address</span>
                  <span className="font-medium text-slate-700">{companyAddress || <em className="text-slate-350">empty</em>}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Email Workspace</span>
                  <span className="font-bold text-slate-700">{emailId || <em className="text-slate-350">empty</em>}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Mobile Contact</span>
                  <span className="font-bold text-slate-750">{mobileNumber || <em className="text-slate-350">empty</em>}</span>
                </div>
              </div>

              {/* Stays info details */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-b border-dashed border-slate-200 pb-3.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Occupancy Type</span>
                  <span className="font-bold text-slate-800 bg-sky-50 text-sky-600 px-2 py-0.5 rounded">{occupancyType} Room Stay</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Attachment Count</span>
                  <span className="font-bold text-slate-800">{attachments.length} files shared</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Check-in</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" /> {checkInDate || <em className="text-slate-300">Unselected</em>}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Check-out</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" /> {checkOutDate || <em className="text-slate-300">Unselected</em>}
                  </span>
                </div>
              </div>

              {/* Special Remarks */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Remarks / Requests</span>
                <p className="italic text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                  {remarks.trim() ? `"${remarks.trim()}"` : 'No custom dietary or check-in instructions listed.'}
                </p>
              </div>
            </div>

            {/* Final Legal Consent */}
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-2 text-[10px] text-blue-800 font-medium">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                By pressing "Register Guest", I declare the accuracy of this booking form. I acknowledge metadata audits and corporate authorization guidelines.
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Buttons Toolbar */}
        <div className="flex justify-between items-center pt-5 border-t border-slate-100 select-none">
          {/* Back btn */}
          {step > 1 ? (
            <button
              type="button"
              id="btn-form-back"
              onClick={prevStep}
              className="flex items-center gap-1.5 px-6 py-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors uppercase text-xs tracking-wider font-extrabold"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div></div> // Spacing placeholder
          )}

          {/* Action / Next / Submit btn */}
          {step < 4 ? (
            <button
              type="button"
              id="btn-form-next"
              onClick={nextStep}
              className="flex items-center gap-1.5 px-8 py-3 bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-200/50 hover:bg-sky-700 hover:shadow-xl hover:shadow-sky-300/30 transition-all uppercase text-xs tracking-wider"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              id="btn-form-submit"
              className="flex items-center gap-1.5 px-9 py-3 bg-sky-650 text-white font-bold rounded-xl shadow-lg shadow-sky-200/50 hover:bg-sky-700 hover:shadow-xl hover:shadow-sky-300/30 transition-all uppercase text-xs tracking-wider"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Review & Submit</span>
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
