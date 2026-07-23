import React from 'react';
import { ForgotPassword } from '@clerk/clerk-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#101e23] flex items-center justify-center p-4">
      {/* Clerk ka component jo pura reset flow handle karta hai */}
      <ForgotPassword 
        path="/forgot-password" 
        routing="path" 
        signInUrl="/sign-in" 
      />
    </div>
  );
}