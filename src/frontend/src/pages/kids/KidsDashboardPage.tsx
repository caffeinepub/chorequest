import { useGetCallerUserProfile, useGetAllTasks, useGetLeaderboard } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import QuestCard from '../../components/kids/QuestCard';
import LeaderboardQuestMap from '../../components/kids/LeaderboardQuestMap';
import { TaskStatus } from '../../backend';

export default function KidsDashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: tasks, isLoading: tasksLoading } = useGetAllTasks();
  const { data: leaderboard } = useGetLeaderboard();

  if (profileLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
      </div>
    );
  }

  const availableQuests = tasks?.filter((t) => t.status === TaskStatus.todo) || [];
  const activeQuests = tasks?.filter((t) => t.status === TaskStatus.inProgress && t.assignedTo === profile?.id) || [];
  const completedQuests = tasks?.filter((t) => t.status === TaskStatus.done && t.assignedTo === profile?.id) || [];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Welcome back, {profile?.name}!
        </h1>
        <div className="flex items-center justify-center gap-4 text-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-amber-600">{profile?.points.toString()} Points</span>
          </div>
        </div>
      </div>

      {activeQuests.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-4 text-orange-600">🔥 Active Quests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeQuests.map((quest) => (
              <QuestCard key={quest.id.toString()} task={quest} theme={profile?.worldTheme} ageBracket={profile?.ageBracket} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold mb-4 text-amber-600">⚔️ Available Quests</h2>
        {availableQuests.length === 0 ? (
          <Card className="border-2 border-dashed border-amber-300">
            <CardContent className="py-12 text-center">
              <p className="text-xl text-muted-foreground">No quests available right now. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableQuests.map((quest) => (
              <QuestCard key={quest.id.toString()} task={quest} theme={profile?.worldTheme} ageBracket={profile?.ageBracket} />
            ))}
          </div>
        )}
      </section>

      {leaderboard && leaderboard.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-4 text-rose-600">🏆 Quest Leaderboard</h2>
          <LeaderboardQuestMap leaderboard={leaderboard} currentUserId={profile?.id} />
        </section>
      )}

      {completedQuests.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-4 text-green-600">✅ Completed Quests</h2>
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>You've completed {completedQuests.length} quests!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedQuests.slice(0, 5).map((quest) => (
                  <div key={quest.id.toString()} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-semibold">{quest.title}</span>
                    <span className="text-amber-600 font-bold">+{quest.points.toString()} pts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
