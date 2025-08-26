import React from 'react';
import { useSearchParams } from 'react-router-dom';
import OtpVerificationForm from '../features/auth/otp-verification';

const OtpVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <OtpVerificationForm email={email} />
    </div>
  );
};

export default OtpVerificationPage;
