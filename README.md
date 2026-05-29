# 🏥 OPDHeal - Outpatient Department Management System

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=flat-square&logo=swagger)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C243C?style=flat-square&logo=razorpay)

*A modern, full-stack solution for digitalizing hospital outpatient department workflows*

</div>

---

## 📋 Overview

**OPDHeal** is a comprehensive hospital management platform designed to streamline outpatient department operations. The system provides role-based portals for patients, doctors, and administrative staff, enabling efficient management of appointments, medical records, prescriptions, billing, and analytics—all in a secure, user-friendly environment.

### 🎯 Key Highlights

- **Multi-tenant Architecture**: Separate, secure portals for patients, doctors, and administrators
- **Real-time Operations**: Live appointment scheduling with slot availability
- **Digital Healthcare**: End-to-end paperless workflow from booking to billing
- **Analytics-Driven**: Comprehensive reporting and insights dashboard
- **Payment Integration**: Seamless Razorpay payment gateway integration

---

## ✨ Features

### 👤 Patient Portal

| Feature | Description |
|---------|-------------|
| **Smart Appointment Booking** | Book appointments with real-time doctor availability |
| **Digital Health Records** | Centralized access to prescriptions and medical records |
| **Billing & Payments** | View invoices and pay via Razorpay payment gateway |
| **Prescription Management** | Access and download digital prescriptions |

### 👨‍⚕️ Doctor Portal

| Feature | Description |
|---------|-------------|
| **Unified Dashboard** | Daily schedule overview with patient queue |
| **E-Prescription System** | Digital prescription creation |
| **Patient EMR Access** | Complete electronic medical records |

### 🏢 Admin Portal

| Feature | Description |
|---------|-------------|
| **User Management** | Role-based access control |
| **Appointment Oversight** | System-wide appointment management |
| **Financial Dashboard** | Billing and payment tracking |

---

## 🛠️ Technology Stack

### Backend Architecture
```mermaid
graph LR
    A[Frontend<br/>React 19.x] -->|REST API<br/>JSON| B[API Gateway<br/>Spring Boot 3.x]
    B --> C[Service Layer]
    C --> D[Spring Data MongoDB]
    D --> E[(MongoDB<br/>Database)]
    
    B --> F[Security Layer<br/>Spring Security + JWT]
    B --> G[Swagger UI<br/>API Documentation]
    
    subgraph Payment Integration
        H[Razorpay Service]
        H --> I[Razorpay API]
    end
    
    C --> H

    style A fill:#61DAFB,stroke:#222,color:#000
    style B fill:#6DB33F,stroke:#222,color:#fff
    style E fill:#47A248,stroke:#222,color:#fff
    style G fill:#85EA2D,stroke:#222,color:#000
    style I fill:#0C243C,stroke:#222,color:#fff
```

**Key Dependencies**:
- **Security**: JWT token-based authentication, BCrypt password encryption
- **Database**: Spring Data MongoDB
- **API Docs**: SpringDoc OpenAPI (Swagger UI)
- **Payments**: Razorpay Java SDK
- **Build**: Maven

### Frontend Architecture
```mermaid
graph LR
    A[Landing Page] --> B[Login/Register]
    B --> C{User Role}
    C -->|Patient| D[Patient Dashboard]
    C -->|Doctor| E[Doctor Dashboard]
    C -->|Admin| F[Admin Dashboard]
    
    D --> D1[Appointments]
    D --> D2[Medical Records]
    D --> D3[Prescriptions]
    D --> D4[Billing<br/>Razorpay]
    
    E --> E1[Schedule]
    E --> E2[My Patients]
    E --> E3[Prescriptions]
    
    F --> F1[User Management]
    F --> F2[Appointments]
    F --> F3[Financials]
    
    style A fill:#61DAFB,stroke:#222,color:#000
    style D fill:#10B981,stroke:#222,color:#fff
    style E fill:#3B82F6,stroke:#222,color:#fff
    style F fill:#F59E0B,stroke:#222,color:#fff
    style D4 fill:#0C243C,stroke:#222,color:#fff
```

**Key Features**:
- Responsive design with Tailwind CSS
- React Router v7 for routing
- TypeScript support
- Vite as build tool

---

## 🏗️ System Architecture

### System Workflow
```mermaid
sequenceDiagram
    autonumber
    participant P as Patient
    participant D as Doctor
    participant A as Admin
    participant F as Frontend
    participant B as Backend
    participant M as MongoDB
    participant R as Razorpay
    
    P->>F: Login / Register
    F->>B: POST /api/auth/login
    B->>M: Verify credentials
    M-->>B: User details
    B->>B: Generate JWT token
    B-->>F: JWT Token
    F->>P: Dashboard

    P->>F: Book Appointment
    F->>B: POST /api/appointments
    B->>M: Save appointment
    M-->>B: Appointment saved
    B-->>F: Confirmation
    F-->>P: Appointment confirmed
    
    P->>F: Pay Now
    F->>B: POST /api/payments/create-order
    B->>R: Create Razorpay Order
    R-->>B: Order ID & Details
    B-->>F: Order Info
    F->>R: Open Razorpay Checkout
    R-->>P: Payment Window
    P->>R: Complete Payment
    R-->>F: Payment Success
    F-->>P: Payment Successful!
```

### Entity Relationship Diagram
```mermaid
erDiagram
    USER ||--o{ PATIENT : "has one"
    USER ||--o{ DOCTOR : "has one"
    PATIENT ||--o{ APPOINTMENT : "books"
    DOCTOR ||--o{ APPOINTMENT : "attends"
    APPOINTMENT ||--o{ PRESCRIPTION : "generates"
    APPOINTMENT ||--o{ MEDICAL_RECORD : "creates"
    APPOINTMENT ||--o{ BILL : "generates"
    PATIENT ||--o{ MEDICAL_RECORD : "owns"
    PATIENT ||--o{ PRESCRIPTION : "receives"
    PATIENT ||--o{ BILL : "owes"
    DOCTOR ||--o{ REVIEW : "has"

    USER {
        string id PK
        string username
        string password
        string email
        string firstName
        string lastName
        enum role
        boolean enabled
        datetime createdAt
        datetime updatedAt
    }

    PATIENT {
        string id PK
        string userId FK
        string phoneNumber
        date dateOfBirth
        string address
        string emergencyContact
        list allergies
        string bloodGroup
        string weight
        string medicalHistory
        datetime createdAt
        datetime updatedAt
    }

    DOCTOR {
        string id PK
        string userId FK
        string specialization
        string licenseNumber
        string phoneNumber
        list qualifications
        int experienceYears
        string department
        boolean available
        double averageRating
        int ratingCount
        datetime createdAt
        datetime updatedAt
    }

    APPOINTMENT {
        string id PK
        string patientId FK
        string doctorId FK
        datetime appointmentDateTime
        string reasonForVisit
        enum status
        string notes
        datetime createdAt
        datetime updatedAt
    }
```

---

## 📚 API Documentation

Once the backend is running, access interactive API documentation at:

- **Swagger UI**: `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI Spec**: `http://localhost:8080/v3/api-docs`

---

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Role-Based Access Control (RBAC)**: Granular permissions for PATIENT, DOCTOR, ADMIN roles
- **Password Security**: BCrypt hashing
- **CORS Configuration**: Restricted cross-origin requests
- **Input Validation**: Spring Validation for request payloads

---

## 📝 Project Structure

```
opdheal/
├── client/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/java/
│   │   │   └── com/mahesh/opdheal/
│   │   │       ├── config/      # Configuration classes
│   │   │       ├── controller/  # REST controllers
│   │   │       ├── dto/         # Data Transfer Objects
│   │   │       ├── exception/   # Exception handling
│   │   │       ├── model/       # MongoDB entities
│   │   │       ├── repository/  # Data repositories
│   │   │       ├── security/    # Security utilities
│   │   │       ├── service/     # Business logic
│   │   │       └── util/        # Helper utilities
│   │   └── main/resources/
│   └── pom.xml
└── README.md
```

---

## Contact

For any queries or suggestions, feel free to reach out!

- **GitHub**: [https://github.com/maheshshinde9100](https://github.com/maheshshinde9100)
- **Portfolio**: [https://maheshshinde-dev.vercel.app/](https://maheshshinde-dev.vercel.app/)
- **LinkedIn**: [https://www.linkedin.com/in/maheshshinde9100](https://www.linkedin.com/in/maheshshinde9100)

---

## 🔄 Previous Changes Pull Request

### PR Title
feat: Add Swagger/OpenAPI Docs, Config Examples, Dashboard Stats & Appointment Status Management

### PR Description
This pull request includes multiple enhancements and improvements for the OPDHeal outpatient department management system:

1. **Swagger/OpenAPI Documentation**
   - Added springdoc-openapi dependency to pom.xml
   - Added OpenApiConfig.java to configure Swagger UI with JWT bearer token authentication
   - Updated SecurityConfig to allow unauthenticated access to Swagger UI and OpenAPI endpoints (/swagger-ui/**, /v3/api-docs/**)

2. **Model & Service Improvements**
   - Added NO_SHOW status to Appointment model
   - Added updatedAt field to all domain models (User, Patient, Doctor, Appointment, MedicalRecord, Prescription, Bill, Review)
   - Updated all service classes to set createdAt and updatedAt timestamps
   - Added AppointmentService methods to mark status changes: markAsCompleted, markAsCancelled, markAsNoShow, markAsConfirmed, markAsInProgress

3. **Controller & API Endpoints**
   - Added new endpoints to AppointmentController for status management
   - Updated DashboardService to add getDoctorStats and getPatientStats methods
   - Added corresponding endpoints in DashboardController

4. **Configuration Files & Git Safety**
   - Added client/.env.example
   - Added server/src/main/resources/application.properties.example
   - Updated server/.gitignore to exclude application.properties to protect sensitive credentials

5. **Frontend Updates**
   - Added new API methods in client/src/services/api.ts

6. **README Improvements**
   - Updated README.md with Mermaid diagrams for system architecture, ER diagram, and sequence diagram
   - Updated tech stack badges and project info

