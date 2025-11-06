import { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import VerificationInput from '../components/VerificationInput';
import { verifyCode, ContactType } from '../services/verificationService';

interface VerificationPageProps {
  verificationId: string;
  contactType: ContactType;
  contact: string;
  onVerified: () => void;
  onBack: () => void;
}

export default function VerificationPage({
  verificationId,
  contactType,
  contact,
  onVerified,
  onBack,
}: VerificationPageProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async (code: string) => {
    setIsVerifying(true);
    setError('');

    const result = await verifyCode(verificationId, code);

    if (result.success) {
      onVerified();
    } else {
      setError(result.error || 'Verification failed. Please try again.');
      setIsVerifying(false);
    }
  };

  const maskedContact =
    contactType === 'email'
      ? contact.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      : contact.replace(/(.{3})(.*)(.{2})/, '$1***$3');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Change contact
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Verify Your Code
        </h1>
        <p className="text-gray-600 text-center mb-2">
          Enter the 6-digit code sent to
        </p>
        <p className="text-center text-gray-800 font-medium mb-8">{maskedContact}</p>

        <VerificationInput onComplete={handleComplete} />

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {isVerifying && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive a code?{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
