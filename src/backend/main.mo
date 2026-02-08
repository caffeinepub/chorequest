import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type AgeBracket = { #ages4To8; #ages9To12; #ages13To17; #adult };
  type UserRole = AccessControl.UserRole;

  public type UserProfile = {
    id : Nat;
    name : Text;
    avatarId : Text;
    ageBracket : AgeBracket;
    worldTheme : Text;
    points : Nat;
    role : UserRole;
  };

  type TaskStatus = { #todo; #inProgress; #done };
  type ChoreType = { #cleaning; #outdoor; #homework; #misc };
  type RewardType = { #points; #money; #gems };
  type AdultTaskStatus = { #todo; #active; #done };

  type Task = {
    id : Nat;
    title : Text;
    description : Text;
    choreType : ChoreType;
    points : Nat;
    status : TaskStatus;
    assignedTo : ?Nat;
  };

  type AdultTask = {
    id : Nat;
    title : Text;
    status : AdultTaskStatus;
    assignedTo : ?Nat;
  };

  type Reward = {
    id : Nat;
    name : Text;
    cost : Nat;
    rewardType : RewardType;
    isAvailable : Bool;
  };

  type QuestBrief = {
    id : Nat;
    missionText : Text;
    tips : [Text];
    encouragement : Text;
  };

  type QuestCacheKey = (Text, Nat, AgeBracket, Text);

  type WorldTheme = {
    name : Text;
    sceneStyling : Text;
  };

  type SystemSettings = {
    theme : Text;
    rewardSystem : RewardType;
  };

  type RewardHistoryEntry = {
    rewardId : Nat;
    redeemedBy : Nat;
    actionType : { #questCompleted; #rewardBought };
  };

  // State
  let profiles = Map.empty<Principal, UserProfile>();
  var nextProfileId = 1 : Nat;
  var nextTaskId = 1 : Nat;
  var nextRewardId = 1 : Nat;
  var hasAdmin = false;

  let tasks = Map.empty<Nat, Task>();
  let adultTasks = Map.empty<Nat, AdultTask>();
  let rewards = Map.empty<Nat, Reward>();
  let questCache = Map.empty<QuestCacheKey, (QuestBrief, Int)>();
  var rewardHistory = List.empty<RewardHistoryEntry>();
  var systemSettings : ?SystemSettings = null;

  let worldThemes = [
    { name = "Fantasy"; sceneStyling = "sparkly" },
    { name = "Space"; sceneStyling = "galactic" },
    { name = "Ocean"; sceneStyling = "waves" },
    { name = "Jungle"; sceneStyling = "lush" },
  ];

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      Nat.compare(b.points, a.points);
    };
  };

  module Task {
    public func compareByPoints(a : Task, b : Task) : Order.Order {
      Nat.compare(b.points, a.points);
    };
  };

  module Reward {
    public func compareByCost(a : Reward, b : Reward) : Order.Order {
      Nat.compare(a.cost, b.cost);
    };
  };

  module RewardHistoryEntry {
    public func compareByRewardId(a : RewardHistoryEntry, b : RewardHistoryEntry) : Order.Order {
      Nat.compare(a.rewardId, b.rewardId);
    };
  };

  module QuestCacheKey {
    public func compare(a : QuestCacheKey, b : QuestCacheKey) : Order.Order {
      switch (Text.compare(a.0, b.0)) {
        case (#equal) {
          switch (Nat.compare(a.1, b.1)) {
            case (#equal) {
              switch (a.2, b.2) {
                case (#ages4To8, #ages4To8) { #equal };
                case (#ages4To8, _) { #less };
                case (#ages9To12, #ages4To8) { #greater };
                case (#ages9To12, #ages9To12) { #equal };
                case (#ages9To12, _) { #less };
                case (#ages13To17, #adult) { #less };
                case (#ages13To17, #ages13To17) { #equal };
                case (#ages13To17, _) { #greater };
                case (#adult, #adult) { #equal };
                case (#adult, _) { #greater };
              };
            };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  // Required profile functions for frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  // User Registration and Profile Management
  public shared ({ caller }) func registerProfile(name : Text, role : UserRole, avatarId : Text, ageBracket : AgeBracket, worldTheme : Text) : async Nat {
    // Require authenticated user (not anonymous)
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous users cannot register profiles");
    };

    if (profiles.containsKey(caller)) {
      Runtime.trap("Profile already exists");
    };

    let id = nextProfileId;
    nextProfileId += 1;

    // First user becomes admin automatically
    let effectiveRole = if (not hasAdmin) {
      hasAdmin := true;
      #admin;
    } else {
      role;
    };

    let profile : UserProfile = {
      id;
      name;
      avatarId;
      ageBracket;
      worldTheme;
      points = 0;
      role = effectiveRole;
    };

    profiles.add(caller, profile);

    // Sync role with access control system
    if (effectiveRole == #admin) {
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
    } else if (effectiveRole == #user) {
      AccessControl.assignRole(accessControlState, caller, caller, #user);
    };

    id;
  };

  // New backend-only flow: Assign admin role to existing profile if no admin existed before
  public shared ({ caller }) func becomeFirstAdmin() : async () {
    // Require authenticated user (not anonymous)
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous users cannot become admin");
    };

    if (hasAdmin) {
      Runtime.trap("Admin already exists");
    };

    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };

    let adminProfile : UserProfile = {
      id = profile.id;
      name = profile.name;
      avatarId = profile.avatarId;
      ageBracket = profile.ageBracket;
      worldTheme = profile.worldTheme;
      points = profile.points;
      role = #admin;
    };

    profiles.add(caller, adminProfile);
    hasAdmin := true;

    // Sync role with access control system
    AccessControl.assignRole(accessControlState, caller, caller, #admin);
  };

  public query ({ caller }) func getProfile(user : Principal) : async UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or admin can view all");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getCallerProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    getProfileByCaller(caller);
  };

  // Task Management (Admin-only creation, user claiming/completion)
  public shared ({ caller }) func createTask(title : Text, description : Text, choreType : ChoreType, points : Nat) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create tasks");
    };
    let id = nextTaskId;
    nextTaskId += 1;

    let task : Task = {
      id;
      title;
      description;
      choreType;
      points;
      status = #todo;
      assignedTo = null;
    };
    tasks.add(id, task);
    id;
  };

  public shared ({ caller }) func claimTask(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim tasks");
    };

    let profile = getProfileByCaller(caller);
    let task = switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) { task };
    };

    if (task.status != #todo) {
      Runtime.trap("Task is not available for claiming");
    };

    let updatedTask : Task = {
      id = task.id;
      title = task.title;
      description = task.description;
      choreType = task.choreType;
      points = task.points;
      status = #inProgress;
      assignedTo = ?profile.id;
    };

    tasks.add(taskId, updatedTask);
  };

  public shared ({ caller }) func completeTask(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete tasks");
    };

    let profile = getProfileByCaller(caller);
    let task = switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) { task };
    };

    if (task.assignedTo != ?profile.id) {
      Runtime.trap("Unauthorized: Task not assigned to you");
    };

    if (task.status == #done) {
      Runtime.trap("Task already completed");
    };

    let updatedTask : Task = {
      id = task.id;
      title = task.title;
      description = task.description;
      choreType = task.choreType;
      points = task.points;
      status = #done;
      assignedTo = task.assignedTo;
    };
    tasks.add(taskId, updatedTask);

    let updatedProfile : UserProfile = {
      id = profile.id;
      name = profile.name;
      avatarId = profile.avatarId;
      ageBracket = profile.ageBracket;
      worldTheme = profile.worldTheme;
      points = profile.points + task.points;
      role = profile.role;
    };
    profiles.add(caller, updatedProfile);

    let historyEntry : RewardHistoryEntry = {
      rewardId = task.id;
      redeemedBy = profile.id;
      actionType = #questCompleted;
    };
    rewardHistory.add(historyEntry);
  };

  // Reward Store (Admin creates, users redeem)
  public shared ({ caller }) func createReward(name : Text, cost : Nat, rewardType : RewardType) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create rewards");
    };
    let id = nextRewardId;
    nextRewardId += 1;

    let reward : Reward = {
      id;
      name;
      cost;
      rewardType;
      isAvailable = true;
    };

    rewards.add(id, reward);
    id;
  };

  public shared ({ caller }) func redeemReward(rewardId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can redeem rewards");
    };

    let profile = getProfileByCaller(caller);
    let reward = switch (rewards.get(rewardId)) {
      case (null) { Runtime.trap("Reward not found") };
      case (?reward) { reward };
    };

    if (not reward.isAvailable) {
      Runtime.trap("Reward is not available");
    };

    if (profile.points < reward.cost) {
      Runtime.trap("Insufficient points");
    };

    let updatedProfile : UserProfile = {
      id = profile.id;
      name = profile.name;
      avatarId = profile.avatarId;
      ageBracket = profile.ageBracket;
      worldTheme = profile.worldTheme;
      points = profile.points - reward.cost;
      role = profile.role;
    };
    profiles.add(caller, updatedProfile);

    let historyEntry : RewardHistoryEntry = {
      rewardId = reward.id;
      redeemedBy = profile.id;
      actionType = #rewardBought;
    };
    rewardHistory.add(historyEntry);
  };

  public query ({ caller }) func getAvailableRewards() : async [Reward] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view rewards");
    };
    rewards.values().toArray().sort(Reward.compareByCost);
  };

  // Quest Generation (authenticated users only)
  public shared ({ caller }) func generateQuest(questType : Text, taskId : Nat, ageBracket : AgeBracket, theme : Text) : async QuestBrief {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate quests");
    };

    let cacheKey : QuestCacheKey = (questType, taskId, ageBracket, theme);

    switch (questCache.get(cacheKey)) {
      case (?(cachedQuest, timestamp)) {
        let currentTime = Time.now();
        let dayMillis = 24 * 60 * 60 * 1000 * 1000 * 1000;
        if (currentTime - timestamp < dayMillis) {
          return cachedQuest;
        };
      };
      case (null) {};
    };

    let missionText = "Your mission: Quest of type " # questType # " for task " # taskId.toText() # " in theme " # theme;
    let tips = ["Stay focused", "Keep going", "Don't give up"];
    let encouragement = "You are amazing!";

    let quest : QuestBrief = {
      id = taskId;
      missionText;
      tips;
      encouragement;
    };

    questCache.add(cacheKey, (quest, Time.now()));
    quest;
  };

  // Leaderboard and Profile Queries (authenticated users only)
  public query ({ caller }) func getAllProfiles() : async [UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    profiles.values().toArray().sort();
  };

  public query ({ caller }) func getLeaderBoard() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view leaderboard");
    };
    profiles.values().toArray().sort();
  };

  // Task Queries
  public query ({ caller }) func getTasks(callerProfileId : Nat) : async [Task] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all tasks");
    };
    tasks.values().toArray().sort(Task.compareByPoints);
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.values().toArray().sort(Task.compareByPoints);
  };

  // World Themes (public, no auth needed - used during onboarding)
  public query func getAvailableWorldThemes() : async [WorldTheme] {
    worldThemes;
  };

  // Reward History (user can view their own, admin can view all)
  public query ({ caller }) func getRewardHistory(callerProfileId : Nat) : async [RewardHistoryEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reward history");
    };

    let profile = getProfileByCaller(caller);

    if (profile.id != callerProfileId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reward history");
    };

    let filteredHistory = rewardHistory.filter(
      func(entry : RewardHistoryEntry) : Bool {
        entry.redeemedBy == callerProfileId;
      },
    );
    filteredHistory.toArray().sort(RewardHistoryEntry.compareByRewardId);
  };

  // System Settings (Admin-only)
  public shared ({ caller }) func setSystemSettings(settings : SystemSettings) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set system settings");
    };
    systemSettings := ?settings;
  };

  public query ({ caller }) func getSystemSettings() : async ?SystemSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view system settings");
    };
    systemSettings;
  };

  // Internal Helpers
  func getProfileByCaller(caller : Principal) : UserProfile {
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };
};
