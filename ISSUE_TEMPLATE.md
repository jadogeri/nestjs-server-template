# [Type] Bug Report / Feature Request

## 1. Description
**Current Behavior:** 
<!-- Describe what is happening right now. (e.g., The permissionIds are ignored during PATCH or the Role name doesn't update in SQLite) -->

**Expected Behavior:** 
<!-- Describe what should happen instead. (e.g., The roles_permissions junction table should update with the new IDs) -->

---

## 2. Steps to Reproduce
1. Initialize a new NestJS project with `nest new`.
2. Define a `Role` entity with a `name: string` and a `ManyToMany` relationship to `Permission`.
3. Create an `UpdateRoleDto` using `class-validator` (including `permissionIds: number[]`).
4. Send a `PATCH` request to `/roles/:id` with the following body:
   ```json
   {
     "name": "NEW_ROLE_NAME",
     "permissionIds": [1, 2, 3]
   }
