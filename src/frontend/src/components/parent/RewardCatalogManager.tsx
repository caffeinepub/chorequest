import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useGetAvailableRewards, useCreateReward } from '../../hooks/useQueries';
import { RewardType } from '../../backend';

export default function RewardCatalogManager() {
  const { data: rewards } = useGetAvailableRewards();
  const createReward = useCreateReward();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('10');
  const [rewardType, setRewardType] = useState<RewardType>(RewardType.points);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      await createReward.mutateAsync({
        name: name.trim(),
        cost: BigInt(cost),
        rewardType,
      });
      setName('');
      setCost('10');
      setRewardType(RewardType.points);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create reward:', error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reward Catalog</CardTitle>
              <CardDescription>Manage available rewards for your family</CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Reward
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rewards && rewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <div key={reward.id.toString()} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{reward.name}</h3>
                  <p className="text-sm text-muted-foreground">Cost: {reward.cost.toString()} {reward.rewardType}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {reward.isAvailable ? 'Available' : 'Unavailable'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No rewards yet. Create your first reward to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Reward</DialogTitle>
            <DialogDescription>Add a new reward to the catalog</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reward-name">Reward Name</Label>
              <Input
                id="reward-name"
                placeholder="e.g., Extra Screen Time"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reward-cost">Cost</Label>
                <Input
                  id="reward-cost"
                  type="number"
                  min="1"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reward-type">Type</Label>
                <Select value={rewardType} onValueChange={(value) => setRewardType(value as RewardType)}>
                  <SelectTrigger id="reward-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RewardType.points}>Points</SelectItem>
                    <SelectItem value={RewardType.money}>Money</SelectItem>
                    <SelectItem value={RewardType.gems}>Gems</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createReward.isPending || !name.trim()}>
              Create Reward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
