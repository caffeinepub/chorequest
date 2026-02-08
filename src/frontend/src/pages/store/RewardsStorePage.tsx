import { useGetAvailableRewards, useGetCallerUserProfile, useRedeemReward } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Gift } from 'lucide-react';
import { useMode } from '../../context/ModeContext';
import RewardCard from '../../components/store/RewardCard';

export default function RewardsStorePage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: rewards, isLoading: rewardsLoading } = useGetAvailableRewards();
  const redeemReward = useRedeemReward();
  const { isKidsMode } = useMode();

  if (profileLoading || rewardsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className={`${isKidsMode ? 'w-12 h-12' : 'w-8 h-8'} animate-spin text-amber-500`} />
      </div>
    );
  }

  const handleRedeem = (rewardId: bigint) => {
    redeemReward.mutate(rewardId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className={`${isKidsMode ? 'text-4xl' : 'text-3xl'} font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent`}>
          {isKidsMode ? '🏪 Treasure Shop' : 'Rewards Store'}
        </h1>
        <p className={`${isKidsMode ? 'text-xl' : 'text-lg'} text-muted-foreground`}>
          Redeem your hard-earned points for amazing rewards!
        </p>
      </div>

      <Card className={isKidsMode ? 'border-2 border-amber-300' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Your Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${isKidsMode ? 'text-4xl' : 'text-3xl'} font-bold text-amber-600`}>
            {profile?.points.toString() || 0} Points
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className={`${isKidsMode ? 'text-3xl' : 'text-2xl'} font-bold mb-4`}>
          {isKidsMode ? '🎁 Available Treasures' : 'Available Rewards'}
        </h2>
        {rewards && rewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <RewardCard
                key={reward.id.toString()}
                reward={reward}
                userPoints={profile?.points || BigInt(0)}
                onRedeem={handleRedeem}
                isKidsMode={isKidsMode}
              />
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed">
            <CardContent className="py-12 text-center">
              <Gift className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                No rewards available yet. Ask your parent to add some!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
