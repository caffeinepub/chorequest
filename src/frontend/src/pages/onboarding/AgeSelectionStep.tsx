import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AgeBracket } from '../../backend';

interface AgeSelectionStepProps {
  onNext: () => void;
  onSelect: (age: AgeBracket) => void;
}

export default function AgeSelectionStep({ onNext, onSelect }: AgeSelectionStepProps) {
  const [selected, setSelected] = useState<AgeBracket | null>(null);

  const ages = [
    { value: AgeBracket.ages4To8, label: '4-8 years', emoji: '🌟' },
    { value: AgeBracket.ages9To12, label: '9-12 years', emoji: '⚔️' },
    { value: AgeBracket.ages13To17, label: '13-17 years', emoji: '🏆' },
    { value: AgeBracket.adult, label: '18+ years', emoji: '👑' },
  ];

  const handleSelect = (age: AgeBracket) => {
    setSelected(age);
    onSelect(age);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Choose Your Age Group</CardTitle>
        <CardDescription>This helps us tailor quests just for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ages.map((age) => (
            <button
              key={age.value}
              onClick={() => handleSelect(age.value)}
              className={`p-6 rounded-lg border-2 transition-all ${
                selected === age.value
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950'
                  : 'border-border hover:border-amber-300'
              }`}
            >
              <div className="text-4xl mb-2">{age.emoji}</div>
              <div className="text-lg font-semibold">{age.label}</div>
            </button>
          ))}
        </div>
        <Button onClick={onNext} disabled={!selected} size="lg" className="w-full">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
