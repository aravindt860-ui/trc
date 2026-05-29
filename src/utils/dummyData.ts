import { GuestRegistration } from '../types';

export const INITIAL_REGISTRATIONS: GuestRegistration[] = [
  {
    id: 'REG-2026-001',
    guestName: 'Arjun Mehta',
    companyName: 'Infosys Corp',
    companyAddress: 'Electronic City Phase 1, Bengaluru, Karnataka 560100',
    emailId: 'arjun.mehta@infosys.com',
    mobileNumber: '+91 98765 43210',
    occupancyType: 'Single',
    checkInDate: '2026-05-30',
    checkOutDate: '2026-06-05',
    remarks: 'Prefers quiet room, top floor if possible. Late check-in expected around 10 PM.',
    attachments: [
      { id: 'att-1', name: 'corporate_id_card.png', type: 'image/png', size: 102400 },
      { id: 'att-2', name: 'passport_bio.pdf', type: 'application/pdf', size: 512000 }
    ],
    submittedAt: '2026-05-28T14:32:00Z',
    status: 'Checked-In'
  },
  {
    id: 'REG-2026-002',
    guestName: 'Sarah Jenkins',
    companyName: 'Google LLC',
    companyAddress: '1600 Amphitheatre Pkwy, Mountain View, CA 94043',
    emailId: 'sjenkins@google.com',
    mobileNumber: '+1 650 253 0000',
    occupancyType: 'Double',
    checkInDate: '2026-06-02',
    checkOutDate: '2026-06-12',
    remarks: 'Requires high-speed Wi-Fi and workspace desk in the room. No breakfast needed.',
    attachments: [
      { id: 'att-3', name: 'google_travel_order.pdf', type: 'application/pdf', size: 307200 }
    ],
    submittedAt: '2026-05-29T09:15:00Z',
    status: 'Pending'
  },
  {
    id: 'REG-2026-003',
    guestName: 'Rohan Sharma',
    companyName: 'Tata Consultancy Services',
    companyAddress: 'Nesco IT Park, Goregaon East, Mumbai 400063',
    emailId: 'rohan.sharma@tcs.com',
    mobileNumber: '+91 70123 45678',
    occupancyType: 'Single',
    checkInDate: '2026-05-25',
    checkOutDate: '2026-05-29',
    remarks: 'Billing will be cleared directly by company HR. Vegetarian breakfast requested.',
    attachments: [
      { id: 'att-4', name: 'tcs_deployment_letter.pdf', type: 'application/pdf', size: 419430 }
    ],
    submittedAt: '2026-05-24T18:40:00Z',
    status: 'Completed'
  },
  {
    id: 'REG-2026-004',
    guestName: 'Elena Rostova',
    companyName: 'Accenture Technology',
    companyAddress: 'Outer Ring Rd, Bellandur, Bengaluru 560103',
    emailId: 'elena.rostova@accenture.com',
    mobileNumber: '+7 901 123 4567',
    occupancyType: 'Double',
    checkInDate: '2026-06-15',
    checkOutDate: '2026-06-20',
    remarks: 'Joining for the corporate training workshop. Will share business visa on arrival.',
    attachments: [
      { id: 'att-5', name: 'visa_acceptance.pdf', type: 'application/pdf', size: 819200 },
      { id: 'att-6', name: 'hotel_voucher.png', type: 'image/png', size: 153600 }
    ],
    submittedAt: '2026-05-29T16:20:00Z',
    status: 'Pending'
  }
];
