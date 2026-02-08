import { useIsCallerAdmin, useBecomeFirstAdmin } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import TaskManager from '../../components/parent/TaskManager';
import RewardCatalogManager from '../../components/parent/RewardCatalogManager';
import ThemeManager from '../../components/parent/ThemeManager';

export default function ParentDashboardPage() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const becomeAdminMutation = useBecomeFirstAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>You don't have permission to access the Parent Dashboard. Only family admins can manage settings.</p>
            <div className="pt-2">
              <Button
                onClick={() => becomeAdminMutation.mutate()}
                disabled={becomeAdminMutation.isPending}
                variant="outline"
                className="bg-background hover:bg-accent"
              >
                {becomeAdminMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Become Parent Admin'
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Click this button if you're the first person setting up ChoreQuest for your family.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-amber-600" />
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">Manage family tasks, rewards, and settings</p>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <TaskManager />
        </TabsContent>

        <TabsContent value="rewards">
          <RewardCatalogManager />
        </TabsContent>

        <TabsContent value="themes">
          <ThemeManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
