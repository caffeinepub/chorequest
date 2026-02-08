import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Gem, Star } from 'lucide-react';

interface RewardSystemStepProps {
  onNext: () => void;
  onSelect: (system: string) => void;
}

export default function RewardSystemStep({ onNext, onSelect }: RewardSystemStepProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const systems = [
    { id: 'points', name: 'Points', icon: Star, color: 'text-amber-500' },
    { id: 'money', name: 'Coins', icon: Coins, color: 'text-yellow-500' },
    { id: 'gems', name: 'Gems', icon: Gem, color: 'text-purple-500' },
  ];

  const handleSelect = (system: string) => {
    setSelected(system);
    onSelect(system);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Choose Your Reward System</CardTitle>
        <CardDescription>How would you like to earn rewards?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {systems.map((system) => {
            const Icon = system.icon;
            return (
              <button
                key={system.id}
                onClick={() => handleSelect(system.id)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selected === system.id
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950'
                    : 'border-border hover:border-amber-300'
                }`}
              >
                <Icon className={`w-12 h-12 mx-auto mb-2 ${system.color}`} />
                <div className="text-lg font-semibold">{system.name}</div>
              </button>
            );
          })}
        </div>
        <Button onClick={onNext} disabled={!selected} size="lg" className="w-full">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
