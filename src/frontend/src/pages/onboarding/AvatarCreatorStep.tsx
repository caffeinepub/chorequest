import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AvatarCreatorStepProps {
  onNext: () => void;
  onSelect: (avatarId: string) => void;
}

export default function AvatarCreatorStep({ onNext, onSelect }: AvatarCreatorStepProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const avatars = [
    { id: 'knight', emoji: '🛡️', name: 'Knight' },
    { id: 'wizard', emoji: '🧙', name: 'Wizard' },
    { id: 'ninja', emoji: '🥷', name: 'Ninja' },
    { id: 'pirate', emoji: '🏴‍☠️', name: 'Pirate' },
    { id: 'astronaut', emoji: '🚀', name: 'Astronaut' },
    { id: 'dragon', emoji: '🐉', name: 'Dragon' },
  ];

  const handleSelect = (avatarId: string) => {
    setSelected(avatarId);
    onSelect(avatarId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Choose Your Avatar</CardTitle>
        <CardDescription>Pick your hero's appearance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleSelect(avatar.id)}
              className={`p-6 rounded-lg border-2 transition-all ${
                selected === avatar.id
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950'
                  : 'border-border hover:border-amber-300'
              }`}
            >
              <div className="text-5xl mb-2">{avatar.emoji}</div>
              <div className="text-sm font-semibold">{avatar.name}</div>
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
