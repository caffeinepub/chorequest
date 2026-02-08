import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRegisterProfile } from '../../hooks/useQueries';
import { AgeBracket, UserRole } from '../../backend';
import { Progress } from '@/components/ui/progress';
import WelcomeStep from './WelcomeStep';
import AgeSelectionStep from './AgeSelectionStep';
import ProfileStep from './ProfileStep';
import AvatarCreatorStep from './AvatarCreatorStep';
import ThemeSelectionStep from './ThemeSelectionStep';
import RewardSystemStep from './RewardSystemStep';
import FirstQuestTutorialStep from './FirstQuestTutorialStep';

type OnboardingStep = 'welcome' | 'age' | 'profile' | 'avatar' | 'theme' | 'reward' | 'tutorial';

interface OnboardingData {
  ageBracket?: AgeBracket;
  name?: string;
  avatarId?: string;
  worldTheme?: string;
  rewardSystem?: string;
}

export default function OnboardingFlow() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [data, setData] = useState<OnboardingData>({});
  const navigate = useNavigate();
  const registerProfile = useRegisterProfile();

  const steps: OnboardingStep[] = ['welcome', 'age', 'profile', 'avatar', 'theme', 'reward', 'tutorial'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleComplete = async () => {
    if (data.name && data.avatarId && data.ageBracket && data.worldTheme) {
      try {
        await registerProfile.mutateAsync({
          name: data.name,
          role: UserRole.user,
          avatarId: data.avatarId,
          ageBracket: data.ageBracket,
          worldTheme: data.worldTheme,
        });
        navigate({ to: '/kids' });
      } catch (error) {
        console.error('Failed to register profile:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Progress value={progress} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Step {currentStepIndex + 1} of {steps.length}
        </p>
      </div>

      {step === 'welcome' && <WelcomeStep onNext={nextStep} />}
      {step === 'age' && <AgeSelectionStep onNext={nextStep} onSelect={(age) => updateData({ ageBracket: age })} />}
      {step === 'profile' && <ProfileStep onNext={nextStep} onSubmit={(name) => updateData({ name })} />}
      {step === 'avatar' && <AvatarCreatorStep onNext={nextStep} onSelect={(avatarId) => updateData({ avatarId })} />}
      {step === 'theme' && <ThemeSelectionStep onNext={nextStep} onSelect={(theme) => updateData({ worldTheme: theme })} />}
      {step === 'reward' && <RewardSystemStep onNext={nextStep} onSelect={(system) => updateData({ rewardSystem: system })} />}
      {step === 'tutorial' && <FirstQuestTutorialStep onComplete={handleComplete} ageBracket={data.ageBracket} theme={data.worldTheme} />}
    </div>
  );
}
