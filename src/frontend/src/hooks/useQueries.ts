import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Task, Reward, RewardHistoryEntry, WorldTheme, SystemSettings, AgeBracket, ChoreType, RewardType, UserRole } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useRegisterProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; role: UserRole; avatarId: string; ageBracket: AgeBracket; worldTheme: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerProfile(params.name, params.role, params.avatarId, params.ageBracket, params.worldTheme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
  });
}

export function useGetAllTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClaimTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.claimTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Quest accepted! Time to begin your adventure!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to accept quest');
    },
  });
}

export function useCompleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      toast.success('🎉 Quest completed! You earned rewards!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to complete quest');
    },
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { title: string; description: string; choreType: ChoreType; points: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTask(params.title, params.description, params.choreType, params.points);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create task');
    },
  });
}

export function useGetAvailableRewards() {
  const { actor, isFetching } = useActor();

  return useQuery<Reward[]>({
    queryKey: ['rewards'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableRewards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRedeemReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rewardId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.redeemReward(rewardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['rewardHistory'] });
      toast.success('🎁 Reward redeemed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to redeem reward');
    },
  });
}

export function useCreateReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; cost: bigint; rewardType: RewardType }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReward(params.name, params.cost, params.rewardType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Reward created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create reward');
    },
  });
}

export function useGetRewardHistory() {
  const { actor, isFetching } = useActor();
  const { data: profile } = useGetCallerUserProfile();

  return useQuery<RewardHistoryEntry[]>({
    queryKey: ['rewardHistory', profile?.id.toString()],
    queryFn: async () => {
      if (!actor || !profile) return [];
      return actor.getRewardHistory(profile.id);
    },
    enabled: !!actor && !isFetching && !!profile,
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderBoard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWorldThemes() {
  const { actor, isFetching } = useActor();

  return useQuery<WorldTheme[]>({
    queryKey: ['worldThemes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableWorldThemes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSystemSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<SystemSettings | null>({
    queryKey: ['systemSettings'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSystemSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetSystemSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: SystemSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setSystemSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBecomeFirstAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.becomeFirstAdmin();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('🎉 You are now the Parent Admin!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to become admin');
    },
  });
}
