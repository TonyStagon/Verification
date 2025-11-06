import { useState } from 'react';
import ContactInputPage from './pages/ContactInputPage';
import VerificationPage from './pages/VerificationPage';
import DashboardPage from './pages/DashboardPage';
import { ContactType } from './services/verificationService';

type AppStep = 'contact-input' | 'verification' | 'dashboard';

function App() {
  const [step, setStep] = useState<AppStep>('contact-input');
  const [verificationId, setVerificationId] = useState('');
  const [contactType, setContactType] = useState<ContactType>('email');
  const [contact, setContact] = useState('');

  const handleContactSubmit = (verificationId: string, type: ContactType, contactValue: string) => {
    setVerificationId(verificationId);
    setContactType(type);
    setContact(contactValue);
    setStep('verification');
  };

  const handleVerified = () => {
    setStep('dashboard');
  };

  const handleBack = () => {
    setStep('contact-input');
    setVerificationId('');
    setContact('');
  };

  return (
    <>
      {step === 'contact-input' && <ContactInputPage onSubmit={handleContactSubmit} />}
      {step === 'verification' && (
        <VerificationPage
          verificationId={verificationId}
          contactType={contactType}
          contact={contact}
          onVerified={handleVerified}
          onBack={handleBack}
        />
      )}
      {step === 'dashboard' && <DashboardPage />}
    </>
  );
}

export default App;
