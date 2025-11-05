import { CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Verification Successful!
        </h1>
        <p className="text-gray-600 text-center mb-8">
          You have been verified and can now access the dashboard
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600">
            This is where your main application content will be displayed after successful verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-600 mt-1">Total Users</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-600 mt-1">Active Sessions</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-600 mt-1">Verifications</p>
          </div>
        </div>
      </div>
    </div>
  );
}
