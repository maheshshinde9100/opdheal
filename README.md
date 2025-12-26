# 🏥 OPDHeal - Outpatient Department Management System

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)

*A modern, full-stack solution for digitalizing hospital outpatient department workflows*

</div>

---

## 📋 Overview

**OPDHeal** is a comprehensive hospital management platform designed to streamline outpatient department operations. The system provides role-based portals for patients, doctors, and administrative staff, enabling efficient management of appointments, medical records, prescriptions, billing, and analytics—all in a secure, user-friendly environment.

### 🎯 Key Highlights

- **Multi-tenant Architecture**: Separate, secure portals for patients, doctors, and administrators
- **Real-time Operations**: Live appointment scheduling with slot availability
- **Digital Healthcare**: End-to-end paperless workflow from booking to billing
- **Teleconsultation Ready**: Integrated video calling for remote consultations
- **Analytics-Driven**: Comprehensive reporting and insights dashboard

---

## ✨ Features

### 👤 Patient Portal

| Feature | Description |
|---------|-------------|
| **Smart Appointment Booking** | Book appointments with real-time doctor availability, automated slot suggestions, and instant confirmation |
| **Digital Health Records** | Centralized access to prescriptions, lab reports, vaccination history, and complete medical timeline |
| **Secure Payment Gateway** | Multiple payment options with invoice generation and transaction history |
| **Teleconsultation** | High-quality video consultations with screen sharing and chat support |
| **Health Analytics** | Visual tracking of vitals (BP, sugar levels, weight) with trend analysis |
| **Prescription Management** | Download, print, and share digital prescriptions with integrated pharmacy ordering |

### 👨‍⚕️ Doctor Portal

| Feature | Description |
|---------|-------------|
| **Unified Dashboard** | Daily schedule overview with patient queue management and notifications |
| **E-Prescription System** | Digital prescription builder with drug database, dosage templates, and pharmacy integration |
| **Patient EMR Access** | Complete electronic medical records with treatment history and allergies |
| **Consultation Tools** | Built-in notes, diagnosis codes (ICD-10), and follow-up scheduling |
| **Leave & Availability** | Self-service leave management with automatic patient rescheduling alerts |
| **Performance Metrics** | Patient satisfaction scores, consultation duration analytics |

### 🏢 Admin Portal

| Feature | Description |
|---------|-------------|
| **User Management** | Role-based access control, account approval workflows, and activity monitoring |
| **Appointment Oversight** | System-wide appointment calendar with filtering, bulk operations, and conflict resolution |
| **Financial Dashboard** | Revenue tracking, payment reconciliation, outstanding dues, and refund management |
| **Inventory Control** | Pharmacy stock management with low-stock alerts and expiry tracking |
| **Resource Allocation** | OPD room scheduling, equipment tracking, and capacity planning |
| **Advanced Analytics** | Patient footfall trends, revenue reports, doctor utilization, and custom reports |

---

## 🛠️ Technology Stack

### Backend Architecture
```
Spring Boot 3.x
├── Spring Security + JWT (Authentication & Authorization)
├── Spring Data JPA (ORM Layer)
├── Spring Web (RESTful APIs)
├── Spring Validation (Input Validation)
├── Springdoc OpenAPI (API Documentation)
└── PostgreSQL/MySQL (Relational Database)
```

**Key Dependencies:**
- **Security**: JWT token-based authentication, BCrypt password encryption
- **Database**: Hibernate ORM, database migration with Flyway/Liquibase
- **Testing**: JUnit 5, Mockito, TestContainers
- **Build**: Maven with multi-module project structure

### Frontend Architecture
```
React 18+
├── Redux Toolkit (State Management)
├── Material-UI / Ant Design (UI Components)
├── React Router v6 (Client-side Routing)
├── Axios (HTTP Client with Interceptors)
├── Formik + Yup (Form Handling & Validation)
├── Chart.js / Recharts (Data Visualization)
└── React Query (Server State Management)
```

**Key Features:**
- Responsive design with mobile-first approach
- Progressive Web App (PWA) capabilities
- Code splitting and lazy loading for optimal performance
- Internationalization (i18n) support

### DevOps & Infrastructure

| Tool | Purpose |
|------|---------|
| **Docker** | Containerization of backend, frontend, and database |
| **Docker Compose** | Multi-container orchestration for local development |
| **Jenkins** | CI/CD pipeline for automated testing and deployment |
| **Git** | Version control with GitFlow branching strategy |
| **Postman** | API testing and documentation |
| **SonarQube** | Code quality and security analysis |

---

## 🚀 Getting Started

### Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v18+ and npm/yarn
- **Database**: PostgreSQL 14+ or MySQL 8+
- **Docker**: (Optional) For containerized deployment

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone <your-repository-url>
cd opdheal
```

#### 2️⃣ Backend Setup
```bash
cd backend

# Configure database connection
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your database credentials

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

#### 3️⃣ Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure API endpoint
cp .env.example .env
# Edit .env with backend URL

# Start development server
npm start
```

Frontend will start on `http://localhost:3000`

#### 4️⃣ Docker Setup (Alternative)
```bash
# From project root
docker-compose up -d

# Access services:
# Backend: http://localhost:8080
# Frontend: http://localhost:3000
# Database: localhost:5432
```

---

## 🏗️ System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Patient    │  │    Doctor    │  │    Admin     │ │
│  │   Portal     │  │    Portal    │  │   Portal     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS/REST API
┌────────────────────────▼────────────────────────────────┐
│                  API Gateway Layer                      │
│              (Spring Security + JWT)                    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                 Application Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Appointment│  │   Patient   │  │   Billing   │    │
│  │   Service   │  │   Service   │  │   Service   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              Data Access Layer (JPA)                    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              PostgreSQL Database                        │
└─────────────────────────────────────────────────────────┘
```

### Database Schema

**Core Entities:**
- `users` (patients, doctors, admins)
- `appointments` (with status tracking)
- `prescriptions` (linked to appointments)
- `medical_records` (patient history)
- `billing` (invoices and payments)
- `inventory` (pharmacy stock)

---

## 📚 API Documentation

Once the backend is running, access interactive API documentation:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI Spec**: `http://localhost:8080/v3/api-docs`

### API Endpoints Overview

| Module | Endpoint | Description |
|--------|----------|-------------|
| **Authentication** | `POST /api/auth/login` | User login |
| | `POST /api/auth/register` | Patient registration |
| **Appointments** | `GET /api/appointments` | List appointments |
| | `POST /api/appointments` | Book appointment |
| | `PUT /api/appointments/{id}` | Update appointment |
| **Prescriptions** | `GET /api/prescriptions/{id}` | Get prescription |
| | `POST /api/prescriptions` | Create prescription |
| **Patients** | `GET /api/patients/{id}` | Patient details |
| | `GET /api/patients/{id}/history` | Medical history |

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test                          # Run unit tests
mvn verify                        # Run integration tests
mvn test jacoco:report            # Generate coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                          # Run tests in watch mode
npm run test:coverage             # Generate coverage report
npm run test:e2e                  # Run end-to-end tests
```

---

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based authentication with refresh tokens
- **Role-Based Access Control (RBAC)**: Granular permissions for each user role
- **Password Security**: BCrypt hashing with salt
- **SQL Injection Prevention**: Parameterized queries via JPA
- **XSS Protection**: Input sanitization and output encoding
- **CORS Configuration**: Restricted cross-origin requests
- **HTTPS Enforcement**: Secure communication in production
- **Audit Logging**: Comprehensive activity tracking

---

## 📈 Future Roadmap

- [ ] **AI-Powered Features**
  - Symptom checker chatbot
  - Predictive appointment scheduling
  - Disease trend analysis
  
- [ ] **Mobile Applications**
  - Native iOS and Android apps
  - Push notifications for appointments
  
- [ ] **Integration Modules**
  - Lab equipment integration (HL7/FHIR)
  - Insurance claim processing
  - Pharmacy POS system
  
- [ ] **Advanced Analytics**
  - Machine learning for patient risk assessment
  - Real-time OPD capacity monitoring dashboard

---

## 📝 Project Status

This is an individual project currently under development. Built with Spring Boot and React as a learning and portfolio project.

---

## 📧 Contact

For any queries or suggestions, feel free to reach out!

</div>
