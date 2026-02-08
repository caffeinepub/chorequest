import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetWorldThemes } from '../../hooks/useQueries';

export default function ThemeManager() {
  const { data: themes } = useGetWorldThemes();

  const themeImages: Record<string, string> = {
    Fantasy: '/assets/generated/world-forest-banner.dim_1600x400.png',
    Space: '/assets/generated/world-space-banner.dim_1600x400.png',
    Ocean: '/assets/generated/world-pirate-banner.dim_1600x400.png',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>World Themes</CardTitle>
        <CardDescription>Available themes for your family's adventure</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {themes?.map((theme) => (
            <div key={theme.name} className="border rounded-lg overflow-hidden">
              {themeImages[theme.name] && (
                <img
                  src={themeImages[theme.name]}
                  alt={theme.name}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{theme.name}</h3>
                <p className="text-sm text-muted-foreground">{theme.sceneStyling}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
