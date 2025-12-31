# OPD Heal - Hospital Management System Frontend

A modern, comprehensive healthcare management system built with React, TypeScript, and TailwindCSS.

## ✨ Features

- 🏥 **Role-Based Access Control** - Separate dashboards for Admin, Doctor, and Patient
- 📅 **Appointment Management** - Easy booking and scheduling system
- 📋 **Medical Records** - Digital health records management
- 💊 **E-Prescriptions** - Electronic prescription handling
- 💰 **Billing System** - Online payment and billing tracking
- ⭐ **Doctor Reviews** - Rate and review healthcare providers
- 🔒 **Secure Authentication** - JWT-based authentication
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI/UX** - Beautiful, intuitive interface with smooth animations

## 🚀 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS 4** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see API_ENDPOINTS.md)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd opdheal/client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the API URL:
```
VITE_API_BASE_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── Loader.tsx
│   ├── pages/              # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── PatientDashboard.tsx
│   ├── services/           # API services
│   │   └── api.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── helpers.ts
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles and design system
├── public/                 # Static assets
├── .env                    # Environment variables
├── .env.example            # Environment variables template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Design System

The application uses a comprehensive design system defined in `index.css`:

### Colors
- **Primary**: Blue shades for main actions
- **Success**: Green for health/success states
- **Warning**: Orange for alerts
- **Error**: Red for errors
- **Neutral**: Gray scale for text and backgrounds

### Components
- Buttons with multiple variants (primary, secondary, success, danger, outline)
- Input fields with label, error, and icon support
- Cards for content organization
- Badges for status indicators
- Modals for dialogs
- Loading spinners

### Animations
- Fade in/out
- Slide (up, down, left, right)
- Scale
- Float
- Pulse
- Spin

## 🔐 Authentication

The app uses JWT tokens stored in localStorage:
- Token is sent with all authenticated API requests
- Automatic redirection to login if not authenticated
- Role-based routing (Admin, Doctor, Patient)

## 🌐 API Integration

All API calls are centralized in `src/services/api.ts`. The service handles:
- Authentication (login, register, logout)
- User management
- Patient management
- Doctor management
- Appointment management
- Medical records
- Prescriptions
- Billing
- Reviews
- Dashboard statistics

## 📱 User Roles

### Patient
- Book appointments
- View medical records
- Access prescriptions
- Pay bills
- Leave reviews

### Doctor
- View appointments
- Create medical records
- Write prescriptions
- Manage patient information

### Admin
- Manage all users
- Oversee all operations
- View system statistics
- Manage doctors and patients

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

1. Update `.env` with production API URL:
```
VITE_API_BASE_URL=https://your-production-api.com
```

2. Build the application:
```bash
npm run build
```

3. The build output will be in the `dist/` directory

4. Deploy the `dist/` directory to your hosting service:
   - Vercel
   - Netlify
   - AWS S3
   - Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Issues

If you encounter any issues, please create an issue on GitHub with:
- Description of the problem
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

## 📞 Support

For support, email support@opdheal.com or open an issue on GitHub.

---

Made with ❤️ by Your Team
