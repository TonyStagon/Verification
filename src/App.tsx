import { useState } from 'react';
import VerificationPage from './pages/VerificationPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <>
      {!isVerified ? (
        <VerificationPage onVerified={() => setIsVerified(true)} />
      ) : (
        <DashboardPage />
      )}
    </>
  );
}

export default App;
