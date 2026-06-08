import type {
    AuthRequest,
    AuthResponse,
    RegisterRequest,
    User,
    Patient,
    PatientDto,
    Doctor,
    Appointment,
    MedicalRecord,
    Prescription,
    Bill,
    Review,
    DashboardStats,
    PatientHistoryDto,
} from '../types';

export interface PaymentRequestDto {
    amount: number;
    patientId: string;
    appointmentId: string;
}

export interface PaymentResponseDto {
    id: string;
    currency: string;
    amount: number;
    razorpayKeyId: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiService {
    private getHeaders(includeAuth: boolean = true): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (includeAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: 'An error occurred',
            }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    // Auth API
    async login(credentials: AuthRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: this.getHeaders(false),
            body: JSON.stringify(credentials),
        });
        const data = await this.handleResponse<AuthResponse>(response);

        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            if (data.profileId) {
                localStorage.setItem('profileId', data.profileId);
            }
        }

        return data;
    }

    async register(data: RegisterRequest): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: this.getHeaders(false),
            body: JSON.stringify(data),
        });
        return this.handleResponse<User>(response);
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('profileId');
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    getRole(): string | null {
        return localStorage.getItem('role');
    }

    getUsername(): string | null {
        return localStorage.getItem('username');
    }

    getProfileId(): string | null {
        return localStorage.getItem('profileId');
    }

    // User API
    async getAllUsers(): Promise<User[]> {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<User[]>(response);
    }

    async getUserById(id: string): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<User>(response);
    }

    async updateUser(id: string, user: Partial<User>): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(user),
        });
        return this.handleResponse<User>(response);
    }

    async deleteUser(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<void>(response);
    }

    // Patient API
    async getAllPatients(): Promise<Patient[]> {
        const response = await fetch(`${API_BASE_URL}/api/patients`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Patient[]>(response);
    }

    async getPatientById(id: string): Promise<Patient> {
        const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Patient>(response);
    }

    async createPatient(patient: Partial<Patient>): Promise<Patient> {
        const response = await fetch(`${API_BASE_URL}/api/patients`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(patient),
        });
        return this.handleResponse<Patient>(response);
    }

    async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
        const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(patient),
        });
        return this.handleResponse<Patient>(response);
    }

    async deletePatient(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<void>(response);
    }

    async getPatientHistory(id: string): Promise<PatientHistoryDto> {
        const response = await fetch(`${API_BASE_URL}/api/patients/${id}/history`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<PatientHistoryDto>(response);
    }

    async getPatientsByDoctor(doctorId: string): Promise<PatientDto[]> {
        const response = await fetch(`${API_BASE_URL}/api/patients/doctor/${doctorId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<PatientDto[]>(response);
    }

    // Doctor API
    async getAllDoctors(): Promise<Doctor[]> {
        const response = await fetch(`${API_BASE_URL}/api/doctors`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Doctor[]>(response);
    }

    async getAvailableDoctors(): Promise<Doctor[]> {
        const response = await fetch(`${API_BASE_URL}/api/doctors/available`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Doctor[]>(response);
    }

    async getDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
        const response = await fetch(`${API_BASE_URL}/api/doctors/specialization/${specialization}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Doctor[]>(response);
    }

    async getDoctorById(id: string): Promise<Doctor> {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Doctor>(response);
    }

    async createDoctor(doctor: Partial<Doctor>): Promise<Doctor> {
        const response = await fetch(`${API_BASE_URL}/api/doctors`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(doctor),
        });
        return this.handleResponse<Doctor>(response);
    }

    async updateDoctor(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(doctor),
        });
        return this.handleResponse<Doctor>(response);
    }

    async deleteDoctor(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<void>(response);
    }

    async getDoctorAppointments(id: string): Promise<Appointment[]> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/doctor/${id}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment[]>(response);
    }

    // Appointment API
    async getAllAppointments(): Promise<Appointment[]> {
        const response = await fetch(`${API_BASE_URL}/api/appointments`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment[]>(response);
    }

    async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/patient/${patientId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment[]>(response);
    }

    async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/doctor/${doctorId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment[]>(response);
    }

    async getAppointmentsByStatus(status: string): Promise<Appointment[]> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/status/${status}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment[]>(response);
    }

    async getAppointmentsByDateRange(start: string, end: string): Promise<Appointment[]> {
        const response = await fetch(
            `${API_BASE_URL}/api/appointments/daterange?start=${start}&end=${end}`,
            {
                headers: this.getHeaders(),
            }
        );
        return this.handleResponse<Appointment[]>(response);
    }

    async getAppointmentById(id: string): Promise<Appointment> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment>(response);
    }

    async createAppointment(appointment: Partial<Appointment>): Promise<Appointment> {
        const response = await fetch(`${API_BASE_URL}/api/appointments`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(appointment),
        });
        return this.handleResponse<Appointment>(response);
    }

    async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(appointment),
        });
        return this.handleResponse<Appointment>(response);
    }

    async deleteAppointment(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<void>(response);
    }

    // Medical Record API
    async getAllMedicalRecords(): Promise<MedicalRecord[]> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<MedicalRecord[]>(response);
    }

    async getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records/patient/${patientId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<MedicalRecord[]>(response);
    }

    async getMedicalRecordsByDoctor(doctorId: string): Promise<MedicalRecord[]> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records/doctor/${doctorId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<MedicalRecord[]>(response);
    }

    async getMedicalRecordsByAppointment(appointmentId: string): Promise<MedicalRecord[]> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records/appointment/${appointmentId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<MedicalRecord[]>(response);
    }

    async getMedicalRecordById(id: string): Promise<MedicalRecord> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records/${id}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<MedicalRecord>(response);
    }

    async createMedicalRecord(record: Partial<MedicalRecord>): Promise<MedicalRecord> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(record),
        });
        return this.handleResponse<MedicalRecord>(response);
    }

    async updateMedicalRecord(id: string, record: Partial<MedicalRecord>): Promise<MedicalRecord> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(record),
        });
        return this.handleResponse<MedicalRecord>(response);
    }

    async deleteMedicalRecord(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<void>(response);
    }

    // Prescription API
    async getAllPrescriptions(): Promise<Prescription[]> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Prescription[]>(response);
    }

    async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions/patient/${patientId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Prescription[]>(response);
    }

    async getPrescriptionsByDoctor(doctorId: string): Promise<Prescription[]> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions/doctor/${doctorId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Prescription[]>(response);
    }

    async getPrescriptionsByAppointment(appointmentId: string): Promise<Prescription[]> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions/appointment/${appointmentId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Prescription[]>(response);
    }

    async getPrescriptionById(id: string): Promise<Prescription> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions/${id}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Prescription>(response);
    }

    async createPrescription(prescription: Partial<Prescription>): Promise<Prescription> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(prescription),
        });
        return this.handleResponse<Prescription>(response);
    }

    async updatePrescription(id: string, prescription: Partial<Prescription>): Promise<Prescription> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(prescription),
        });
        return this.handleResponse<Prescription>(response);
    }

    async deletePrescription(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<void>(response);
    }

    // Bill API
    async getAllBills(): Promise<Bill[]> {
        const response = await fetch(`${API_BASE_URL}/api/bills`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Bill[]>(response);
    }

    async getBillsByPatient(patientId: string): Promise<Bill[]> {
        const response = await fetch(`${API_BASE_URL}/api/bills/patient/${patientId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Bill[]>(response);
    }

    async getBillsByAppointment(appointmentId: string): Promise<Bill[]> {
        const response = await fetch(`${API_BASE_URL}/api/bills/appointment/${appointmentId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Bill[]>(response);
    }

    async getBillsByStatus(status: string): Promise<Bill[]> {
        const response = await fetch(`${API_BASE_URL}/api/bills/status/${status}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Bill[]>(response);
    }

    async getBillById(id: string): Promise<Bill> {
        const response = await fetch(`${API_BASE_URL}/api/bills/${id}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Bill>(response);
    }

    async createBill(bill: Partial<Bill>): Promise<Bill> {
        const response = await fetch(`${API_BASE_URL}/api/bills`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(bill),
        });
        return this.handleResponse<Bill>(response);
    }

    async updateBill(id: string, bill: Partial<Bill>): Promise<Bill> {
        const response = await fetch(`${API_BASE_URL}/api/bills/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(bill),
        });
        return this.handleResponse<Bill>(response);
    }

    async deleteBill(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/bills/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<void>(response);
    }

    // Review API
    async createReview(review: Partial<Review>): Promise<Review> {
        const response = await fetch(`${API_BASE_URL}/api/reviews`, {
            method: 'POST',
            headers: this.getHeaders(false),
            body: JSON.stringify(review),
        });
        return this.handleResponse<Review>(response);
    }

    async getReviewsForDoctor(doctorId: string): Promise<Review[]> {
        const response = await fetch(`${API_BASE_URL}/api/reviews/doctor/${doctorId}`, {
            headers: this.getHeaders(false),
        });
        return this.handleResponse<Review[]>(response);
    }

    // Dashboard API
    async getDashboardStats(): Promise<DashboardStats> {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<DashboardStats>(response);
    }

    async getDoctorDashboardStats(doctorId: string): Promise<DashboardStats> {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/doctor/${doctorId}/stats`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<DashboardStats>(response);
    }

    async getPatientDashboardStats(patientId: string): Promise<DashboardStats> {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/patient/${patientId}/stats`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<DashboardStats>(response);
    }

    async markAppointmentComplete(id: string): Promise<Appointment> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${id}/complete`, {
            method: 'PUT',
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment>(response);
    }

    async markAppointmentCancelled(id: string): Promise<Appointment> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${id}/cancel`, {
            method: 'PUT',
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment>(response);
    }

    async markAppointmentNoShow(id: string): Promise<Appointment> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${id}/no-show`, {
            method: 'PUT',
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment>(response);
    }

    async markAppointmentConfirmed(id: string): Promise<Appointment> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${id}/confirm`, {
            method: 'PUT',
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment>(response);
    }

    async markAppointmentInProgress(id: string): Promise<Appointment> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${id}/in-progress`, {
            method: 'PUT',
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment>(response);
    }

    // Payment API
    async createPaymentOrder(data: PaymentRequestDto): Promise<PaymentResponseDto> {
        const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse<PaymentResponseDto>(response);
    }
}

export const api = new ApiService();
export default api;
