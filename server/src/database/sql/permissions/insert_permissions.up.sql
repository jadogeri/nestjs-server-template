-- USER
INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'user', 'create', 'Allows creating new users'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'user' AND "action" = 'create'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'user', 'read', 'Allows viewing user details'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'user' AND "action" = 'read'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'user', 'update', 'Allows editing user info'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'user' AND "action" = 'update'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'user', 'delete', 'Allows removing users'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'user' AND "action" = 'delete'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'user', 'manage', 'Allows full access to user management'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'user' AND "action" = 'manage'
);

-- ROLE

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'role', 'create', 'Allows creating roles'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'role' AND "action" = 'create'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'role', 'read', 'Allows viewing roles'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'role' AND "action" = 'read'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'role', 'update', 'Allows editing roles'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'role' AND "action" = 'update'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'role', 'delete', 'Allows deleting roles'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'role' AND "action" = 'delete'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'role', 'manage', 'Allows managing roles'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'role' AND "action" = 'manage'
);

-- CONTACT
INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'contact', 'create', 'Allows creating contacts'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'contact' AND "action" = 'create');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'contact', 'read', 'Allows viewing contacts'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'contact' AND "action" = 'read');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'contact', 'update', 'Allows editing contacts'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'contact' AND "action" = 'update');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'contact', 'delete', 'Allows deleting contacts'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'contact' AND "action" = 'delete');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'contact', 'manage', 'Allows managing contacts'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'contact' AND "action" = 'manage');

-- ADMIN
INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'admin', 'create', 'Allows creating admin configurations'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'admin' AND "action" = 'create');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'admin', 'read', 'Allows reading admin logs/settings'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'admin' AND "action" = 'read');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'admin', 'update', 'Allows updating admin settings'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'admin' AND "action" = 'update');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'admin', 'delete', 'Allows deleting admin resources'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'admin' AND "action" = 'delete');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'admin', 'manage', 'Allows managing admin resources'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'admin' AND "action" = 'manage');

-- AUTH
INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'auth', 'create', 'Allows creating auth tokens/sessions'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'auth' AND "action" = 'create');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'auth', 'read', 'Allows reading session data'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'auth' AND "action" = 'read');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'auth', 'update', 'Allows updating credentials'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'auth' AND "action" = 'update');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'auth', 'delete', 'Allows revoking access/logging out'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'auth' AND "action" = 'delete');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'auth', 'manage', 'Allows full access to authentication management'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'auth' AND "action" = 'manage');

-- PROFILE
INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'profile', 'create', 'Allows profile creation'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'profile' AND "action" = 'create');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'profile', 'read', 'Allows viewing profiles'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'profile' AND "action" = 'read');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'profile', 'update', 'Allows updating profiles'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'profile' AND "action" = 'update');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'profile', 'delete', 'Allows deleting profiles'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'profile' AND "action" = 'delete');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'profile', 'manage', 'Allows managing profiles'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'profile' AND "action" = 'manage');

-- PERMISSIONS
INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'permission', 'create', 'Allows creating new permission entries'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'permission' AND "action" = 'create');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'permission', 'read', 'Allows viewing available permissions'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'permission' AND "action" = 'read');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'permission', 'update', 'Allows updating permission metadata'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'permission' AND "action" = 'update');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'permission', 'delete', 'Allows deleting permission entries'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'permission' AND "action" = 'delete');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'permission', 'manage', 'Allows managing permissions'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'permission' AND "action" = 'manage');

-- SESSION
INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'session', 'create', 'Allows session creation'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'session' AND "action" = 'create');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'session', 'read', 'Allows viewing sessions'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'session' AND "action" = 'read');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'session', 'update', 'Allows updating sessions'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'session' AND "action" = 'update');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'session', 'delete', 'Allows deleting sessions'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'session' AND "action" = 'delete');

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'session', 'manage', 'Allows managing sessions'
WHERE NOT EXISTS (SELECT 1 FROM "permissions" WHERE "resource" = 'session' AND "action" = 'manage');

-- FULL ACCESS
INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'all', 'manage', 'Full system access'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'all' AND "action" = 'manage'
);