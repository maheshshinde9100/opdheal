import type {
    AuthRequest,
    AuthResponse,
    RegisterRequest,
    User,
    Patient,
    Doctor,
    Appointment,
    MedicalRecord,
    Prescription,
    Bill,
    Review,
    DashboardStats,
    PatientHistoryDto,
} from '../types';

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

        // Store token
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

    async getUserById(id: number): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<User>(response);
    }

    async updateUser(id: number, user: Partial<User>): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(user),
        });
        return this.handleResponse<User>(response);
    }

    async deleteUser(id: number): Promise<void> {
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

    async getPatientById(id: number): Promise<Patient> {
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

    async updatePatient(id: number, patient: Partial<Patient>): Promise<Patient> {
        const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(patient),
        });
        return this.handleResponse<Patient>(response);
    }

    async deletePatient(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<void>(response);
    }

    async getPatientHistory(id: number): Promise<PatientHistoryDto> {
        const response = await fetch(`${API_BASE_URL}/api/patients/${id}/history`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<PatientHistoryDto>(response);
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

    async getDoctorById(id: number): Promise<Doctor> {
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

    async updateDoctor(id: number, doctor: Partial<Doctor>): Promise<Doctor> {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(doctor),
        });
        return this.handleResponse<Doctor>(response);
    }

    async deleteDoctor(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<void>(response);
    }

    async getDoctorAppointments(id: number): Promise<Appointment[]> {
        const response = await fetch(`${API_BASE_URL}/api/doctors/${id}/appointments`, {
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

    async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/patient/${patientId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Appointment[]>(response);
    }

    async getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
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

    async getAppointmentById(id: number): Promise<Appointment> {
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

    async updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment> {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(appointment),
        });
        return this.handleResponse<Appointment>(response);
    }

    async deleteAppointment(id: number): Promise<void> {
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

    async getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records/patient/${patientId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<MedicalRecord[]>(response);
    }

    async getMedicalRecordsByDoctor(doctorId: number): Promise<MedicalRecord[]> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records/doctor/${doctorId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<MedicalRecord[]>(response);
    }

    async getMedicalRecordsByAppointment(appointmentId: number): Promise<MedicalRecord[]> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records/appointment/${appointmentId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<MedicalRecord[]>(response);
    }

    async getMedicalRecordById(id: number): Promise<MedicalRecord> {
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

    async updateMedicalRecord(id: number, record: Partial<MedicalRecord>): Promise<MedicalRecord> {
        const response = await fetch(`${API_BASE_URL}/api/medical-records/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(record),
        });
        return this.handleResponse<MedicalRecord>(response);
    }

    async deleteMedicalRecord(id: number): Promise<void> {
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

    async getPrescriptionsByPatient(patientId: number): Promise<Prescription[]> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions/patient/${patientId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Prescription[]>(response);
    }

    async getPrescriptionsByDoctor(doctorId: number): Promise<Prescription[]> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions/doctor/${doctorId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Prescription[]>(response);
    }

    async getPrescriptionsByAppointment(appointmentId: number): Promise<Prescription[]> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions/appointment/${appointmentId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Prescription[]>(response);
    }

    async getPrescriptionById(id: number): Promise<Prescription> {
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

    async updatePrescription(id: number, prescription: Partial<Prescription>): Promise<Prescription> {
        const response = await fetch(`${API_BASE_URL}/api/prescriptions/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(prescription),
        });
        return this.handleResponse<Prescription>(response);
    }

    async deletePrescription(id: number): Promise<void> {
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

    async getBillsByPatient(patientId: number): Promise<Bill[]> {
        const response = await fetch(`${API_BASE_URL}/api/bills/patient/${patientId}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse<Bill[]>(response);
    }

    async getBillsByAppointment(appointmentId: number): Promise<Bill[]> {
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

    async getBillById(id: number): Promise<Bill> {
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

    async updateBill(id: number, bill: Partial<Bill>): Promise<Bill> {
        const response = await fetch(`${API_BASE_URL}/api/bills/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(bill),
        });
        return this.handleResponse<Bill>(response);
    }

    async deleteBill(id: number): Promise<void> {
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

    async getReviewsForDoctor(doctorId: number): Promise<Review[]> {
        const response = await fetch(`${API_BASE_URL}/api/reviews/doctor/${doctorId}`, {
            headers: this.getHeaders(false),
        });
        return this.handleResponse<Review[]>(response);
    }

    // Dashboard API
    async getDashboardStats(): Promise<DashboardStats> {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
            headers: this.getHeaders(false),
        });
        return this.handleResponse<DashboardStats>(response);
    }
}

export const api = new ApiService();
export default api;
