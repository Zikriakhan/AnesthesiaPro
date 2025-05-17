import React, { useState, useEffect } from 'react';
import { Calculator, AlertTriangle } from 'lucide-react';

interface DosageCalculatorProps {
  patientWeight?: number;
  patientAge?: number;
}

interface MedicationOption {
  id: string;
  name: string;
  category: string;
  doseRange: {
    min: number;
    max: number;
    unit: string;
    weightBased: boolean;
  };
  notes?: string;
  warnings?: string[];
}

const medications: MedicationOption[] = [
  {
    id: 'propofol',
    name: 'Propofol',
    category: 'Induction',
    doseRange: {
      min: 1.5,
      max: 2.5,
      unit: 'mg/kg',
      weightBased: true,
    },
    warnings: ['Reduce dose in elderly or debilitated patients', 'May cause hypotension']
  },
  {
    id: 'fentanyl',
    name: 'Fentanyl',
    category: 'Opioid',
    doseRange: {
      min: 0.5,
      max: 2,
      unit: 'mcg/kg',
      weightBased: true,
    },
    warnings: ['Respiratory depression', 'Chest wall rigidity with rapid administration']
  },
  {
    id: 'midazolam',
    name: 'Midazolam',
    category: 'Benzodiazepine',
    doseRange: {
      min: 0.02,
      max: 0.05,
      unit: 'mg/kg',
      weightBased: true,
    },
    warnings: ['Reduce dose in elderly patients', 'May cause respiratory depression when combined with opioids']
  },
  {
    id: 'rocuronium',
    name: 'Rocuronium',
    category: 'Neuromuscular Blocker',
    doseRange: {
      min: 0.6,
      max: 1.2,
      unit: 'mg/kg',
      weightBased: true,
    },
    notes: 'Duration approximately 30-40 minutes at 0.6 mg/kg'
  },
  {
    id: 'lidocaine',
    name: 'Lidocaine',
    category: 'Local Anesthetic',
    doseRange: {
      min: 1,
      max: 2,
      unit: 'mg/kg',
      weightBased: true,
    },
    warnings: ['Max total dose: 4.5 mg/kg', 'Watch for CNS toxicity']
  },
  {
    id: 'neostigmine',
    name: 'Neostigmine',
    category: 'Reversal Agent',
    doseRange: {
      min: 0.03,
      max: 0.07,
      unit: 'mg/kg',
      weightBased: true,
    },
    notes: 'Administer with glycopyrrolate to counteract muscarinic effects'
  }
];

const DosageCalculator: React.FC<DosageCalculatorProps> = ({ patientWeight, patientAge }) => {
  const [selectedMedication, setSelectedMedication] = useState<string>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [customDose, setCustomDose] = useState<number | ''>('');
  const [calculatedDose, setCalculatedDose] = useState<{ min: number; max: number; unit: string } | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (patientWeight) {
      setWeight(patientWeight);
    }
    if (patientAge) {
      setAge(patientAge);
    }
  }, [patientWeight, patientAge]);

  const handleMedicationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMedication(e.target.value);
    setCalculatedDose(null);
    setCustomDose('');
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    setWeight(value);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    setAge(value);
  };

  const handleCustomDoseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    setCustomDose(value);
  };

  const calculateDose = () => {
    if (!selectedMedication || weight === '') return;

    const medication = medications.find(med => med.id === selectedMedication);
    if (!medication) return;

    if (medication.doseRange.weightBased) {
      const min = Number((medication.doseRange.min * Number(weight)).toFixed(2));
      const max = Number((medication.doseRange.max * Number(weight)).toFixed(2));
      setCalculatedDose({ min, max, unit: medication.doseRange.unit.replace('kg', '') });
      
      // Adjust warnings based on age
      if (age !== '' && Number(age) > 65 && 
          (medication.id === 'propofol' || medication.id === 'midazolam' || medication.id === 'fentanyl')) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }
  };

  const getMedicationById = (id: string) => {
    return medications.find(med => med.id === id);
  };

  const selectedMedicationData = selectedMedication ? getMedicationById(selectedMedication) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Calculator size={28} className="text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Anesthesia Dosage Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="medication" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Medication
          </label>
          <select
            id="medication"
            value={selectedMedication}
            onChange={handleMedicationChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
          >
            <option value="">Select a medication</option>
            {medications.map(med => (
              <option key={med.id} value={med.id}>{med.name} ({med.category})</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="weight" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Patient Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={handleWeightChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
            placeholder="Enter weight in kg"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Patient Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={handleAgeChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
            placeholder="Enter age in years"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={calculateDose}
            disabled={!selectedMedication || weight === ''}
            className={`w-full p-3 rounded-lg text-white text-lg font-medium ${
              !selectedMedication || weight === ''
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Calculate Dose
          </button>
        </div>
      </div>

      {calculatedDose && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            Calculated Dose for {selectedMedicationData?.name}:
          </h3>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            {calculatedDose.min} - {calculatedDose.max} {calculatedDose.unit}
          </div>
          
          {showWarning && (
            <div className="mt-3 flex items-start text-amber-600 dark:text-amber-400">
              <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-1" />
              <span>Consider reduced dosing for elderly patient (age {age})</span>
            </div>
          )}
          
          <div className="mt-4">
            <label htmlFor="customDose" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Administered Dose ({calculatedDose.unit}):
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="customDose"
                value={customDose}
                onChange={handleCustomDoseChange}
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                placeholder="Enter actual dose administered"
              />
              <button
                className="ml-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-medium"
                disabled={customDose === ''}
              >
                Record
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMedicationData && (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            {selectedMedicationData.name} Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Category:</span> {selectedMedicationData.category}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Standard Dose:</span> {selectedMedicationData.doseRange.min} - {selectedMedicationData.doseRange.max} {selectedMedicationData.doseRange.unit}
              </p>
              {selectedMedicationData.notes && (
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  <span className="font-medium">Notes:</span> {selectedMedicationData.notes}
                </p>
              )}
            </div>
            
            {selectedMedicationData.warnings && selectedMedicationData.warnings.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg">
                <div className="flex items-center text-amber-700 dark:text-amber-400 font-medium mb-2">
                  <AlertTriangle size={20} className="mr-2" />
                  <span>Warnings:</span>
                </div>
                <ul className="list-disc pl-5 text-amber-700 dark:text-amber-400 space-y-1">
                  {selectedMedicationData.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DosageCalculator;