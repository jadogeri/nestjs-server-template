# **System Design Document (SDD)**

## **NestJS Enterprise Core v3**

**Version:** 3.0
**Date:** March 15, 2026

---

## Description

A professional NestJS backend template implementing Clean Architecture, built-in Role-Based Access Control (RBAC), and automated documentation. This template is designed to handle complex user profiles, contacts, and secure session management.

## Authors

- [@jadogeri](https://www.github.com/jadogeri)

## Screenshots


| ![Screenshot 1](assets/images/screenshot1.png) | ![screenshot 2](assets/images/screenshot2.png) |
| -------------------------------------------- | -------------------------------------------- |
| *App Dashboard*                              | *API Explorer*                               |

## Table of Contents

<ul>
      <li><a href="#1-introduction">1. Introduction</a>
        <ul>
          <li><a href="#11-purpose">1.1 Purpose</a> </li>
          <li><a href="#12-scope">1.2 Scope</a> </li>
          <li><a href="#13-intended-audience">1.3 Intended Audience</a> </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li><a href="#2-api-reference">2. API Reference</a>
      </li>
    </ul>
    <ul>
      <li><a href="#3-system-architecture">3. System Architecture</a>
        <ul>
          <li><a href="#31-high-level-architecture">3.1 High Level Architecture</a> </li>
          <li><a href="#32-technology-stack">3.2 Technology Stack</a> </li>
          <li><a href="#33-deployment-artifacts">3.3 Deployment Artifacts</a> </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li><a href="#4-data-design">4. Data Design</a>
        <ul>
          <li><a href="#41-data-entities-and-relationships">4.1 Entities and Relationships</a> </li>
          <li><a href="#42-database-design-artifacts">4.2 Database Design Artifacts</a> </li>
        </ul>
      </li>
    </ul> 
    <ul>
      <li><a href="#5-installation">5. Installation</a>
      </li>
    </ul> 
    <ul>
        <li><a href="#6-usage">6. Usage</a>
        <ul>
            <li><a href="#61-run-application">6.1 Run Application</a> </li>
            <ul>
              <li><a href="#611-run-locally">6.1.1 Run Locally</a> </li>
              <li><a href="#612-run-docker-container">6.1.2 Run Docker Container</a> </li>
            </ul>
        </ul>
        </li>
    </ul> 
    <ul>
        <li><a href="#7-api-testing">7. API Testing</a>
        </li>
    </ul> 
    <ul>
        <li><a href="#8-tests">8. Tests</a>
        </li>
    </ul>  
    <ul>  
        <li><a href="#9-license">9. License</a>
        </li>
    </ul> 
    <ul> 
        <li><a href="#10-references">10. References</a>
        </li>
    </ul>

---

## **1. Introduction**

### **1.1 Purpose**

This document outlines the system architecture and design considerations for the NestJS Enterprise Core. It provides a standardized template for handling CRUD, Auth, and RBAC.

### **1.2 Scope**

The system allows users to:
- Create and manage secure accounts.
- Handle Profile and Contact management.
- Manage Sessions and Permissions via Roles.

### **1.3 Intended Audience**

- Backend developers and system architects.

---

## **2. API Reference**

* [Link to Documentation ](https://documenter.getpostman.com/view/40822092/2sB3QRoSr6)

---

## **3. System Architecture**

### **3.1 High-Level Architecture**

The system follows a **Modular Architecture**:
1. **Controller Layer**: Handles HTTP requests and DTO validation.
2. **Service Layer**: Core business logic and domain services.
3. **Repository Layer**: Data persistence using TypeORM/Prisma.

### **3.2 Technology Stack**

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL / MongoDB
- **ORM**: TypeORM
- **Security**: JWT, Passport.js, Bcrypt
- **Container**: Docker & Docker Compose

---

## **4. Data Design**

### **4.1 Data Entities and Relationships**


| Entity | Icon | Description |
| :--- | :---: | :--- |
| **User** | 👤 | Core account credentials and status. |
| **Profile** | 📝 | Personal metadata (Bio, Avatar) linked 1:1 to User. |
| **Session** | 🔑 | Active login tracking and refresh token rotation. |
| **Contact** | 📇 | User-owned address book entries. |
| **Role** | 🛡️ | Named access levels (e.g., Admin). |
| **Permission**| 📜 | Granular action rules (e.g., `user:write`). |

### **4.2 Database Design Artifacts**


| Level | Link (Click to View) |
| :--- | :--- |
| **Conceptual** | [View Sketch 🎨](./docs/database/conceptual/conceptual-design.jpg) |
| **Logical** | [View ERD ⚙️](./docs/database/logical/logical-design.jpg) |
| **Physical** | [View SQL Migration 🏗️](./docs/database/physical/physical_diagram.png) |

---

## **5. Installation**

* [Download and install NodeJS](https://nodejs.org/en/download)
* [Download and install Docker](https://docs.docker.com)

---

## **6. Usage**

### **6.1 Run Application**

```bash
  git clone https://github.com
  cd NestJSTemplate

```

6.1.1 Run Locally
Configure .env from .env.sample.
Install and run:
bash
  npm install
  npm run start:dev
Use code with caution.

6.1.2 Run Docker Container
bash
  docker-compose up --build
Use code with caution.

7. API Testing 
Note : Use API Reference for endpoint testing.
8. Tests
bash
  npm run test
Use code with caution.

9. License
LICENSE
10. References
NestJS Documentation
TypeScript Deep Dive