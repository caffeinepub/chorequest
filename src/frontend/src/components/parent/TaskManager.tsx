import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useGetAllTasks } from '../../hooks/useQueries';
import TaskTable from '../adults/TaskTable';
import TaskEditorDialog from '../adults/TaskEditorDialog';

export default function TaskManager() {
  const { data: tasks } = useGetAllTasks();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Task Management</CardTitle>
            <CardDescription>Create and manage family tasks</CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TaskTable tasks={tasks || []} />
      </CardContent>
      <TaskEditorDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </Card>
  );
}
