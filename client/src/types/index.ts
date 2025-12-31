// User & Authentication Types
export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'PATIENT' | 'DOCTOR';
}

export interface AuthResponse {
    token: string;
    type: string;
    username: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

// Patient Types
export interface Patient {
    id: number;
    userId: number;
    user?: User;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phoneNumber: string;
    address: string;
    bloodGroup?: string;
    emergencyContact?: string;
    medicalHistory?: string;
    allergies?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PatientHistoryDto {
    patient: Patient;
    appointments: Appointment[];
    medicalRecords: MedicalRecord[];
    prescriptions: Prescription[];
    bills: Bill[];
}

// Doctor Types
export interface Doctor {
    id: number;
    userId: number;
    user?: User;
    specialization: string;
    qualification: string;
    experience: number;
    consultationFee: number;
    phoneNumber: string;
    availableFrom?: string;
    availableTo?: string;
    available: boolean;
    rating?: number;
    totalReviews?: number;
    createdAt?: string;
    updatedAt?: string;
}

// Appointment Types
export interface Appointment {
    id: number;
    patientId: number;
    patient?: Patient;
    doctorId: number;
    doctor?: Doctor;
    appointmentDate: string;
    appointmentTime: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    reasonForVisit: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Medical Record Types
export interface MedicalRecord {
    id: number;
    patientId: number;
    patient?: Patient;
    doctorId: number;
    doctor?: Doctor;
    appointmentId?: number;
    appointment?: Appointment;
    diagnosis: string;
    symptoms: string;
    treatment: string;
    notes?: string;
    recordDate: string;
    createdAt?: string;
    updatedAt?: string;
}

// Prescription Types
export interface Prescription {
    id: number;
    patientId: number;
    patient?: Patient;
    doctorId: number;
    doctor?: Doctor;
    appointmentId?: number;
    appointment?: Appointment;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    prescriptionDate: string;
    createdAt?: string;
    updatedAt?: string;
}

// Bill Types
export interface Bill {
    id: number;
    patientId: number;
    patient?: Patient;
    appointmentId?: number;
    appointment?: Appointment;
    amount: number;
    paymentStatus: 'PAID' | 'PENDING' | 'CANCELLED';
    paymentMethod?: 'CASH' | 'CARD' | 'UPI' | 'ONLINE';
    billDate: string;
    dueDate?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Review Types
export interface Review {
    id: number;
    doctorId: number;
    doctor?: Doctor;
    patientId?: number;
    patient?: Patient;
    rating: number;
    comment?: string;
    reviewDate: string;
    createdAt?: string;
}

// Dashboard Stats
export interface DashboardStats {
    totalPatients: number;
    totalDoctors: number;
    totalAppointments: number;
    todayAppointments?: number;
    pendingBills?: number;
    revenue?: number;
}

// API Error Response
export interface ApiError {
    message: string;
    status: number;
    timestamp?: string;
}

// Pagination
export interface PageRequest {
    page: number;
    size: number;
    sort?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
