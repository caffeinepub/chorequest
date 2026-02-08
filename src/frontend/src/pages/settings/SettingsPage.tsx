import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useMode } from '../../context/ModeContext';
import { Sparkles, Briefcase } from 'lucide-react';

export default function SettingsPage() {
  const { mode, setMode, isKidsMode } = useMode();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your ChoreQuest experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interface Mode</CardTitle>
          <CardDescription>
            Choose between Kids Mode (colorful and fun) or Adults Mode (clean and efficient)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <div>
                <Label htmlFor="kids-mode" className="text-base font-semibold">Kids Mode</Label>
                <p className="text-sm text-muted-foreground">Large buttons, animations, quest narratives</p>
              </div>
            </div>
            <Switch
              id="kids-mode"
              checked={isKidsMode}
              onCheckedChange={(checked) => setMode(checked ? 'kids' : 'adults')}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-gray-600" />
              <div>
                <Label htmlFor="adults-mode" className="text-base font-semibold">Adults Mode</Label>
                <p className="text-sm text-muted-foreground">Minimal design, efficient task management</p>
              </div>
            </div>
            <Switch
              id="adults-mode"
              checked={!isKidsMode}
              onCheckedChange={(checked) => setMode(checked ? 'adults' : 'kids')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
