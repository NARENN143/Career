
import { CareerProfile, RoadmapTask } from './types';

/**
 * The "Offline Feed" Strategy Engine.
 * This simulates an AI mentor by performing deep analysis on the user's 
 * structured profile data and generated roadmap.
 */
export const getLocalMentorResponse = (message: string, profile: CareerProfile): string => {
  const query = message.toLowerCase();
  const firstName = profile.name.split(' ')[0] || 'Learner';
  const career = profile.selectedCareer || 'your target role';

  // 1. ANALYZE ROADMAP PROGRESS
  const allTasks = profile.roadmap?.flatMap(l => l.tasks) || [];
  const completedTasks = allTasks.filter(t => t.completed);
  const pendingTasks = allTasks.filter(t => !t.completed);
  const nextTask = pendingTasks[0];

  // 2. TACTICAL RESPONSES
  
  // Progress/Status Query
  if (query.includes('progress') || query.includes('status') || query.includes('how am i doing')) {
    const progressPercent = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;
    return `### Strategic Progress Report: ${firstName}
    
Current Mastery: **${progressPercent}%**
Completed Milestones: **${completedTasks.length} / ${allTasks.length}**

**Observation:** You are currently in the **${profile.roadmap?.[0]?.title || 'Foundation'}** phase. Your commitment of **${profile.availableHoursPerDay} hours/day** is sufficient to maintain this velocity.

**Next Strategic Move:** 
Finalize your current task: *"${nextTask?.title || 'Initial Setup'}"*. This is a critical ${nextTask?.type || 'skill'} building block.`;
  }

  // Task/Action Query
  if (query.includes('next') || query.includes('what should i do') || query.includes('todo') || query.includes('roadmap')) {
    if (!nextTask) return `Your roadmap for **${career}** is currently complete. We should look into advanced specializations or real-world project deployments.`;
    
    return `### Operational Priority:
    
The local strategy engine recommends focusing on:
**Task:** ${nextTask.title}
**Type:** ${nextTask.type.toUpperCase()}
**Estimated Effort:** ${nextTask.duration}

**Context:** This task was prioritized because it bridges the gap between your strengths in **${profile.strengths[0] || 'your core skills'}** and the requirements for **${career}**. 

*Action Item:* Complete the description requirements: "${nextTask.description}"`;
  }

  // Skill Gap / Improvement Query
  if (query.includes('weak') || query.includes('gap') || query.includes('improve') || query.includes('help')) {
    const primaryWeakness = profile.weaknesses[0] || "broad industry exposure";
    const relevantTasks = pendingTasks.filter(t => t.type === 'theory' || t.type === 'skill').slice(0, 2);
    
    return `### Growth Optimization:
    
I have identified **${primaryWeakness}** as your primary bottleneck for the **${career}** path.

**Remediation Strategy:**
1. **Focus on Theory:** Dedicate 30% of your daily ${profile.availableHoursPerDay}h to deep-diving into "${relevantTasks[0]?.title || 'Core Principles'}".
2. **Project Implementation:** Don't just read; build. Your roadmap suggests "${relevantTasks[1]?.title || 'a practical project'}" to validate this knowledge.

Would you like me to break down a study plan for one of these?`;
  }

  // Career/Interview Advice
  if (query.includes('job') || query.includes('interview') || query.includes('career') || query.includes('portfolio')) {
    return `### Deployment Strategy for ${career}:

Based on your profile "Feed", here is your competitive edge:
1. **Leverage Strengths:** Your background in **${profile.interests.join(', ')}** makes you a unique candidate.
2. **Portfolio Focus:** Ensure you document the ${completedTasks.length} milestones you've already hit.
3. **Interview Pivot:** When asked about weaknesses, mention how you are systematically using ElevateAI to tackle **${profile.weaknesses[0] || 'technical gaps'}**.

**Tactical Tip:** Focus your portfolio on the **Project-type** tasks in your Level 2 and Level 3 modules.`;
  }

  // Default "Strategy Mode" Fallback
  return `### Strategy Engine: Online (Local Feed Mode)

Greetings ${firstName}. I am processing your career trajectory for **${career}** using your local data feed.

**Available Offline Analytics:**
* **Progress Audits:** Ask "How is my progress?"
* **Action Plans:** Ask "What is my next task?"
* **Skill Diagnostics:** Ask "What are my gaps?"
* **Tactical Advice:** Ask "How do I prep for a job?"

What objective shall we tackle in this session?`;
};
