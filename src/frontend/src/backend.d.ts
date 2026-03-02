import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    id: string;
    businessId: string;
    userId: Principal;
    createdAt: bigint;
    comment: string;
    rating: bigint;
}
export interface Analytics {
    pendingCount: bigint;
    approvedCount: bigint;
    categoryCounts: Array<CategoryCount>;
    totalReviews: bigint;
    totalBusinesses: bigint;
}
export interface Business {
    id: string;
    status: Status;
    hours: string;
    ownerId: Principal;
    name: string;
    createdAt: bigint;
    tier: Tier;
    description: string;
    email: string;
    website: string;
    isFeatured: boolean;
    address: string;
    category: string;
    phone: string;
}
export interface BusinessInput {
    id: string;
    hours: string;
    name: string;
    description: string;
    email: string;
    website: string;
    address: string;
    category: string;
    phone: string;
}
export interface ReviewInput {
    id: string;
    businessId: string;
    comment: string;
    rating: bigint;
}
export interface CategoryCount {
    count: bigint;
    category: string;
}
export enum Status {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum Tier {
    premium = "premium",
    free = "free",
    basic = "basic"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReview(input: ReviewInput): Promise<void>;
    approveBusiness(id: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllBusinesses(): Promise<Array<Business>>;
    getAnalytics(): Promise<Analytics>;
    getApprovedBusinesses(): Promise<Array<Business>>;
    getAverageRating(businessId: string): Promise<number>;
    getBusinessById(id: string): Promise<Business | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedBusinesses(): Promise<Array<Business>>;
    getMyBusinesses(): Promise<Array<Business>>;
    getPendingBusinesses(): Promise<Array<Business>>;
    getReviewsForBusiness(businessId: string): Promise<Array<Review>>;
    isCallerAdmin(): Promise<boolean>;
    rejectBusiness(id: string): Promise<void>;
    searchBusinesses(keyword: string | null, category: string | null): Promise<Array<Business>>;
    setFeatured(id: string, isFeatured: boolean): Promise<void>;
    setTier(id: string, tier: Tier): Promise<void>;
    submitBusiness(input: BusinessInput): Promise<void>;
}
