import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reward } from '../../backend';
import { Gift, Lock } from 'lucide-react';

interface RewardCardProps {
  reward: Reward;
  userPoints: bigint;
  onRedeem: (rewardId: bigint) => void;
  isKidsMode: boolean;
}

export default function RewardCard({ reward, userPoints, onRedeem, isKidsMode }: RewardCardProps) {
  const canAfford = userPoints >= reward.cost;

  return (
    <Card className={`${isKidsMode ? 'border-2' : ''} ${canAfford ? 'border-amber-300' : 'border-gray-300 opacity-75'}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Gift className={`w-8 h-8 ${canAfford ? 'text-amber-500' : 'text-gray-400'}`} />
          <div className={`${isKidsMode ? 'text-2xl' : 'text-xl'} font-bold ${canAfford ? 'text-amber-600' : 'text-gray-500'}`}>
            {reward.cost.toString()}
          </div>
        </div>
        <CardTitle className={isKidsMode ? 'text-xl' : ''}>{reward.name}</CardTitle>
        <CardDescription>
          {reward.rewardType} reward
        </CardDescription>
      </CardHeader>
      <CardContent>
        {canAfford ? (
          <Button
            onClick={() => onRedeem(reward.id)}
            size={isKidsMode ? 'lg' : 'default'}
            className="w-full"
          >
            {isKidsMode ? '🎁 Claim Treasure' : 'Redeem'}
          </Button>
        ) : (
          <Button disabled size={isKidsMode ? 'lg' : 'default'} className="w-full">
            <Lock className="w-4 h-4 mr-2" />
            {isKidsMode ? 'Need More Points' : 'Insufficient Points'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
