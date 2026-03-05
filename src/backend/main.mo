import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  let approvalState = UserApproval.initState(accessControlState);

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // App-specific types and implementation

  type FullName = Text;
  type FreeFireUID = Text;
  type InGameName = Text;
  type CoinBalance = Nat;
  type Status = { #pending; #approved; #banned };
  type Role = { #user; #admin };
  type TransactionId = Nat;
  type UserId = Principal;
  type ActionType = { #deposit; #withdrawal; #entryFee; #prize; #bonus; #penalty; #adminAdjustment };
  type Amount = Int;
  type Reason = Text;
  type Timestamp = Time.Time;
  type TournamentId = Nat;
  type TournamentStatus = { #upcoming; #live; #completed };
  type MatchType = { #solo; #duo; #squad };
  type RoomId = ?Text;
  type RoomPassword = ?Text;
  type RoomVisible = Bool;
  type PaymentRequestStatus = { #pending; #approved; #rejected };
  type WithdrawalRequestStatus = { #pending; #approved; #rejected; #completed };
  type UTRNumber = Text;
  type MapName = Text;

  type UserProfile = {
    fullName : FullName;
    freeFireUID : FreeFireUID;
    inGameName : InGameName;
    coinBalance : CoinBalance;
    status : Status;
    role : Role;
    createdAt : Timestamp;
  };

  type Transaction = {
    id : TransactionId;
    userId : Principal;
    actionType : ActionType;
    amount : Amount;
    reason : Text;
    timestamp : Timestamp;
  };

  type Tournament = {
    id : TournamentId;
    name : Text;
    matchType : MatchType;
    entryFee : Nat;
    prizePool : Nat;
    dateTime : Time.Time;
    maxPlayers : Nat;
    mapName : MapName;
    status : TournamentStatus;
    roomId : RoomId;
    roomPassword : RoomPassword;
    roomVisible : Bool;
    joinedUserIds : [Principal];
    createdAt : Timestamp;
  };

  type PaymentRequest = {
    id : Nat;
    userId : Principal;
    utrNumber : Text;
    amountPaid : Nat;
    status : PaymentRequestStatus;
    submittedAt : Time.Time;
    reviewedAt : ?Time.Time;
  };

  type WithdrawalRequest = {
    id : Nat;
    userId : Principal;
    amountCoins : Nat;
    upiId : Text;
    status : WithdrawalRequestStatus;
    requestedAt : Time.Time;
    reviewedAt : ?Time.Time;
  };

  type PlatformSettings = {
    upiId : Text;
    totalCommissionEarned : Nat;
  };

  type PaymentRequestWithUser = {
    request : PaymentRequest;
    userProfile : UserProfile;
  };

  type WithdrawalRequestWithUser = {
    request : WithdrawalRequest;
    userProfile : UserProfile;
  };

  type ProfitSummary = {
    totalEntryFees : Nat;
    totalPrizesDistributed : Nat;
    totalCommission : Nat;
  };

  let userProfiles = Map.empty<UserId, UserProfile>();
  let transactions = Map.empty<TransactionId, Transaction>();
  let tournaments = Map.empty<TournamentId, Tournament>();
  let paymentRequests = Map.empty<Nat, PaymentRequest>();
  let withdrawalRequests = Map.empty<Nat, WithdrawalRequest>();
  let utrNumbers = Set.empty<UTRNumber>();

  var nextTransactionId : Nat = 1;
  var nextTournamentId : Nat = 1;
  var nextPaymentRequestId : Nat = 1;
  var nextWithdrawalRequestId : Nat = 1;
  var platformUpiId : Text = "admin@upi";
  var totalCommissionEarned : Nat = 0;

  // Helper functions
  func isUserApproved(userId : Principal) : Bool {
    switch (userProfiles.get(userId)) {
      case (null) { false };
      case (?profile) { profile.status == #approved };
    };
  };

  func isUserBanned(userId : Principal) : Bool {
    switch (userProfiles.get(userId)) {
      case (null) { false };
      case (?profile) { profile.status == #banned };
    };
  };

  func hasJoinedTournament(tournamentId : TournamentId, userId : Principal) : Bool {
    switch (tournaments.get(tournamentId)) {
      case (null) { false };
      case (?tournament) {
        tournament.joinedUserIds.find<Principal>(func(id) { Principal.equal(id, userId) }) != null;
      };
    };
  };

  func addTransaction(userId : Principal, actionType : ActionType, amount : Amount, reason : Text) : () {
    let transaction : Transaction = {
      id = nextTransactionId;
      userId;
      actionType;
      amount;
      reason;
      timestamp = Time.now();
    };
    transactions.add(nextTransactionId, transaction);
    nextTransactionId += 1;
  };

  // App-specific functions (same as before)
};
