/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useTransition } from 'react';
import { GuestRegistration, UserSession, UserRole } from './types';
import { INITIAL_REGISTRATIONS } from './utils/dummyData';
import AndroidEmulator from './components/AndroidEmulator';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import ConfirmationScreen from './components/ConfirmationScreen';
import AdminDashboard from './components/AdminDashboard';
import BuildGuide from './components/BuildGuide';

export default function App() {
  // App Session State
  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('trc_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return { username: '', role: 'USER', isLoggedIn: false };
  });

  // Registrations Database (with Offline LocalStorage persistence)
  const [registrations, setRegistrations] = useState<GuestRegistration[]>(() => {
    const saved = localStorage.getItem('trc_registrations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_REGISTRATIONS;
  });

  // Navigation tabs for Admin view
  // 'DASHBOARD' | 'REGISTER' | 'BUILD_GUIDE'
  const [activeTab, setActiveTab] = useState<string>('DASHBOARD');

  // Currently editing record state
  const [editingRegistration, setEditingRegistration] = useState<GuestRegistration | null>(null);

  // Successfully submitted registration state to display confirmation screen
  const [submittedRegistration, setSubmittedRegistration] = useState<GuestRegistration | null>(null);

  // Sync session state changes to local storage
  useEffect(() => {
    localStorage.setItem('trc_session', JSON.stringify(session));
  }, [session]);

  // Sync database state changes to local storage
  useEffect(() => {
    localStorage.setItem('trc_registrations', JSON.stringify(registrations));
  }, [registrations]);

  const handleLogin = (username: string, role: UserRole) => {
    setSession({
      username: username.trim() || (role === 'ADMIN' ? 'Admin Supervisor' : 'Guest'),
      role,
      isLoggedIn: true
    });
    // Set default view after login
    setActiveTab(role === 'ADMIN' ? 'DASHBOARD' : 'REGISTER');
    setSubmittedRegistration(null);
    setEditingRegistration(null);
  };

  const handleLogout = () => {
    setSession({ username: '', role: 'USER', isLoggedIn: false });
    setSubmittedRegistration(null);
    setEditingRegistration(null);
  };

  // Create or Update (Submit) Registration Form
  const handleFormSubmit = (formData: Omit<GuestRegistration, 'id' | 'submittedAt' | 'status'>) => {
    if (editingRegistration) {
      // Modify existing record
      const updatedList = registrations.map((reg) => {
        if (reg.id === editingRegistration.id) {
          return {
            ...reg,
            ...formData,
            // Keep unchanged parameters
            id: reg.id,
            submittedAt: reg.submittedAt,
            status: reg.status
          };
        }
        return reg;
      });
      setRegistrations(updatedList);
      
      // Save this to display confirmation
      const updatedRecord = updatedList.find(r => r.id === editingRegistration.id)!;
      setSubmittedRegistration(updatedRecord);
      setEditingRegistration(null);
    } else {
      // Create new record with a truly unique registration ID (e.g., TRC-2026-X7Y2)
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newId = `TRC-${new Date().getFullYear()}-${randomStr}`;
      const newRecord: GuestRegistration = {
        ...formData,
        id: newId,
        submittedAt: new Date().toISOString(),
        status: 'Pending'
      };
      setRegistrations([newRecord, ...registrations]);
      setSubmittedRegistration(newRecord);
    }
  };

  const handleDeleteRegistration = (id: string) => {
    setRegistrations(registrations.filter((reg) => reg.id !== id));
  };

  const handleEditRequest = (reg: GuestRegistration) => {
    setEditingRegistration(reg);
    setActiveTab('REGISTER');
    setSubmittedRegistration(null);
  };

  return (
    <AndroidEmulator>
      <div className="flex-1 flex flex-col font-sans select-none bg-sky-50/10">
        {session.isLoggedIn ? (
          <>
            {/* Upper Top Navbar Header Block */}
            <Header 
              session={session} 
              onLogout={handleLogout} 
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setEditingRegistration(null);
                setSubmittedRegistration(null);
              }}
            />

            {/* App Screen Context container */}
            <main className="flex-1 flex flex-col">
              
              {/* If a form was newly compiled successfully, load structural Confirmation screen */}
              {submittedRegistration ? (
                <ConfirmationScreen 
                  registration={submittedRegistration}
                  onReset={() => {
                    setSubmittedRegistration(null);
                    setEditingRegistration(null);
                    if (session.role === 'ADMIN') {
                      setActiveTab('DASHBOARD');
                    } else {
                      setActiveTab('REGISTER');
                    }
                  }}
                  isAdmin={session.role === 'ADMIN'}
                  onGoToDashboard={() => {
                    setSubmittedRegistration(null);
                    setEditingRegistration(null);
                    setActiveTab('DASHBOARD');
                  }}
                />
              ) : session.role === 'ADMIN' ? (
                /* Role Layout: Administrator panels */
                <div className="flex-1 flex flex-col">
                  {activeTab === 'DASHBOARD' && (
                    <AdminDashboard 
                      registrations={registrations}
                      onEditRegistration={handleEditRequest}
                      onDeleteRegistration={handleDeleteRegistration}
                      onAddNewRegistrationClick={() => {
                        setEditingRegistration(null);
                        setSubmittedRegistration(null);
                        setActiveTab('REGISTER');
                      }}
                    />
                  )}

                  {activeTab === 'REGISTER' && (
                    <RegistrationForm 
                      initialData={editingRegistration || undefined}
                      onSubmit={handleFormSubmit}
                      onCancel={() => {
                        setEditingRegistration(null);
                        setActiveTab('DASHBOARD');
                      }}
                    />
                  )}

                  {activeTab === 'BUILD_GUIDE' && <BuildGuide />}
                </div>
              ) : (
                /* Role Layout: Standard Guest forms on Guest Portal role */
                <div className="flex-1 flex flex-col items-center justify-center py-6">
                  <RegistrationForm 
                    initialData={editingRegistration || undefined}
                    onSubmit={handleFormSubmit}
                  />
                </div>
              )}

            </main>
          </>
        ) : (
          /* Role Layout: Secure Credentials Login page */
          <LoginForm onLogin={handleLogin} />
        )}
      </div>
    </AndroidEmulator>
  );
}
