import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { ContactType, createVerificationRequest } from '../services/verificationService';

interface ContactInputPageProps {
  onSubmit: (verificationId: string, contactType: ContactType, contact: string) => void;
}

export default function ContactInputPage({ onSubmit }: ContactInputPageProps) {
  const [contactType, setContactType] = useState<ContactType>('email');
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await createVerificationRequest(contact, contactType);

    if (!result.success) {
      setError(result.error || 'Failed to create verification request');
      setIsLoading(false);
      return;
    }

    if (result.verificationId) {
      onSubmit(result.verificationId, contactType, contact);
    }
  };

  const placeholder = contactType === 'email' ? 'Enter your email address' : 'Enter your phone number';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Get Verified
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Choose how you'd like to receive your verification code
        </p>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setContactType('email');
              setError('');
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              contactType === 'email'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Mail className="w-5 h-5" />
            Email
          </button>
          <button
            onClick={() => {
              setContactType('phone');
              setError('');
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              contactType === 'phone'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Phone className="w-5 h-5" />
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type={contactType === 'email' ? 'email' : 'tel'}
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!contact || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
              !contact || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </span>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
