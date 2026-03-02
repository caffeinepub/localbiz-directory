import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data types
  type Status = { #pending; #approved; #rejected };
  type Tier = { #free; #basic; #premium };
  type CategoryCount = { category : Text; count : Nat };

  public type Business = {
    id : Text;
    name : Text;
    description : Text;
    category : Text;
    address : Text;
    phone : Text;
    email : Text;
    website : Text;
    hours : Text;
    ownerId : Principal;
    status : Status;
    isFeatured : Bool;
    tier : Tier;
    createdAt : Int;
  };

  public type Review = {
    id : Text;
    businessId : Text;
    userId : Principal;
    rating : Nat;
    comment : Text;
    createdAt : Int;
  };

  // Data stores
  let businesses = Map.empty<Text, Business>();
  let reviews = Map.empty<Text, Review>();
  let reviewedBusinesses = Map.empty<Principal, Set.Set<Text>>();

  module Business {
    public func compareByLatest(b1 : Business, b2 : Business) : Order.Order {
      Int.compare(b2.createdAt, b1.createdAt);
    };

    public func compareByOldest(b1 : Business, b2 : Business) : Order.Order {
      Int.compare(b1.createdAt, b2.createdAt);
    };
  };

  module Review {
    public func compareByLatest(r1 : Review, r2 : Review) : Order.Order {
      Int.compare(r2.createdAt, r1.createdAt);
    };

    public func compareByOldest(r1 : Review, r2 : Review) : Order.Order {
      Int.compare(r1.createdAt, r2.createdAt);
    };
  };

  public type BusinessInput = {
    id : Text;
    name : Text;
    description : Text;
    category : Text;
    address : Text;
    phone : Text;
    email : Text;
    website : Text;
    hours : Text;
  };

  public type ReviewInput = {
    id : Text;
    businessId : Text;
    rating : Nat;
    comment : Text;
  };

  public type Analytics = {
    totalBusinesses : Nat;
    pendingCount : Nat;
    approvedCount : Nat;
    totalReviews : Nat;
    categoryCounts : [CategoryCount];
  };

  // Business Operations
  public shared ({ caller }) func submitBusiness(input : BusinessInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit businesses");
    };

    let business : Business = {
      input with ownerId = caller;
      status = #pending;
      isFeatured = false;
      tier = #free;
      createdAt = Time.now();
    };
    businesses.add(input.id, business);
  };

  public query func getApprovedBusinesses() : async [Business] {
    businesses.values().toArray().filter(
      func(b) { b.status == #approved }
    );
  };

  public query ({ caller }) func getBusinessById(id : Text) : async ?Business {
    switch (businesses.get(id)) {
      case (null) { null };
      case (?b) {
        // Only approved businesses are publicly visible
        // Owners can see their own businesses regardless of status
        // Admins can see all businesses
        if (b.status == #approved or b.ownerId == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?b
        } else {
          null;
        };
      };
    };
  };

  public query func searchBusinesses(keyword : ?Text, category : ?Text) : async [Business] {
    let matched = businesses.values().toList<Business>().filter(
      func(b) {
        let nameMatch = switch (keyword) {
          case (?k) { b.name.toLower().contains(#text(k.toLower())) or b.description.toLower().contains(#text(k.toLower())) };
          case (null) { true };
        };
        let categoryMatch = switch (category) {
          case (?c) { b.category == c };
          case (null) { true };
        };
        b.status == #approved and nameMatch and categoryMatch;
      }
    );
    matched.toArray();
  };

  public query func getFeaturedBusinesses() : async [Business] {
    businesses.values().toArray().filter(
      func(b) { b.status == #approved and b.isFeatured }
    );
  };

  public query ({ caller }) func getMyBusinesses() : async [Business] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their businesses");
    };
    businesses.values().toArray().filter(
      func(b) { b.ownerId == caller }
    );
  };

  // Admin Functions
  public query ({ caller }) func getPendingBusinesses() : async [Business] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get pending businesses");
    };
    businesses.values().toArray().filter(
      func(b) { b.status == #pending }
    );
  };

  public query ({ caller }) func getAllBusinesses() : async [Business] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get all businesses");
    };
    businesses.values().toArray();
  };

  public shared ({ caller }) func approveBusiness(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve businesses");
    };
    switch (businesses.get(id)) {
      case (null) { Runtime.trap("Business not found") };
      case (?b) {
        let updated = { b with status = #approved };
        businesses.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func rejectBusiness(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject businesses");
    };
    switch (businesses.get(id)) {
      case (null) { Runtime.trap("Business not found") };
      case (?b) {
        let updated = { b with status = #rejected };
        businesses.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func setFeatured(id : Text, isFeatured : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set featured status");
    };
    switch (businesses.get(id)) {
      case (null) { Runtime.trap("Business not found") };
      case (?b) {
        let updated = { b with isFeatured };
        businesses.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func setTier(id : Text, tier : Tier) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set tier");
    };
    switch (businesses.get(id)) {
      case (null) { Runtime.trap("Business not found") };
      case (?b) {
        let updated = { b with tier };
        businesses.add(id, updated);
      };
    };
  };

  // Analytics
  public query ({ caller }) func getAnalytics() : async Analytics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get analytics");
    };

    let totalBusinesses = businesses.size();
    let totalReviews = reviews.size();

    let pendingCount = businesses.values().toArray().filter(func(b) { b.status == #pending }).size();
    let approvedCount = businesses.values().toArray().filter(func(b) { b.status == #approved }).size();

    // Calculate category counts efficiently
    let categoryCountsList = List.empty<CategoryCount>();

    for (b in businesses.values()) {
      if (b.status == #approved) {
        let existingIndex = categoryCountsList.toArray().findIndex(
          func(x) { x.category == b.category }
        );
        switch (existingIndex) {
          case (null) {
            categoryCountsList.add({ category = b.category; count = 1 });
          };
          case (?i) {
            let updated = categoryCountsList.toArray();
            let oldCount = updated[i].count;
            let newUpdated = updated.sliceToArray(0, i).concat([{ category = b.category; count = oldCount + 1 }]).concat(updated.sliceToArray(i + 1, updated.size()));
            categoryCountsList.clear();
            categoryCountsList.addAll(newUpdated.values());
          };
        };
      };
    };

    let categoryCountsArray = categoryCountsList.toArray();

    {
      totalBusinesses;
      pendingCount;
      approvedCount;
      totalReviews;
      categoryCounts = categoryCountsArray;
    };
  };

  // Review Functions
  public shared ({ caller }) func addReview(input : ReviewInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };

    // Validate business exists and is approved
    switch (businesses.get(input.businessId)) {
      case (null) { Runtime.trap("Business not found") };
      case (?b) {
        if (b.status != #approved) {
          Runtime.trap("Cannot review unapproved business");
        };
      };
    };

    // Validate rating range (1-5)
    if (input.rating < 1 or input.rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    // Check for duplicate review
    let userReviewed = switch (reviewedBusinesses.get(caller)) {
      case (null) {
        let newSet = Set.fromArray<Text>([]);
        reviewedBusinesses.add(caller, newSet);
        newSet;
      };
      case (?set) { set };
    };

    if (userReviewed.contains(input.businessId)) {
      Runtime.trap("Review already exists for this business by the user");
    };

    let review : Review = {
      input with
      userId = caller;
      createdAt = Time.now();
    };
    reviews.add(input.id, review);
    userReviewed.add(input.businessId);
  };

  public query func getReviewsForBusiness(businessId : Text) : async [Review] {
    reviews.values().toArray().filter(
      func(r) { r.businessId == businessId }
    );
  };

  public query func getAverageRating(businessId : Text) : async Float {
    let businessReviews = reviews.values().toArray().filter(
      func(r) { r.businessId == businessId }
    );

    if (businessReviews.isEmpty()) { return 0.0 };

    let total = businessReviews.foldLeft(0, func(acc, r) { acc + r.rating });
    (total.toFloat() / businessReviews.size().toInt().toFloat());
  };
};
