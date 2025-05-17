import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AnesthesiaTypeSelector from './components/anesthesia/AnesthesiaTypeSelector';
import DosageCalculator from './components/dosage/DosageCalculator';
import VitalSigns from './components/vitals/VitalSigns';
import PatientForm from './components/patients/PatientForm';
import PreAnesthesiaChecklist from './components/checklist/PreAnesthesiaChecklist';
import PostAnesthesiaChecklist from './components/checklist/PostAnesthesiaChecklist';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Default to true since login is removed

  // Protected Route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <Navigate to="/anesthesia" replace />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/patients" element={
          <ProtectedRoute>
            <MainLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Patient Management</h1>
                <PatientForm 
                  onSave={(data) => console.log('Patient data saved:', data)} 
                  onCancel={() => console.log('Cancelled')}
                />
              </div>
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/anesthesia" element={
          <ProtectedRoute>
            <MainLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Anesthesia Planning</h1>
                <AnesthesiaTypeSelector 
                  onSelect={(type) => console.log('Selected:', type)} 
                  selectedType=""
                />
              </div>
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/dosage" element={
          <ProtectedRoute>
            <MainLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Medication Dosage Calculator</h1>
                <DosageCalculator patientWeight={70} patientAge={45} />
              </div>
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/vitals" element={
          <ProtectedRoute>
            <MainLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Vital Signs Monitoring</h1>
                <VitalSigns />
              </div>
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/pre-checklist" element={
          <ProtectedRoute>
            <MainLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Pre-Anesthesia Checklist</h1>
                <PreAnesthesiaChecklist 
                  onComplete={(checklist) => console.log('Pre-anesthesia checklist completed:', checklist)}
                />
              </div>
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/post-monitoring" element={
          <ProtectedRoute>
            <MainLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Post-Anesthesia Monitoring</h1>
                <PostAnesthesiaChecklist
                  onComplete={(checklist) => console.log('Post-anesthesia checklist completed:', checklist)}
                />
              </div>
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/alerts" element={
          <ProtectedRoute>
            <MainLayout>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Alerts & Notifications</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <p className="text-gray-600 dark:text-gray-300">No active alerts at this time.</p>
                </div>
              </div>
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
