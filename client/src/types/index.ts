// User & Authentication Types
export interface User {
    id: string;
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
    profileId?: string;
}

// Patient Types
export interface Patient {
    id: string;
    userId: string;
    user?: User;
    firstName?: string;
    lastName?: string;
    email?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    phoneNumber?: string;
    address?: string;
    bloodGroup?: string;
    weight?: string;
    emergencyContact?: string;
    medicalHistory?: string;
    allergies?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PatientDto {
    id: string;
    userId: string;
    user?: User;
    firstName?: string;
    lastName?: string;
    email?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    phoneNumber?: string;
    address?: string;
    bloodGroup?: string;
    weight?: string;
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
    id: string;
    userId: string;
    user?: User;
    firstName?: string;
    lastName?: string;
    email?: string;
    specialization: string;
    licenseNumber?: string;
    department?: string;
    experienceYears?: number;
    qualifications?: string[];
    qualification?: string;
    experience?: number;
    consultationFee?: number;
    phoneNumber?: string;
    availableFrom?: string;
    availableTo?: string;
    available?: boolean;
    rating?: number;
    totalReviews?: number;
    averageRating?: number;
    ratingCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

// Appointment Types — matches backend model exactly
export interface Appointment {
    id: string;
    patientId: string;
    patient?: Patient;
    doctorId: string;
    doctor?: Doctor;
    // Backend uses appointmentDateTime (single ISO datetime)
    appointmentDateTime?: string;
    // Legacy/convenience fields (frontend computed)
    appointmentDate?: string;
    appointmentTime?: string;
    status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    reason?: string;
    // Alias for reason (used in frontend forms)
    reasonForVisit?: string;
    notes?: string;
    createdAt?: string;

    // DTO fields (enriched)
    patientName?: string;
    doctorName?: string;
    doctorSpecialization?: string;
    updatedAt?: string;
}

// Medical Record Types
export interface MedicalRecord {
    id: string;
    patientId: string;
    patient?: Patient;
    doctorId: string;
    doctor?: Doctor;
    appointmentId?: string;
    appointment?: Appointment;
    diagnosis: string;
    symptoms?: string;
    treatment?: string;
    notes?: string;
    recordDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Prescription Types
export interface Prescription {
    id: string;
    patientId: string;
    patient?: Patient;
    doctorId: string;
    doctor?: Doctor;
    appointmentId?: string;
    appointment?: Appointment;
    medicines: Array<{
        name: string;
        dosage: string;
        frequency: string;
        durationDays: number;
    }>;
    instructions: string;
    notes?: string;
    prescriptionDate: string;
    createdAt?: string;
    updatedAt?: string;

    // DTO fields (enriched)
    patientName?: string;
    doctorName?: string;
    doctorSpecialization?: string;
}

// Bill Types — matches backend Bill model
export interface Bill {
    id: string;
    patientId: string;
    patient?: Patient;
    appointmentId?: string;
    appointment?: Appointment;
    consultationFee?: number;
    medicineFee?: number;
    totalAmount?: number;
    // Convenience alias
    amount: number;
    paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';
    status?: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';
    paymentMethod?: 'CASH' | 'CARD' | 'UPI' | 'ONLINE';
    billDate?: string;
    paymentDate?: string;
    dueDate?: string;
    description?: string;
    items?: string[];
    createdAt?: string;
    updatedAt?: string;
}

// Review Types
export interface Review {
    id: string;
    doctorId: string;
    doctor?: Doctor;
    patientId?: string;
    patient?: Patient;
    rating: number;
    comment?: string;
    reviewDate: string;
    createdAt?: string;
}

// Dashboard Stats
export interface DashboardStats {
    totalPatients?: number;
    totalDoctors?: number;
    totalAppointments?: number;
    todayAppointments?: number;
    pendingBills?: number;
    revenue?: number;
    totalRevenue?: number;
    totalPrescriptions?: number;
    [key: string]: number | undefined;
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
