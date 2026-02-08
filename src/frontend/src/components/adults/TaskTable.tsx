import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Task, TaskStatus } from '../../backend';

interface TaskTableProps {
  tasks: Task[];
}

export default function TaskTable({ tasks }: TaskTableProps) {
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.todo:
        return <Badge variant="outline">To Do</Badge>;
      case TaskStatus.inProgress:
        return <Badge variant="secondary">In Progress</Badge>;
      case TaskStatus.done:
        return <Badge variant="default">Done</Badge>;
      default:
        return null;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks yet. Create your first task to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id.toString()}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell className="max-w-xs truncate">{task.description}</TableCell>
            <TableCell>{task.points.toString()}</TableCell>
            <TableCell>{getStatusBadge(task.status)}</TableCell>
            <TableCell>{task.assignedTo ? `User ${task.assignedTo.toString()}` : 'Unassigned'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
