import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface AnesthesiaOption {
  id: string;
  name: string;
  description: string;
  commonUses: string[];
  considerations: string[];
}

const anesthesiaOptions: AnesthesiaOption[] = [
  {
    id: 'general',
    name: 'General Anesthesia',
    description: 'Patient is completely unconscious and unable to feel pain. Includes administration of both IV and inhaled agents.',
    commonUses: ['Major surgeries', 'Lengthy procedures', 'When muscle relaxation is required', 'Procedures involving the airway'],
    considerations: ['Requires airway management', 'Post-operative nausea common', 'Longer recovery time', 'May cause temporary confusion in elderly']
  },
  {
    id: 'regional',
    name: 'Regional Anesthesia',
    description: 'Blocks pain to a specific region of the body. Patient remains conscious or lightly sedated.',
    commonUses: ['Orthopedic procedures', 'C-sections', 'Hernia repairs', 'Hand or arm surgeries'],
    considerations: ['Patient remains awake', 'Reduced post-operative pain', 'Faster recovery', 'May be combined with sedation']
  },
  {
    id: 'spinal',
    name: 'Spinal Anesthesia',
    description: 'Injection of local anesthetic into the subarachnoid space, blocking sensation below the injection point.',
    commonUses: ['Lower abdominal procedures', 'Lower extremity surgeries', 'Urological procedures', 'Obstetric procedures'],
    considerations: ['Potential for post-dural puncture headache', 'Limited duration', 'May cause temporary hypotension', 'Patient positioning critical']
  },
  {
    id: 'epidural',
    name: 'Epidural Anesthesia',
    description: 'Injection of local anesthetic into the epidural space, blocking sensation in targeted dermatomes.',
    commonUses: ['Labor and delivery', 'Thoracic procedures', 'Abdominal surgeries', 'Postoperative pain management'],
    considerations: ['Can be used for extended periods', 'Allows for titration', 'Lower risk of headache than spinal', 'May cause urinary retention']
  },
  {
    id: 'local',
    name: 'Local Anesthesia',
    description: 'Numbs a small specific area. Patient remains fully conscious.',
    commonUses: ['Minor skin procedures', 'Dental work', 'Eye surgeries', 'Biopsies'],
    considerations: ['Minimal systemic effects', 'Duration varies by agent', 'May require reapplication', 'Patient anxiety management important']
  },
  {
    id: 'mac',
    name: 'Monitored Anesthesia Care (MAC)',
    description: 'IV sedation with local anesthetic. Patient is sedated but breathing on their own.',
    commonUses: ['Endoscopies', 'Cataract surgery', 'Minor orthopedic procedures', 'Breast biopsies'],
    considerations: ['Airway monitoring required', 'Varying levels of sedation possible', 'Short recovery time', 'Patient may recall portions of procedure']
  }
];

interface AnesthesiaTypeSelectorProps {
  onSelect: (anesthesiaType: string) => void;
  selectedType?: string;
}

const AnesthesiaTypeSelector: React.FC<AnesthesiaTypeSelectorProps> = ({ onSelect, selectedType }) => {
  const [expandedOption, setExpandedOption] = useState<string | null>(null);

  const toggleDetails = (id: string) => {
    setExpandedOption(expandedOption === id ? null : id);
  };

  const handleSelect = (id: string) => {
    onSelect(id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Anesthesia Type Selection</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {anesthesiaOptions.map((option) => (
          <div 
            key={option.id}
            className={`border rounded-lg overflow-hidden transition-all duration-200 ${
              selectedType === option.id 
                ? 'border-blue-500 dark:border-blue-400 shadow-md' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div 
              className={`p-4 cursor-pointer ${
                selectedType === option.id 
                  ? 'bg-blue-50 dark:bg-blue-900' 
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleSelect(option.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{option.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDetails(option.id);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                  aria-label={expandedOption === option.id ? "Hide details" : "Show details"}
                >
                  <Info size={20} className="text-blue-500 dark:text-blue-400" />
                </button>
              </div>
              
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">{option.description}</p>
              
              {expandedOption === option.id && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Common Uses:</h4>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                      {option.commonUses.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Considerations:</h4>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                      {option.considerations.map((consideration, index) => (
                        <li key={index}>{consideration}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => handleSelect(option.id)}
                className={`w-full py-2 rounded-lg transition-colors text-lg font-medium ${
                  selectedType === option.id
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-400 border border-blue-500 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
              >
                {selectedType === option.id ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnesthesiaTypeSelector;