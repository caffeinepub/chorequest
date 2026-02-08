import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SystemSettings {
    theme: string;
    rewardSystem: RewardType;
}
export interface Reward {
    id: bigint;
    cost: bigint;
    name: string;
    isAvailable: boolean;
    rewardType: RewardType;
}
export interface QuestBrief {
    id: bigint;
    missionText: string;
    encouragement: string;
    tips: Array<string>;
}
export interface Task {
    id: bigint;
    status: TaskStatus;
    title: string;
    assignedTo?: bigint;
    description: string;
    choreType: ChoreType;
    points: bigint;
}
export interface WorldTheme {
    sceneStyling: string;
    name: string;
}
export interface RewardHistoryEntry {
    redeemedBy: bigint;
    actionType: Variant_questCompleted_rewardBought;
    rewardId: bigint;
}
export interface UserProfile {
    id: bigint;
    name: string;
    role: UserRole;
    worldTheme: string;
    avatarId: string;
    ageBracket: AgeBracket;
    points: bigint;
}
export enum AgeBracket {
    adult = "adult",
    ages4To8 = "ages4To8",
    ages13To17 = "ages13To17",
    ages9To12 = "ages9To12"
}
export enum ChoreType {
    cleaning = "cleaning",
    misc = "misc",
    homework = "homework",
    outdoor = "outdoor"
}
export enum RewardType {
    money = "money",
    gems = "gems",
    points = "points"
}
export enum TaskStatus {
    done = "done",
    todo = "todo",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_questCompleted_rewardBought {
    questCompleted = "questCompleted",
    rewardBought = "rewardBought"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    becomeFirstAdmin(): Promise<void>;
    claimTask(taskId: bigint): Promise<void>;
    completeTask(taskId: bigint): Promise<void>;
    createReward(name: string, cost: bigint, rewardType: RewardType): Promise<bigint>;
    createTask(title: string, description: string, choreType: ChoreType, points: bigint): Promise<bigint>;
    generateQuest(questType: string, taskId: bigint, ageBracket: AgeBracket, theme: string): Promise<QuestBrief>;
    getAllProfiles(): Promise<Array<UserProfile>>;
    getAllTasks(): Promise<Array<Task>>;
    getAvailableRewards(): Promise<Array<Reward>>;
    getAvailableWorldThemes(): Promise<Array<WorldTheme>>;
    getCallerProfile(): Promise<UserProfile>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderBoard(): Promise<Array<UserProfile>>;
    getProfile(user: Principal): Promise<UserProfile>;
    getRewardHistory(callerProfileId: bigint): Promise<Array<RewardHistoryEntry>>;
    getSystemSettings(): Promise<SystemSettings | null>;
    getTasks(callerProfileId: bigint): Promise<Array<Task>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    redeemReward(rewardId: bigint): Promise<void>;
    registerProfile(name: string, role: UserRole, avatarId: string, ageBracket: AgeBracket, worldTheme: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setSystemSettings(settings: SystemSettings): Promise<void>;
}
