# LocalBiz Directory

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- **Business Listings**: Public directory of verified local businesses with name, description, category, address, phone, website, hours, photos
- **Category-Based Search**: Filter businesses by category (Shops, Restaurants, Services, Health, Professionals, etc.) and keyword search
- **Map Integration**: Visual map placeholder showing business location markers (static/embedded via HTML iframe for ICP compatibility)
- **Customer Reviews & Ratings**: Authenticated users can leave star ratings (1-5) and text reviews per business; aggregate rating displayed
- **Real-Time Contact Details**: Business contact info (phone, email, address, website) always visible on listing pages
- **Business Registration**: Vendors submit registration requests with full details; status is pending until admin approves
- **Admin Panel**: Protected admin area for approving/rejecting business registrations, managing listings, viewing analytics
- **Analytics Dashboard**: Admin view showing total businesses, pending approvals, total reviews, top-rated businesses, category distribution
- **Promotional Listings**: Admins can mark businesses as "Featured" for top-of-page visibility
- **Subscription Tiers**: Businesses have a plan tier (Free, Basic, Premium) controlling visibility and features; admins can assign tiers

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan

**Backend (Motoko)**
1. Data types: Business (id, name, description, category, address, phone, email, website, hours, ownerId, status: pending/approved/rejected, isFeatured, tier: Free/Basic/Premium, createdAt), Review (id, businessId, userId, rating, comment, createdAt), User role (admin or user)
2. Business CRUD: submitBusiness, getApprovedBusinesses, getBusinessById, searchBusinesses (by keyword + category), getFeaturedBusinesses
3. Admin functions: getPendingBusinesses, approveBusiness, rejectBusiness, setFeatured, setTier, getAllBusinesses
4. Review functions: addReview, getReviewsForBusiness, getAverageRating
5. Analytics: getAnalytics (counts, top rated, category breakdown)
6. Authorization: admin role check on admin functions

**Frontend (React + TypeScript)**
1. Public Homepage: Hero search bar, category filter chips, featured listings carousel, all listings grid
2. Business Detail Page: Full info, contact details, map embed, reviews list, add review form
3. Business Registration Form: Multi-field form for vendor submission
4. Admin Panel (protected):
   - Pending approvals tab with approve/reject actions
   - All businesses management tab (set featured, set tier)
   - Analytics dashboard with stat cards and category breakdown
5. Auth integration: login/logout, role-based UI
6. Responsive layout with header navigation
