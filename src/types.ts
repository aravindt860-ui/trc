export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl?: string; // Base64 encoding for persistence
}

export interface GuestRegistration {
  id: string;
  guestName: string;
  companyName: string;
  companyAddress: string;
  emailId: string;
  mobileNumber: string;
  occupancyType: 'Single' | 'Double';
  checkInDate: string;
  checkOutDate: string;
  remarks: string;
  attachments: Attachment[];
  submittedAt: string;
  status: 'Pending' | 'Checked-In' | 'Completed';
}

export type UserRole = 'ADMIN' | 'USER';

export interface UserSession {
  username: string;
  role: UserRole;
  isLoggedIn: boolean;
}
