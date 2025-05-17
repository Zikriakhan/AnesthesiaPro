import React, { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, Droplets, Clock, AlertTriangle } from 'lucide-react';

interface VitalSignsProps {
  patientId?: string;
  initialVitals?: VitalData;
}

interface VitalData {
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenSaturation: number;
  temperature: number;
  respiratoryRate: number;
  etCO2?: number;
  timestamp: Date;
}

interface VitalRanges {
  [key: string]: {
    normal: { min: number; max: number };
    warning: { min: number; max: number };
    critical: { min: number; max: number };
  };
}

const vitalRanges: VitalRanges = {
  heartRate: {
    normal: { min: 60, max: 100 },
    warning: { min: 50, max: 120 },
    critical: { min: 40, max: 150 }
  },
  bloodPressureSystolic: {
    normal: { min: 100, max: 140 },
    warning: { min: 90, max: 160 },
    critical: { min: 70, max: 180 }
  },
  bloodPressureDiastolic: {
    normal: { min: 60, max: 90 },
    warning: { min: 50, max: 100 },
    critical: { min: 40, max: 120 }
  },
  oxygenSaturation: {
    normal: { min: 95, max: 100 },
    warning: { min: 90, max: 100 },
    critical: { min: 85, max: 100 }
  },
  temperature: {
    normal: { min: 36.1, max: 37.8 },
    warning: { min: 35, max: 38.5 },
    critical: { min: 34, max: 40 }
  },
  respiratoryRate: {
    normal: { min: 12, max: 20 },
    warning: { min: 8, max: 30 },
    critical: { min: 6, max: 40 }
  },
  etCO2: {
    normal: { min: 35, max: 45 },
    warning: { min: 30, max: 50 },
    critical: { min: 20, max: 60 }
  }
};

const VitalSigns: React.FC<VitalSignsProps> = ({ patientId, initialVitals }) => {
  const [vitals, setVitals] = useState<VitalData>({
    heartRate: 72,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    oxygenSaturation: 98,
    temperature: 36.8,
    respiratoryRate: 16,
    etCO2: 40,
    timestamp: new Date()
  });

  const [vitalHistory, setVitalHistory] = useState<VitalData[]>([]);
  const [simulateChanges, setSimulateChanges] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedVitals, setEditedVitals] = useState<VitalData>(vitals);

  useEffect(() => {
    if (initialVitals) {
      setVitals(initialVitals);
      setEditedVitals(initialVitals);
    }
  }, [initialVitals]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (simulateChanges) {
      interval = setInterval(() => {
        // Record current vitals to history
        setVitalHistory(prev => [...prev, { ...vitals, timestamp: new Date() }]);

        // Generate slight variations to simulate real-time changes
        setVitals(prev => ({
          ...prev,
          heartRate: Math.max(40, Math.min(150, prev.heartRate + (Math.random() * 10 - 5))),
          bloodPressureSystolic: Math.max(90, Math.min(160, prev.bloodPressureSystolic + (Math.random() * 8 - 4))),
          bloodPressureDiastolic: Math.max(50, Math.min(100, prev.bloodPressureDiastolic + (Math.random() * 6 - 3))),
          oxygenSaturation: Math.max(90, Math.min(100, prev.oxygenSaturation + (Math.random() * 2 - 1))),
          temperature: Math.max(35.5, Math.min(38, prev.temperature + (Math.random() * 0.2 - 0.1))),
          respiratoryRate: Math.max(8, Math.min(30, prev.respiratoryRate + (Math.random() * 4 - 2))),
          etCO2: prev.etCO2 ? Math.max(30, Math.min(50, prev.etCO2 + (Math.random() * 4 - 2))) : undefined,
          timestamp: new Date()
        }));
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulateChanges, vitals]);

  const getVitalStatus = (vitalType: string, value: number): 'normal' | 'warning' | 'critical' => {
    const ranges = vitalRanges[vitalType];
    if (!ranges) return 'normal';

    if (value >= ranges.normal.min && value <= ranges.normal.max) return 'normal';
    if (value >= ranges.warning.min && value <= ranges.warning.max) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: 'normal' | 'warning' | 'critical'): string => {
    switch (status) {
      case 'normal':
        return 'text-green-500 dark:text-green-400';
      case 'warning':
        return 'text-amber-500 dark:text-amber-400';
      case 'critical':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  const getBackgroundColor = (status: 'normal' | 'warning' | 'critical'): string => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20';
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      // Save changes
      setVitals(editedVitals);
    } else {
      // Enter edit mode
      setEditedVitals(vitals);
    }
    setEditMode(!editMode);
  };

  const handleVitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedVitals(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleRecordVitals = () => {
    // Record current vitals to history
    setVitalHistory(prev => [...prev, { ...vitals, timestamp: new Date() }]);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Activity size={28} className="text-blue-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Vital Signs Monitor</h2>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 rounded-lg text-lg font-medium ${
                editMode 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              {editMode ? 'Save Vitals' : 'Edit Vitals'}
            </button>
            
            <button
              onClick={handleRecordVitals}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-medium"
              disabled={editMode}
            >
              Record
            </button>
            
            <button
              onClick={() => setSimulateChanges(!simulateChanges)}
              className={`px-4 py-2 rounded-lg text-lg font-medium ${
                simulateChanges
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {simulateChanges ? 'Stop Simulation' : 'Simulate Changes'}
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <Clock size={16} className="mr-1" />
          Last updated: {formatTime(vitals.timestamp)}
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Heart Rate */}
          <div className={`p-4 rounded-lg ${getBackgroundColor(getVitalStatus('heartRate', vitals.heartRate))}`}>
            <div className="flex items-center mb-3">
              <Heart size={24} className={getStatusColor(getVitalStatus('heartRate', vitals.heartRate))} />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">Heart Rate</h3>
            </div>
            
            {editMode ? (
              <div className="flex items-center">
                <input
                  type="number"
                  name="heartRate"
                  value={editedVitals.heartRate}
                  onChange={handleVitalChange}
                  className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">bpm</span>
              </div>
            ) : (
              <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${getStatusColor(getVitalStatus('heartRate', vitals.heartRate))}`}>
                  {Math.round(vitals.heartRate)}
                </span>
                <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">bpm</span>
              </div>
            )}
            
            <div className="mt-2 text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Normal Range:</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">60-100 bpm</span>
            </div>
          </div>
          
          {/* Blood Pressure */}
          <div className={`p-4 rounded-lg ${
            getBackgroundColor(
              getVitalStatus('bloodPressureSystolic', vitals.bloodPressureSystolic) === 'critical' ||
              getVitalStatus('bloodPressureDiastolic', vitals.bloodPressureDiastolic) === 'critical'
                ? 'critical'
                : getVitalStatus('bloodPressureSystolic', vitals.bloodPressureSystolic) === 'warning' ||
                  getVitalStatus('bloodPressureDiastolic', vitals.bloodPressureDiastolic) === 'warning'
                  ? 'warning'
                  : 'normal'
            )
          }`}>
            <div className="flex items-center mb-3">
              <Droplets size={24} className={
                getStatusColor(
                  getVitalStatus('bloodPressureSystolic', vitals.bloodPressureSystolic) === 'critical' ||
                  getVitalStatus('bloodPressureDiastolic', vitals.bloodPressureDiastolic) === 'critical'
                    ? 'critical'
                    : getVitalStatus('bloodPressureSystolic', vitals.bloodPressureSystolic) === 'warning' ||
                      getVitalStatus('bloodPressureDiastolic', vitals.bloodPressureDiastolic) === 'warning'
                      ? 'warning'
                      : 'normal'
                )
              } />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">Blood Pressure</h3>
            </div>
            
            {editMode ? (
              <div className="flex items-center">
                <input
                  type="number"
                  name="bloodPressureSystolic"
                  value={editedVitals.bloodPressureSystolic}
                  onChange={handleVitalChange}
                  className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                />
                <span className="mx-2 text-gray-700 dark:text-gray-300">/</span>
                <input
                  type="number"
                  name="bloodPressureDiastolic"
                  value={editedVitals.bloodPressureDiastolic}
                  onChange={handleVitalChange}
                  className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">mmHg</span>
              </div>
            ) : (
              <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${
                  getStatusColor(
                    getVitalStatus('bloodPressureSystolic', vitals.bloodPressureSystolic) === 'critical'
                      ? 'critical'
                      : getVitalStatus('bloodPressureSystolic', vitals.bloodPressureSystolic) === 'warning'
                        ? 'warning'
                        : 'normal'
                  )
                }`}>
                  {Math.round(vitals.bloodPressureSystolic)}
                </span>
                <span className="mx-1 text-xl text-gray-700 dark:text-gray-300">/</span>
                <span className={`text-3xl font-bold ${
                  getStatusColor(
                    getVitalStatus('bloodPressureDiastolic', vitals.bloodPressureDiastolic) === 'critical'
                      ? 'critical'
                      : getVitalStatus('bloodPressureDiastolic', vitals.bloodPressureDiastolic) === 'warning'
                        ? 'warning'
                        : 'normal'
                  )
                }`}>
                  {Math.round(vitals.bloodPressureDiastolic)}
                </span>
                <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">mmHg</span>
              </div>
            )}
            
            <div className="mt-2 text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Normal Range:</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">100-140/60-90 mmHg</span>
            </div>
          </div>
          
          {/* SpO2 */}
          <div className={`p-4 rounded-lg ${getBackgroundColor(getVitalStatus('oxygenSaturation', vitals.oxygenSaturation))}`}>
            <div className="flex items-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={getStatusColor(getVitalStatus('oxygenSaturation', vitals.oxygenSaturation))}>
                <path d="M5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 21V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">SpO₂</h3>
            </div>
            
            {editMode ? (
              <div className="flex items-center">
                <input
                  type="number"
                  name="oxygenSaturation"
                  value={editedVitals.oxygenSaturation}
                  onChange={handleVitalChange}
                  className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                  min="0"
                  max="100"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">%</span>
              </div>
            ) : (
              <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${getStatusColor(getVitalStatus('oxygenSaturation', vitals.oxygenSaturation))}`}>
                  {Math.round(vitals.oxygenSaturation)}
                </span>
                <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">%</span>
              </div>
            )}
            
            <div className="mt-2 text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Normal Range:</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">95-100%</span>
            </div>
          </div>
          
          {/* Temperature */}
          <div className={`p-4 rounded-lg ${getBackgroundColor(getVitalStatus('temperature', vitals.temperature))}`}>
            <div className="flex items-center mb-3">
              <Thermometer size={24} className={getStatusColor(getVitalStatus('temperature', vitals.temperature))} />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">Temperature</h3>
            </div>
            
            {editMode ? (
              <div className="flex items-center">
                <input
                  type="number"
                  name="temperature"
                  value={editedVitals.temperature}
                  onChange={handleVitalChange}
                  className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                  step="0.1"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">°C</span>
              </div>
            ) : (
              <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${getStatusColor(getVitalStatus('temperature', vitals.temperature))}`}>
                  {vitals.temperature.toFixed(1)}
                </span>
                <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">°C</span>
              </div>
            )}
            
            <div className="mt-2 text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Normal Range:</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">36.1-37.8°C</span>
            </div>
          </div>
          
          {/* Respiratory Rate */}
          <div className={`p-4 rounded-lg ${getBackgroundColor(getVitalStatus('respiratoryRate', vitals.respiratoryRate))}`}>
            <div className="flex items-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={getStatusColor(getVitalStatus('respiratoryRate', vitals.respiratoryRate))}>
                <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 8H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">Respiratory Rate</h3>
            </div>
            
            {editMode ? (
              <div className="flex items-center">
                <input
                  type="number"
                  name="respiratoryRate"
                  value={editedVitals.respiratoryRate}
                  onChange={handleVitalChange}
                  className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">bpm</span>
              </div>
            ) : (
              <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${getStatusColor(getVitalStatus('respiratoryRate', vitals.respiratoryRate))}`}>
                  {Math.round(vitals.respiratoryRate)}
                </span>
                <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">bpm</span>
              </div>
            )}
            
            <div className="mt-2 text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Normal Range:</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">12-20 bpm</span>
            </div>
          </div>
          
          {/* ETCO2 */}
          <div className={`p-4 rounded-lg ${vitals.etCO2 ? getBackgroundColor(getVitalStatus('etCO2', vitals.etCO2)) : 'bg-gray-50 dark:bg-gray-700'}`}>
            <div className="flex items-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={vitals.etCO2 ? getStatusColor(getVitalStatus('etCO2', vitals.etCO2)) : 'text-gray-400'}>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12H6M9 12H12M15 12H18M21 12H21.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">ETCO₂</h3>
            </div>
            
            {editMode ? (
              <div className="flex items-center">
                <input
                  type="number"
                  name="etCO2"
                  value={editedVitals.etCO2 || ''}
                  onChange={handleVitalChange}
                  className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">mmHg</span>
              </div>
            ) : (
              <div className="flex items-baseline">
                {vitals.etCO2 ? (
                  <>
                    <span className={`text-3xl font-bold ${getStatusColor(getVitalStatus('etCO2', vitals.etCO2))}`}>
                      {Math.round(vitals.etCO2)}
                    </span>
                    <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">mmHg</span>
                  </>
                ) : (
                  <span className="text-xl text-gray-400 dark:text-gray-500">Not Monitored</span>
                )}
              </div>
            )}
            
            <div className="mt-2 text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Normal Range:</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">35-45 mmHg</span>
            </div>
          </div>
        </div>
        
        {/* Critical Alerts */}
        {(getVitalStatus('heartRate', vitals.heartRate) === 'critical' ||
          getVitalStatus('bloodPressureSystolic', vitals.bloodPressureSystolic) === 'critical' ||
          getVitalStatus('bloodPressureDiastolic', vitals.bloodPressureDiastolic) === 'critical' ||
          getVitalStatus('oxygenSaturation', vitals.oxygenSaturation) === 'critical' ||
          getVitalStatus('temperature', vitals.temperature) === 'critical' ||
          getVitalStatus('respiratoryRate', vitals.respiratoryRate) === 'critical' ||
          (vitals.etCO2 && getVitalStatus('etCO2', vitals.etCO2) === 'critical')) && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500 animate-pulse">
            <div className="flex items-center">
              <AlertTriangle size={24} className="text-red-500 mr-2" />
              <h3 className="text-xl font-bold text-red-500">Critical Alert</h3>
            </div>
            <ul className="mt-2 space-y-1 text-red-600 dark:text-red-400">
              {getVitalStatus('heartRate', vitals.heartRate) === 'critical' && (
                <li>Heart Rate: {Math.round(vitals.heartRate)} bpm (Critical)</li>
              )}
              {getVitalStatus('bloodPressureSystolic', vitals.bloodPressureSystolic) === 'critical' && (
                <li>Systolic BP: {Math.round(vitals.bloodPressureSystolic)} mmHg (Critical)</li>
              )}
              {getVitalStatus('bloodPressureDiastolic', vitals.bloodPressureDiastolic) === 'critical' && (
                <li>Diastolic BP: {Math.round(vitals.bloodPressureDiastolic)} mmHg (Critical)</li>
              )}
              {getVitalStatus('oxygenSaturation', vitals.oxygenSaturation) === 'critical' && (
                <li>SpO₂: {Math.round(vitals.oxygenSaturation)}% (Critical)</li>
              )}
              {getVitalStatus('temperature', vitals.temperature) === 'critical' && (
                <li>Temperature: {vitals.temperature.toFixed(1)}°C (Critical)</li>
              )}
              {getVitalStatus('respiratoryRate', vitals.respiratoryRate) === 'critical' && (
                <li>Respiratory Rate: {Math.round(vitals.respiratoryRate)} bpm (Critical)</li>
              )}
              {vitals.etCO2 && getVitalStatus('etCO2', vitals.etCO2) === 'critical' && (
                <li>ETCO₂: {Math.round(vitals.etCO2)} mmHg (Critical)</li>
              )}
            </ul>
          </div>
        )}
        
        {/* History */}
        {vitalHistory.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Vital History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">HR</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">BP</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SpO₂</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Temp</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">RR</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ETCO₂</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {vitalHistory.slice(-5).map((record, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatTime(record.timestamp)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{Math.round(record.heartRate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{Math.round(record.bloodPressureSystolic)}/{Math.round(record.bloodPressureDiastolic)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{Math.round(record.oxygenSaturation)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{record.temperature.toFixed(1)}°C</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{Math.round(record.respiratoryRate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{record.etCO2 ? Math.round(record.etCO2) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VitalSigns;