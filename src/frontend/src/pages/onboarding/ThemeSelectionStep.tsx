import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetWorldThemes } from '../../hooks/useQueries';
import { Loader2 } from 'lucide-react';

interface ThemeSelectionStepProps {
  onNext: () => void;
  onSelect: (theme: string) => void;
}

export default function ThemeSelectionStep({ onNext, onSelect }: ThemeSelectionStepProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { data: themes, isLoading } = useGetWorldThemes();

  const themeImages: Record<string, string> = {
    Fantasy: '/assets/generated/world-forest-banner.dim_1600x400.png',
    Space: '/assets/generated/world-space-banner.dim_1600x400.png',
    Ocean: '/assets/generated/world-pirate-banner.dim_1600x400.png',
  };

  const handleSelect = (theme: string) => {
    setSelected(theme);
    onSelect(theme);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Choose Your World</CardTitle>
        <CardDescription>Select the theme for your adventure</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {themes?.map((theme) => (
            <button
              key={theme.name}
              onClick={() => handleSelect(theme.name)}
              className={`rounded-lg border-2 overflow-hidden transition-all ${
                selected === theme.name
                  ? 'border-amber-500 ring-2 ring-amber-300'
                  : 'border-border hover:border-amber-300'
              }`}
            >
              {themeImages[theme.name] && (
                <img
                  src={themeImages[theme.name]}
                  alt={theme.name}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-4">
                <div className="text-lg font-semibold">{theme.name}</div>
                <div className="text-sm text-muted-foreground">{theme.sceneStyling}</div>
              </div>
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
