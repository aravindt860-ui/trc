import React, { useState } from 'react';
import { CheckCircle, Mail, RotateCcw, ThumbsUp, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { GuestRegistration } from '../types';

interface ConfirmationScreenProps {
  registration: GuestRegistration;
  onReset: () => void;
  isAdmin?: boolean;
  onGoToDashboard?: () => void;
}

export default function ConfirmationScreen({ registration, onReset, isAdmin = false, onGoToDashboard }: ConfirmationScreenProps) {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [guestEmail, setGuestEmail] = useState(registration.emailId);

  // Generate native mailto link
  const getMailtoLink = () => {
    const subject = encodeURIComponent(`The Right Choice (TRC) Guest Registration Confirmed: ${registration.id}`);
    const body = encodeURIComponent(
      `Hello ${registration.guestName},\n\n` +
      `Your corporate stay registration at The Right Choice (TRC) Guest House has been successfully compiled and recorded.\n\n` +
      `--- REGISTRATION SUMMARY ---\n` +
      `Stay Reference ID: ${registration.id}\n` +
      `Sponsoring Company: ${registration.companyName}\n` +
      `Occupancy Selected: ${registration.occupancyType} Bed Room\n` +
      `Check-In Onboarding: ${registration.checkInDate}\n` +
      `Check-Out Departure: ${registration.checkOutDate}\n` +
      `Remarks: ${registration.remarks || 'None'}\n\n` +
      `We look forward to welcoming you soon!\n\n` +
      `Best regards,\n` +
      `Guest Relations Desk\n` +
      `The Right Choice (TRC) Corporate Stays`
    );
    return `mailto:${guestEmail}?subject=${subject}&body=${body}`;
  };

  const handleSimulateEmail = () => {
    setEmailStatus('sending');
    setTimeout(() => {
      setEmailStatus('sent');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-50 to-white text-center min-h-[500px]">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-sky-100 shadow-xl p-8 space-y-6">
        
        {/* Animated Checkmark and Starburst */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-24 h-24 rounded-full bg-emerald-500/10 animate-ping"></span>
          </div>
          <div className="relative p-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[28px] text-white shadow-lg shadow-emerald-500/20 transform hover:scale-105 transition-transform duration-300">
            <CheckCircle className="w-12 h-12 stroke-[2.5]" />
          </div>
        </div>

        {/* Success Announcement Header */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
            SUCCESSFULLY REGISTERED
          </span>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight pt-1">
            Stay Confirmed!
          </h2>
          <div className="pt-2 select-all">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-50 border border-sky-100/80 rounded-2xl text-xs font-bold text-sky-850 tracking-wide shadow-sm font-mono">
              REGISTRATION ID: <span className="text-sky-650 bg-white border border-sky-150 px-2.5 py-0.5 rounded-lg font-black font-mono ml-1">{registration.id}</span>
            </span>
          </div>
        </div>

        {/* Brief metadata summaries card for user review */}
        <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4 text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Scheduled Guest</span>
            <span className="font-extrabold text-slate-800">{registration.guestName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Company sponsor</span>
            <span className="font-bold text-slate-700">{registration.companyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Check-in Onward</span>
            <span className="font-bold text-slate-700">{registration.checkInDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Occupancy beds</span>
            <span className="font-semibold text-slate-850 bg-white border px-1.5 py-0.5 rounded text-[10px]">{registration.occupancyType} Room</span>
          </div>
        </div>

        {/* Guest Confirmation Email Panel */}
        <div className="border border-sky-100 bg-white p-4.5 rounded-[22px] text-left space-y-3 shadow-inner">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Dispatch Booking Confirmation</h4>
              <p className="text-[10px] text-slate-50 *leading-relaxed">Email arrival letter and receipts or credentials offline</p>
            </div>
          </div>

          <div className="space-y-2 pt-1.5">
            <input
              type="email"
              id="input-confirmation-email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Enter guest's business email"
              className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-sky-500 focus:bg-white transition"
            />
            
            <div className="flex gap-2">
              {/* Simulation button */}
              <button
                type="button"
                id="btn-simulate-email"
                onClick={handleSimulateEmail}
                disabled={emailStatus !== 'idle'}
                className="flex-1 py-2 bg-sky-50 hover:bg-sky-100 disabled:bg-slate-50 text-sky-700 disabled:text-slate-400 border border-sky-150 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
              >
                {emailStatus === 'idle' && (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Simulation</span>
                  </>
                )}
                {emailStatus === 'sending' && (
                  <>
                    <span className="w-3 h-3 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></span>
                    <span>Sending...</span>
                  </>
                )}
                {emailStatus === 'sent' && (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Sent Success</span>
                  </>
                )}
              </button>

              {/* Real native Mailto anchor */}
              <a
                href={getMailtoLink()}
                id="anchor-mailto-send"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-1.5"
              >
                <span>Send Real Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Simulated Inbox notice card if simulation sent */}
        {emailStatus === 'sent' && (
          <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-2xl text-[10px] text-left animate-slideDown">
            <span className="font-extrabold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> [SIMULATION RESULT] Mail Delivered:</span>
            <p className="mt-1 opacity-90 leading-tight">
              Subject: <em>The Right Choice (TRC) Guest Registration Confirmed...</em><br />
              Recipient: <strong>{guestEmail}</strong><br />
              A verification message containing deep-linked PDF attachments has been successfully generated inside local sandbox memory.
            </p>
          </div>
        )}

        {/* Navigation Actions buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          {isAdmin && onGoToDashboard ? (
            <button
              onClick={onGoToDashboard}
              className="py-3 px-4 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180 text-slate-550" />
              <span>Dashboard</span>
            </button>
          ) : (
            <button
              onClick={onReset}
              className="py-3 px-4 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-550" />
              <span>Register New</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="py-3 px-5 bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-200/50 hover:bg-sky-700 hover:shadow-xl hover:shadow-sky-300/30 transition-all uppercase text-xs tracking-wider flex items-center justify-center gap-1.5"
          >
            <span>Complete</span>
            <ThumbsUp className="w-3.5 h-3.5 fill-current text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}
