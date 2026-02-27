-- SUPER USER
INSERT INTO "roles" ("name", "description")
SELECT 'SUPER_USER', 'Administrator with full system access'
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'SUPER_USER');


-- ADMIN
INSERT INTO "roles" ("name", "description")
SELECT 'ADMIN', 'Administrator with elevated privileges'
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'ADMIN');

-- USER
INSERT INTO "roles" ("name", "description")
SELECT 'USER', 'Standard registered user'
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'USER');

-- GUEST
INSERT INTO "roles" ("name", "description")
SELECT 'GUEST', 'Unregistered user with limited access'
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'GUEST');

-- EDITOR
INSERT INTO "roles" ("name", "description")
SELECT 'EDITOR', 'Can create and edit content but cannot manage users'
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'EDITOR');

-- VIEWER
INSERT INTO "roles" ("name", "description")
SELECT 'VIEWER', 'Read-only access to the system'
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'VIEWER');

