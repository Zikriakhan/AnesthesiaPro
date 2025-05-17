import React, { useState } from 'react';
import { ClipboardCheck, Check, AlertTriangle, ArrowRight } from 'lucide-react';

interface PostOpItem {
  id: string;
  category: string;
  task: string;
  critical: boolean;
  completed: boolean;
  notes: string;
  scores?: {
    name: string;
    value: number;
    max: number;
  }[];
}

interface PostAnesthesiaChecklistProps {
  patientId?: string;
  onComplete?: (checklist: PostOpItem[]) => void;
}

const PostAnesthesiaChecklist: React.FC<PostAnesthesiaChecklistProps> = ({ patientId, onComplete }) => {
  const [checklist, setChecklist] = useState<PostOpItem[]>([
    // Initial Assessment
    { 
      id: 'airway-assessment', 
      category: 'Initial Assessment', 
      task: 'Airway patency and respiratory function', 
      critical: true, 
      completed: false, 
      notes: '',
      scores: [
        { name: 'Respiratory effort', value: 0, max: 2 },
        { name: 'SpO₂ maintenance', value: 0, max: 2 }
      ]
    },
    { 
      id: 'consciousness', 
      category: 'Initial Assessment', 
      task: 'Level of consciousness', 
      critical: true, 
      completed: false, 
      notes: '',
      scores: [
        { name: 'Consciousness', value: 0, max: 2 }
      ]
    },
    { 
      id: 'vital-signs', 
      category: 'Initial Assessment', 
      task: 'Vital signs stable', 
      critical: true, 
      completed: false, 
      notes: '' 
    },
    { 
      id: 'pain-assessment', 
      category: 'Initial Assessment', 
      task: 'Pain assessment', 
      critical: true, 
      completed: false, 
      notes: '',
      scores: [
        { name: 'Pain score', value: 0, max: 3 }
      ]
    },
    
    // Recovery Progress
    { 
      id: 'orientation', 
      category: 'Recovery Progress', 
      task: 'Orientation to person, place, time', 
      critical: false, 
      completed: false, 
      notes: '' 
    },
    { 
      id: 'motor-function', 
      category: 'Recovery Progress', 
      task: 'Motor function assessment', 
      critical: false, 
      completed: false, 
      notes: '',
      scores: [
        { name: 'Motor activity', value: 0, max: 2 }
      ]
    },
    { 
      id: 'nausea-vomiting', 
      category: 'Recovery Progress', 
      task: 'Nausea/Vomiting assessment', 
      critical: false, 
      completed: false, 
      notes: '',
      scores: [
        { name: 'Nausea', value: 0, max: 2 }
      ]
    },
    { 
      id: 'surgical-site', 
      category: 'Recovery Progress', 
      task: 'Surgical site assessment', 
      critical: true, 
      completed: false, 
      notes: '' 
    },
    
    // Fluid & Medication Management
    { 
      id: 'iv-assessment', 
      category: 'Fluid & Medication Management', 
      task: 'IV access assessment', 
      critical: false, 
      completed: false, 
      notes: '' 
    },
    { 
      id: 'fluid-balance', 
      category: 'Fluid & Medication Management', 
      task: 'Fluid balance assessment', 
      critical: false, 
      completed: false, 
      notes: '' 
    },
    { 
      id: 'medication-admin', 
      category: 'Fluid & Medication Management', 
      task: 'Post-op medications administered', 
      critical: true, 
      completed: false, 
      notes: '' 
    },
    
    // Discharge Planning
    { 
      id: 'discharge-criteria', 
      category: 'Discharge Planning', 
      task: 'Discharge criteria met', 
      critical: true, 
      completed: false, 
      notes: '',
      scores: [
        { name: 'Activity', value: 0, max: 2 },
        { name: 'Respiration', value: 0, max: 2 },
        { name: 'Circulation', value: 0, max: 2 },
        { name: 'Consciousness', value: 0, max: 2 },
        { name: 'Oxygen saturation', value: 0, max: 2 }
      ]
    },
    { 
      id: 'instructions', 
      category: 'Discharge Planning', 
      task: 'Post-op instructions provided', 
      critical: true, 
      completed: false, 
      notes: '' 
    },
    { 
      id: 'followup', 
      category: 'Discharge Planning', 
      task: 'Follow-up appointment scheduled', 
      critical: false, 
      completed: false, 
      notes: '' 
    }
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
  
  const updateScore = (itemId: string, scoreName: string, value: number) => {
    setChecklist(prev => 
      prev.map(item => {
        if (item.id === itemId && item.scores) {
          const updatedScores = item.scores.map(score => 
            score.name === scoreName ? { ...score, value } : score
          );
          return { ...item, scores: updatedScores };
        }
        return item;
      })
    );
  };
  
  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };
  
  const getCategories = (): string[] => {
    return [...new Set(checklist.map(item => item.category))];
  };
  
  const getCategoryItems = (category: string): PostOpItem[] => {
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
  
  const getTotalAldreteScore = (): number => {
    let total = 0;
    checklist.forEach(item => {
      if (item.scores) {
        item.scores.forEach(score => {
          total += score.value;
        });
      }
    });
    return total;
  };
  
  const getMaxAldreteScore = (): number => {
    let max = 0;
    checklist.forEach(item => {
      if (item.scores) {
        item.scores.forEach(score => {
          max += score.max;
        });
      }
    });
    return max;
  };
  
  const allCriticalComplete = (): boolean => {
    return checklist.filter(item => item.critical).every(item => item.completed);
  };
  
  const isDischargeReady = (): boolean => {
    return allCriticalComplete() && getTotalAldreteScore() >= 9;
  };
  
  const handleSubmit = () => {
    if (onComplete) {
      onComplete(checklist);
    }
  };
  
  const overallProgress = getOverallProgress();
  const progressPercentage = Math.round((overallProgress.completed / overallProgress.total) * 100);
  const aldreteScore = getTotalAldreteScore();
  const maxAldreteScore = getMaxAldreteScore();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <ClipboardCheck size={28} className="text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Post-Anesthesia Checklist</h2>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Checklist Progress</p>
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
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Aldrete Score</p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                  {aldreteScore}
                </div>
                <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold">
                  {maxAldreteScore}
                </div>
                <span className="ml-3 text-sm font-medium">
                  {aldreteScore >= 9 ? (
                    <span className="text-green-500 dark:text-green-400">Discharge eligible</span>
                  ) : (
                    <span className="text-amber-500 dark:text-amber-400">Continue monitoring</span>
                  )}
                </span>
              </div>
            </div>
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
              disabled={!isDischargeReady()}
              className={`px-6 py-2 rounded-lg text-lg font-medium ${
                isDischargeReady()
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              }`}
            >
              <span className="flex items-center">
                Discharge Patient
                <ArrowRight size={16} className="ml-2" />
              </span>
            </button>
          </div>
        </div>
        
        {!isDischargeReady() && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
            <div className="flex">
              <AlertTriangle size={24} className="text-amber-500 mr-2 flex-shrink-0" />
              <p className="text-amber-700 dark:text-amber-400">
                {allCriticalComplete() 
                  ? 'Aldrete score must be ≥9 for discharge eligibility'
                  : 'Critical items must be completed before discharge'}
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
                          
                          {item.scores && item.scores.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {item.scores.map(score => (
                                <div key={score.name} className="flex flex-col">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{score.name}</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{score.value}/{score.max}</span>
                                  </div>
                                  <div className="flex space-x-2">
                                    {Array.from({ length: score.max + 1 }, (_, i) => (
                                      <button
                                        key={i}
                                        onClick={() => updateScore(item.id, score.name, i)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full ${
                                          score.value === i
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                      >
                                        {i}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="mt-3">
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

export default PostAnesthesiaChecklist;