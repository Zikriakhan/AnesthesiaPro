import React, { useState } from 'react';
import { ClipboardList, Check, AlertTriangle, X } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  critical: boolean;
  completed: boolean;
  notes: string;
}

interface PreAnesthesiaChecklistProps {
  patientId?: string;
  onComplete?: (checklist: ChecklistItem[]) => void;
}

const PreAnesthesiaChecklist: React.FC<PreAnesthesiaChecklistProps> = ({ patientId, onComplete }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Patient Assessment
    { id: 'patient-id', category: 'Patient Verification', task: 'Confirm patient identity (name, DOB, MRN)', critical: true, completed: false, notes: '' },
    { id: 'consent', category: 'Patient Verification', task: 'Verify informed consent is signed', critical: true, completed: false, notes: '' },
    { id: 'allergies', category: 'Patient Verification', task: 'Review allergies and sensitivities', critical: true, completed: false, notes: '' },
    { id: 'npo-status', category: 'Patient Verification', task: 'Confirm NPO status', critical: true, completed: false, notes: '' },
    
    // Pre-op Assessment
    { id: 'medical-history', category: 'Pre-op Assessment', task: 'Review medical history', critical: false, completed: false, notes: '' },
    { id: 'medication-review', category: 'Pre-op Assessment', task: 'Medication reconciliation', critical: true, completed: false, notes: '' },
    { id: 'airway-assessment', category: 'Pre-op Assessment', task: 'Airway assessment', critical: true, completed: false, notes: '' },
    { id: 'asa-classification', category: 'Pre-op Assessment', task: 'ASA physical status classification', critical: false, completed: false, notes: '' },
    { id: 'vital-signs', category: 'Pre-op Assessment', task: 'Baseline vital signs recorded', critical: true, completed: false, notes: '' },
    
    // Equipment Check
    { id: 'anesthesia-machine', category: 'Equipment', task: 'Anesthesia machine checkout complete', critical: true, completed: false, notes: '' },
    { id: 'breathing-circuit', category: 'Equipment', task: 'Breathing circuit integrity confirmed', critical: true, completed: false, notes: '' },
    { id: 'suction', category: 'Equipment', task: 'Suction functioning', critical: true, completed: false, notes: '' },
    { id: 'difficult-airway', category: 'Equipment', task: 'Difficult airway equipment available', critical: true, completed: false, notes: '' },
    { id: 'monitoring-equipment', category: 'Equipment', task: 'Monitoring equipment functioning (ECG, BP, SpO₂, ETCO₂)', critical: true, completed: false, notes: '' },
    
    // Medications
    { id: 'emergency-drugs', category: 'Medications', task: 'Emergency drugs available', critical: true, completed: false, notes: '' },
    { id: 'induction-agents', category: 'Medications', task: 'Induction agents prepared', critical: false, completed: false, notes: '' },
    { id: 'muscle-relaxants', category: 'Medications', task: 'Muscle relaxants prepared if needed', critical: false, completed: false, notes: '' },
    { id: 'reversal-agents', category: 'Medications', task: 'Reversal agents available', critical: true, completed: false, notes: '' },
    { id: 'antiemetics', category: 'Medications', task: 'Antiemetics available', critical: false, completed: false, notes: '' },
    
    // Final Verification
    { id: 'site-verification', category: 'Final Verification', task: 'Surgical site verification complete', critical: true, completed: false, notes: '' },
    { id: 'team-briefing', category: 'Final Verification', task: 'Team briefing/time-out completed', critical: true, completed: false, notes: '' },
    { id: 'positioning', category: 'Final Verification', task: 'Patient positioning checked', critical: false, completed: false, notes: '' },
    { id: 'iv-access', category: 'Final Verification', task: 'IV access secure and functional', critical: true, completed: false, notes: '' }
  ]);
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);
  
  const toggleItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  const updateNotes = (id: string, notes: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    );
  };
  
  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };
  
  const getCategories = (): string[] => {
    return [...new Set(checklist.map(item => item.category))];
  };
  
  const getCategoryItems = (category: string): ChecklistItem[] => {
    return checklist.filter(item => 
      item.category === category && (!showIncompleteOnly || !item.completed)
    );
  };
  
  const getCategoryProgress = (category: string): { completed: number, total: number } => {
    const categoryItems = checklist.filter(item => item.category === category);
    const completed = categoryItems.filter(item => item.completed).length;
    return { completed, total: categoryItems.length };
  };
  
  const getOverallProgress = (): { completed: number, total: number } => {
    const completed = checklist.filter(item => item.completed).length;
    return { completed, total: checklist.length };
  };
  
  const allCriticalComplete = (): boolean => {
    return checklist.filter(item => item.critical).every(item => item.completed);
  };
  
  const handleSubmit = () => {
    if (onComplete) {
      onComplete(checklist);
    }
  };
  
  const overallProgress = getOverallProgress();
  const progressPercentage = Math.round((overallProgress.completed / overallProgress.total) * 100);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <ClipboardList size={28} className="text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pre-Anesthesia Checklist</h2>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-4 max-w-xs">
                <div 
                  className={`h-4 rounded-full ${
                    progressPercentage === 100 
                      ? 'bg-green-500' 
                      : progressPercentage > 60 
                        ? 'bg-blue-500' 
                        : 'bg-amber-500'
                  }`} 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {overallProgress.completed}/{overallProgress.total}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {progressPercentage}% complete
            </p>
          </div>
          
          <div className="flex space-x-3">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={showIncompleteOnly} 
                onChange={() => setShowIncompleteOnly(!showIncompleteOnly)}
                className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Show incomplete only</span>
            </label>
            
            <button
              onClick={handleSubmit}
              disabled={!allCriticalComplete()}
              className={`px-6 py-2 rounded-lg text-lg font-medium ${
                allCriticalComplete()
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              }`}
            >
              Submit Checklist
            </button>
          </div>
        </div>
        
        {!allCriticalComplete() && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
            <div className="flex">
              <AlertTriangle size={24} className="text-amber-500 mr-2 flex-shrink-0" />
              <p className="text-amber-700 dark:text-amber-400">
                Critical items must be completed before proceeding
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {getCategories().map(category => {
          const { completed, total } = getCategoryProgress(category);
          const items = getCategoryItems(category);
          
          if (items.length === 0 && showIncompleteOnly) {
            return null;
          }
          
          return (
            <div key={category} className="mb-6 last:mb-0">
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-xl font-medium">{category}</span>
                  <span className="ml-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {completed}/{total} completed
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${completed === total ? 'bg-green-500' : 'bg-blue-500'}`} 
                      style={{ width: `${Math.round((completed / total) * 100)}%` }}
                    ></div>
                  </div>
                  <svg 
                    className={`w-5 h-5 transition-transform ${activeCategory === category ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {activeCategory === category && (
                <div className="space-y-3 mt-3 ml-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4 animate-fadeIn">
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-lg ${
                        item.completed 
                          ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20' 
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => toggleItem(item.id)}
                            className={`w-6 h-6 flex items-center justify-center rounded-full ${
                              item.completed
                                ? 'bg-green-500 text-white'
                                : item.critical
                                  ? 'border-2 border-red-500 text-transparent hover:bg-red-50 dark:hover:bg-red-900/20'
                                  : 'border-2 border-gray-300 dark:border-gray-600 text-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {item.completed ? <Check size={16} /> : null}
                          </button>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center">
                            <p className={`text-lg font-medium ${
                              item.completed
                                ? 'text-gray-700 dark:text-gray-300'
                                : 'text-gray-800 dark:text-white'
                            }`}>
                              {item.task}
                            </p>
                            {item.critical && !item.completed && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium uppercase tracking-wide text-red-800 bg-red-100 dark:bg-red-900/30 dark:text-red-300 rounded">
                                Critical
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-2">
                            <textarea
                              placeholder="Add notes here..."
                              value={item.notes}
                              onChange={(e) => updateNotes(item.id, e.target.value)}
                              className="w-full p-2 text-sm border border-gray-200 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              rows={1}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreAnesthesiaChecklist;