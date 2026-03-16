🗄️ Database Design Specification
This document outlines the data architecture for NestJS Enterprise Core v3, moving from abstract business concepts to physical implementation.
------------------------------
1. 🎨 Conceptual Design
Focus: High-level business entities and their relationships.

| Icon | Entity | Description |
|---|---|---|
| 👤 | User | The core identity containing credentials and account status. |
| 📝 | Profile | Personal metadata (Bio, Avatar, Preferences) linked to a User. |
| 🔑 | Session | Represents an active login state and refresh token tracking. |
| 📇 | Contact | Personal contacts or address book entries managed by a User. |
| 🛡️ | Role | A named group of access levels (e.g., SuperAdmin, Editor). |
| 📜 | Permission | Granular access rules (e.g., update:profile, delete:user). |


* Relationship: A User has one Profile, belongs to one Role, and owns many Sessions and Contacts.

------------------------------
2. ⚙️ Logical Design
Focus: Attributes, keys, and relational mapping.
Entity-Relationship Overview

* User Table
* id (PK), email (Unique), password, roleId (FK).
* Profile Table
* id (PK), userId (FK), firstName, lastName, avatarUrl, bio.
* Session Table
* id (PK), userId (FK), refreshToken, deviceFingerprint, expiresAt.
* Contact Table
* id (PK), userId (FK), name, phoneNumber, emailAddress.
* Role Table
* id (PK), name (Unique), description.
* Permission Table
* id (PK), slug (Unique, e.g., user:read), description.

------------------------------
3. 🏗️ Physical Design
Focus: Database implementation details (PostgreSQL/TypeORM).
Database Schema (PostgreSQL)

| Field | Data Type | Constraints | Optimization |
|---|---|---|---|
| user.email | VARCHAR(255) | UNIQUE, NOT NULL | B-Tree Index |
| profile.bio | TEXT | NULLABLE | - |
| session.expires_at | TIMESTAMP | NOT NULL | TTL Index / Cron Cleanup |
| contact.phone | VARCHAR(20) | INDEXED | Partial Index |
| role_permissions | JOIN TABLE | PK(roleId, permId) | Composite Index |

Integrity & Performance

* 🚀 Cascading: ON DELETE CASCADE applied to Profile, Session, and Contact when a User is removed.
* 🔐 Security: Session tokens are stored as encrypted strings.
* 📁 Separation: Profile is separated from User to optimize the authentication payload (keeping the User table "thin").

------------------------------
4. 📊 Design Artifacts

| Design Level | Asset Link |
|---|---|
| Conceptual | [View Sketch 🎨 ](./docs/database/conceptual/conceptual-design.jpg)|
| Logical | [View ERD ⚙️ ](./docs/database/logical/logical-design.jpg)|
| Physical | [View SQL Migration 🏗️ ](./docs/database/physical/physical_diagram.png)|

------------------------------
Would you like me to generate the One-to-One TypeORM relation code for the User and Profile entities?

![Conceptual Design](./assets/images/conceptual.png)
