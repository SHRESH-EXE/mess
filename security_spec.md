# Security Specification: Cloud Firestore & Firebase Auth

## 1. Data Invariants
1. **Public Read Integrity**: Public / unauthenticated visitors may ONLY read documents from `/restaurants` where `status == 'active'` and `/foodcourt_items` where `status == 'active' && isAvailable == true`.
2. **Zero Unauthorized Writes**: Unauthenticated clients are rejected on all `create`, `update`, and `delete` operations.
3. **Role Partitioning**:
   - `superadmin`: Full read/write access to `/admins`, `/restaurants`, and `/foodcourt_items`.
   - `restaurant_admin`: Can create, update, delete `/restaurants`, but cannot write to `/foodcourt_items` or modify `/admins`.
   - `foodcourt_admin`: Can create, update, delete `/foodcourt_items`, but cannot write to `/restaurants` or modify `/admins`.
4. **Admins Collection Immutability**: Regular users or unauthorized admins cannot elevate their privileges or create admin records. Only an existing `superadmin` or backend provisioning can write to `/admins/{adminId}`.
5. **Timestamp Temporal Strictness**: `createdAt` and `updatedAt` on writes must match server `request.time`.

## 2. The "Dirty Dozen" Threat Payloads
1. **Unauthenticated Public Write**: Anonymous user attempts `setDoc` on `/restaurants/resto-test` -> **REJECTED (403)**.
2. **FoodCourt Admin Modifying Restaurant**: User with `role: "foodcourt_admin"` attempts `updateDoc` on `/restaurants/resto-1` -> **REJECTED (403)**.
3. **Restaurant Admin Modifying Food Court Item**: User with `role: "restaurant_admin"` attempts `addDoc` on `/foodcourt_items` -> **REJECTED (403)**.
4. **Privilege Escalation**: Normal user attempts `setDoc` on `/admins/{uid}` with `role: "superadmin"` -> **REJECTED (403)**.
5. **Ghost Field / Shadow Injection**: Attacker injects `isHacked: true` into a restaurant doc -> **REJECTED (403)**.
6. **Malicious Script In XSS Field**: Attacker tries to insert `<script>alert('XSS')</script>` in restaurant address -> **Sanitized & REJECTED**.
7. **Negative or Invalid Price**: Attacker sets `price: -500` or `price: "free"` on a food court item -> **REJECTED (403)**.
8. **Invalid Rating Boundary**: Attacker submits `rating: 999.0` -> **REJECTED (403)**.
9. **Tampering with Immutable `createdAt`**: Admin tries to change past `createdAt` timestamp during update -> **REJECTED (403)**.
10. **Public Scraping of Inactive / Draft Vendors**: Unauthenticated list query attempting to fetch `status == 'inactive'` items -> **REJECTED (403)**.
11. **Document ID Poisoning**: Oversized 2KB document ID with forbidden URL characters -> **REJECTED (403)**.
12. **Orphaned Author ID**: Attacker sets `createdBy` to a different user's UID -> **REJECTED (403)**.
