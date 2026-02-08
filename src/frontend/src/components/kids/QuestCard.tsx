import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useClaimTask, useCompleteTask } from '../../hooks/useQueries';
import { Task, TaskStatus, AgeBracket } from '../../backend';
import { Sparkles, CheckCircle, Loader2 } from 'lucide-react';

interface QuestCardProps {
  task: Task;
  theme?: string;
  ageBracket?: AgeBracket;
}

export default function QuestCard({ task, theme, ageBracket }: QuestCardProps) {
  const claimTask = useClaimTask();
  const completeTask = useCompleteTask();

  const isAvailable = task.status === TaskStatus.todo;
  const isActive = task.status === TaskStatus.inProgress;
  const isDone = task.status === TaskStatus.done;

  const handleAccept = () => {
    claimTask.mutate(task.id);
  };

  const handleComplete = () => {
    completeTask.mutate(task.id);
  };

  const progress = isDone ? 100 : isActive ? 50 : 0;

  return (
    <Card className={`border-2 transition-all hover:shadow-lg ${
      isActive ? 'border-orange-400 bg-orange-50/50 dark:bg-orange-950/20' : 
      isDone ? 'border-green-400 bg-green-50/50 dark:bg-green-950/20' : 
      'border-amber-300 hover:border-amber-400'
    }`}>
      <CardHeader>
        <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
          <img
            src="/assets/generated/quest-card-placeholder.dim_800x500.png"
            alt={task.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full font-bold text-sm">
            {task.points.toString()} pts
          </div>
        </div>
        <CardTitle className="text-2xl flex items-center gap-2">
          {isActive && <Sparkles className="w-6 h-6 text-orange-500" />}
          {isDone && <CheckCircle className="w-6 h-6 text-green-500" />}
          {task.title}
        </CardTitle>
        <CardDescription className="text-base">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {isAvailable && (
          <Button
            onClick={handleAccept}
            disabled={claimTask.isPending}
            size="lg"
            className="w-full text-lg font-bold"
          >
            {claimTask.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Accepting...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Accept Quest
              </>
            )}
          </Button>
        )}

        {isActive && (
          <Button
            onClick={handleComplete}
            disabled={completeTask.isPending}
            size="lg"
            className="w-full text-lg font-bold bg-green-600 hover:bg-green-700"
          >
            {completeTask.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Quest
              </>
            )}
          </Button>
        )}

        {isDone && (
          <div className="text-center py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <p className="text-green-700 dark:text-green-300 font-bold">Quest Completed! 🎉</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
