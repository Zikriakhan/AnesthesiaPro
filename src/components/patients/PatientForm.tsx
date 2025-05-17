import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

interface PatientFormProps {
  onSave: (patient: PatientData) => void;
  onCancel: () => void;
  initialData?: PatientData;
}

export interface PatientData {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  weight: string;
  height: string;
  allergies: string;
  medicalHistory: string;
  currentMedications: string;
  mrn: string;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSave, onCancel, initialData }) => {
  const [patient, setPatient] = useState<PatientData>(
    initialData || {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      weight: '',
      height: '',
      allergies: '',
      medicalHistory: '',
      currentMedications: '',
      mrn: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(patient);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {initialData ? 'Edit Patient' : 'New Patient'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="mrn" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              MRN
            </label>
            <input
              type="text"
              id="mrn"
              name="mrn"
              value={patient.mrn}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
              placeholder="Medical Record Number"
              required
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={patient.dateOfBirth}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={patient.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
              placeholder="First Name"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={patient.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
              placeholder="Last Name"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={patient.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="weight" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={patient.weight}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                placeholder="Weight in kg"
                required
              />
            </div>

            <div className="flex-1">
              <label htmlFor="height" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={patient.height}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                placeholder="Height in cm"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="allergies" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Allergies
          </label>
          <textarea
            id="allergies"
            name="allergies"
            value={patient.allergies}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
            placeholder="List all known allergies, or note 'No Known Allergies'"
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="currentMedications" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Medications
          </label>
          <textarea
            id="currentMedications"
            name="currentMedications"
            value={patient.currentMedications}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
            placeholder="List all current medications with dosages"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="medicalHistory" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Medical History
          </label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            value={patient.medicalHistory}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
            placeholder="Relevant medical history including past surgeries, conditions, etc."
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-lg font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-medium flex items-center gap-2"
          >
            <Save size={20} />
            Save Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;