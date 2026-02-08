import { useMode } from '../context/ModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Sword, Trophy, Users } from 'lucide-react';
import AppLogo from '../components/branding/AppLogo';
import LoginButton from '../components/auth/LoginButton';

export default function WelcomePage() {
  const { mode } = useMode();
  const isKidsMode = mode === 'kids';

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center mb-6">
          <AppLogo size="lg" />
        </div>
        
        <div className="space-y-4">
          <h1 className={`${isKidsMode ? 'text-5xl' : 'text-4xl'} font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent`}>
            Transform Chores into Epic Quests!
          </h1>
          <p className={`${isKidsMode ? 'text-xl' : 'text-lg'} text-muted-foreground max-w-2xl mx-auto`}>
            Turn everyday tasks into exciting adventures. Earn rewards, level up your avatar, and compete with your family in a magical world of quests!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <Card className="border-2 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <Sword className="w-10 h-10 mx-auto text-amber-600 mb-2" />
              <CardTitle className="text-lg">Epic Quests</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Every chore becomes an adventure with AI-generated quest narratives</CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <Trophy className="w-10 h-10 mx-auto text-orange-600 mb-2" />
              <CardTitle className="text-lg">Earn Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Complete quests to earn points and unlock amazing rewards</CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-rose-200 dark:border-rose-800">
            <CardHeader>
              <Users className="w-10 h-10 mx-auto text-rose-600 mb-2" />
              <CardTitle className="text-lg">Family Fun</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Compete on the leaderboard and celebrate achievements together</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center gap-4">
          <LoginButton />
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Sign in to begin your adventure
          </p>
        </div>
      </div>
    </div>
  );
}
