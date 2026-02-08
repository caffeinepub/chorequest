import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import AppLogo from '../../components/branding/AppLogo';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <Card className="border-2 border-amber-300 dark:border-amber-700">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <AppLogo size="lg" />
        </div>
        <CardTitle className="text-3xl">Welcome, Brave Adventurer!</CardTitle>
        <CardDescription className="text-lg">
          Let's set up your quest profile and begin your journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-6 rounded-lg">
          <p className="text-center text-lg">
            <Sparkles className="inline w-5 h-5 text-amber-600 mr-2" />
            Transform your daily chores into epic quests and earn amazing rewards!
          </p>
        </div>
        <Button onClick={onNext} size="lg" className="w-full text-lg">
          Begin Your Adventure
        </Button>
      </CardContent>
    </Card>
  );
}
