import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateTask } from '../../hooks/useQueries';
import { ChoreType } from '../../backend';

interface TaskEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TaskEditorDialog({ open, onOpenChange }: TaskEditorDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('10');
  const [choreType, setChoreType] = useState<ChoreType>(ChoreType.misc);
  const createTask = useCreateTask();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
      await createTask.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        choreType,
        points: BigInt(points),
      });
      setTitle('');
      setDescription('');
      setPoints('10');
      setChoreType(ChoreType.misc);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task for your family</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={choreType} onValueChange={(value) => setChoreType(value as ChoreType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ChoreType.cleaning}>Cleaning</SelectItem>
                  <SelectItem value={ChoreType.outdoor}>Outdoor</SelectItem>
                  <SelectItem value={ChoreType.homework}>Homework</SelectItem>
                  <SelectItem value={ChoreType.misc}>Misc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createTask.isPending || !title.trim() || !description.trim()}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
