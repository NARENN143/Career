
import React, { useState } from 'react';
import { UserStatus, CareerProfile } from '../types';
import { suggestCareers, generateRoadmap, ApiError } from '../geminiService';
import { ArrowRight, Loader2, Sparkles, BrainCircuit, AlertCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: Partial<CareerProfile>) => void;
  onError?: (msg: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onError }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<CareerProfile>>({
    name: '',
    status: UserStatus.STUDENT,
    education: '',
    interests: [],
    strengths: [],
    weaknesses: [],
    availableHoursPerDay: 4,
    timelineMonths: 6,
  });

  const nextStep = () => setStep(step + 1);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    }));
  };

  const finishOnboarding = async (career: string) => {
    setLoading(true);
    try {
      const finalProfile = { ...formData, selectedCareer: career, onboardingComplete: true } as CareerProfile;
      const roadmap = await generateRoadmap(finalProfile);
      onComplete({ ...finalProfile, roadmap });
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        onError?.(err.message);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const result = await suggestCareers(formData);
      setSuggestions(result);
      nextStep();
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        onError?.(err.message);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 relative">
        <div className="mb-8 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-600' : 'bg-slate-100'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome to ElevateAI</h2>
              <p className="text-slate-500">Let's start by getting to know you.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(UserStatus).map(status => (
                    <button
                      key={status}
                      onClick={() => setFormData({...formData, status})}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${formData.status === status ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={nextStep}
              disabled={!formData.name}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              Continue <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-8">
              <BrainCircuit className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Interests & Skills</h2>
              <p className="text-slate-500">Pick things you're passionate about.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Coding', 'Design', 'Marketing', 'Data', 'Writing', 'Finance', 'AI', 'Sales', 'Product Management', 'Cybersecurity'].map(interest => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${formData.interests?.includes(interest) ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Education</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600"
                  value={formData.education}
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                >
                  <option value="">Select Level</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor's</option>
                  <option value="Master">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Target Timeline</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600"
                  value={formData.timelineMonths}
                  onChange={(e) => setFormData({...formData, timelineMonths: Number(e.target.value)})}
                >
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>1 Year</option>
                  <option value={24}>2 Years</option>
                </select>
              </div>
            </div>
            <button 
              onClick={getSuggestions}
              disabled={loading || formData.interests?.length === 0}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Find My Path'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Career Matches</h2>
              <p className="text-slate-500">AI suggested these paths based on your profile.</p>
            </div>
            <div className="space-y-4">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => finishOnboarding(s.title)}
                  className="w-full text-left p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-xl text-slate-800">{s.title}</h3>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{s.explanation}</p>
                </button>
              ))}
            </div>
            {loading && (
              <div className="flex flex-col items-center justify-center p-8 text-indigo-600">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p className="font-semibold text-center">Constructing your professional destiny...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
