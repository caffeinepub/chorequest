import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '../../backend';
import { Trophy, Crown, Medal } from 'lucide-react';

interface LeaderboardQuestMapProps {
  leaderboard: UserProfile[];
  currentUserId?: bigint;
}

export default function LeaderboardQuestMap({ leaderboard, currentUserId }: LeaderboardQuestMapProps) {
  return (
    <Card className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/generated/leaderboard-quest-map-bg.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <CardHeader className="relative z-10">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Trophy className="w-8 h-8 text-amber-500" />
          Quest Champions
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-3">
        {leaderboard.slice(0, 10).map((profile, index) => {
          const isCurrentUser = profile.id === currentUserId;
          const rank = index + 1;

          return (
            <div
              key={profile.id.toString()}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                isCurrentUser
                  ? 'bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-400'
                  : 'bg-white/80 dark:bg-gray-800/80'
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-lg">
                {rank === 1 && <Crown className="w-6 h-6" />}
                {rank === 2 && <Medal className="w-6 h-6" />}
                {rank === 3 && <Medal className="w-6 h-6" />}
                {rank > 3 && rank}
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{profile.name}</p>
                <p className="text-sm text-muted-foreground">{profile.worldTheme} Adventurer</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-600">{profile.points.toString()}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
