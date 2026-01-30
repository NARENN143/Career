
import React, { useState, useEffect } from 'react';
import { CareerProfile, UserStatus } from './types';
import Onboarding from './components/Onboarding';
import DashboardLayout from './components/DashboardLayout';
import RoadmapView from './components/RoadmapView';
import MentorChat from './components/MentorChat';
import CalendarView from './components/CalendarView';
import NewsletterView from './components/NewsletterView';
import OpportunityDiscovery from './components/OpportunityDiscovery';
import AnalyticsView from './components/AnalyticsView';

const App: React.FC = () => {
  const [profile, setProfile] = useState<CareerProfile>({
    name: '',
    status: UserStatus.STUDENT,
    education: '',
    interests: [],
    strengths: [],
    weaknesses: [],
    availableHoursPerDay: 4,
    timelineMonths: 6,
    onboardingComplete: false,
    streak: 0,
    lastEngagementDate: undefined
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'roadmap' | 'mentor' | 'calendar' | 'newsletter' | 'opportunities'>('dashboard');

  // Load state and calculate streak
  useEffect(() => {
    const saved = localStorage.getItem('elevate_profile');
    if (saved) {
      const parsedProfile: CareerProfile = JSON.parse(saved);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();

      if (parsedProfile.onboardingComplete) {
        let currentStreak = parsedProfile.streak || 0;
        const lastDateStr = parsedProfile.lastEngagementDate;

        if (!lastDateStr) {
          currentStreak = 1;
        } else {
          const lastDate = new Date(lastDateStr);
          lastDate.setHours(0, 0, 0, 0);
          
          const diffInMs = today.getTime() - lastDate.getTime();
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

          if (diffInDays === 1) {
            currentStreak += 1;
          } else if (diffInDays > 1) {
            currentStreak = 1;
          }
        }

        const updatedProfile = { 
          ...parsedProfile, 
          streak: currentStreak, 
          lastEngagementDate: todayStr 
        };
        setProfile(updatedProfile);
        localStorage.setItem('elevate_profile', JSON.stringify(updatedProfile));
      } else {
        setProfile(parsedProfile);
      }
    }
  }, []);

  const updateProfile = (updates: Partial<CareerProfile>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      localStorage.setItem('elevate_profile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  if (!profile.onboardingComplete) {
    return <Onboarding onComplete={updateProfile} />;
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} profile={profile}>
      <div className="p-4 md:p-8 space-y-8 animate-fade-in relative">
        {activeTab === 'dashboard' && <AnalyticsView profile={profile} />}
        {activeTab === 'roadmap' && <RoadmapView profile={profile} onUpdate={updateProfile} />}
        {activeTab === 'mentor' && <MentorChat profile={profile} onUpdate={updateProfile} />}
        {activeTab === 'calendar' && <CalendarView profile={profile} />}
        {activeTab === 'newsletter' && <NewsletterView profile={profile} />}
        {activeTab === 'opportunities' && <OpportunityDiscovery profile={profile} />}
      </div>
    </DashboardLayout>
  );
};

export default App;
