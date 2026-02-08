import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Trophy } from 'lucide-react';
import { AgeBracket } from '../../backend';

interface FirstQuestTutorialStepProps {
  onComplete: () => void;
  ageBracket?: AgeBracket;
  theme?: string;
}

export default function FirstQuestTutorialStep({ onComplete, ageBracket, theme }: FirstQuestTutorialStepProps) {
  const [completed, setCompleted] = useState(false);

  const handleAccept = () => {
    setTimeout(() => {
      setCompleted(true);
    }, 500);
  };

  if (completed) {
    return (
      <Card className="border-2 border-amber-400 dark:border-amber-600">
        <CardHeader className="text-center">
          <Trophy className="w-16 h-16 mx-auto text-amber-500 mb-4" />
          <CardTitle className="text-3xl">🎉 Quest Complete!</CardTitle>
          <CardDescription className="text-lg">
            Amazing work! You've completed your first quest and earned 50 points!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-6 rounded-lg text-center">
            <p className="text-lg font-semibold">You're ready for more adventures!</p>
          </div>
          <Button onClick={onComplete} size="lg" className="w-full text-lg">
            Start Your Journey
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Your First Quest Awaits!</CardTitle>
        <CardDescription>Let's try completing a simple quest</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-amber-300 dark:border-amber-700 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Tutorial Quest: Learn the Basics</h3>
              <p className="text-muted-foreground mb-4">
                🎯 Welcome, brave adventurer! Your first mission is to learn how quests work in the {theme || 'magical'} realm. 
                Click the button below to accept this quest and begin your journey!
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Quest Tips:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Accept quests to start them</li>
                  <li>Complete tasks to earn rewards</li>
                  <li>Check your progress anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleAccept} size="lg" className="w-full text-lg">
          Accept Quest
        </Button>
      </CardContent>
    </Card>
  );
}
