# 🏥 SANITAS HMIS - Hospital Management Information System

**Neudebri Health** - A comprehensive, production-grade **HMIS (Hospital Management Information System)** built on SANITAS standards for professional healthcare management.

## 🎯 System Overview

Neudebri is a complete enterprise-level healthcare management platform designed to:
- **Manage patient care** across OPD, IPD, and Emergency departments
- **Streamline clinical workflows** with specialized consoles for different user roles
- **Track real-time hospital operations** including beds, wards, and staff allocation
- **Facilitate secure communication** between healthcare providers and patients
- **Generate comprehensive reports** and analytics for hospital management

---

## 🏗️ HMIS Core Modules

### 1. **OPD Console** (Out-Patient Department)
Manages day-to-day outpatient consultations and follow-ups.

**Key Features:**
- Real-time consultation queue management
- Doctor availability and scheduling
- Patient check-in workflows
- Prescription generation
- Department-wise patient filtering
- Consultation status tracking (Scheduled → In Progress → Completed)

**Users:** Doctors, Admin

### 2. **IPD Console** (In-Patient Department)
Manages hospital admissions, ward assignments, and patient care.

**Key Features:**
- Ward and bed management
- Patient admission and discharge tracking
- Real-time bed occupancy monitoring
- Ward-wise patient allocation
- Patient transfer between wards
- Nursing care assignments
- Vitals monitoring

**Users:** Nurses, Doctors, Admin

### 3. **Emergency/Casualty Console**
Manages emergency patients and critical care cases.

**Key Features:**
- Emergency patient triage system
- Triage level classification:
  - 🔴 **Critical** - Life-threatening emergencies
  - 🟠 **Urgent** - Serious conditions requiring immediate attention
  - 🟡 **Semi-Urgent** - Moderate conditions
  - 🟢 **Non-Urgent** - Minor conditions
- Real-time waiting time tracking
- Doctor assignment for emergency cases
- Critical alert management
- Emergency resource allocation

**Users:** Nurses, Doctors, Admin

---

## 👥 User Roles & Access

### **Patient** 👤
- View personal health records
- Book and manage appointments
- View prescriptions and lab results
- Send messages to healthcare providers
- Virtual consultations
- Access medical history

### **Doctor** 👨‍⚕️
- **OPD Console Access** - Manage outpatient consultations
- Schedule and manage patient appointments
- Write prescriptions and order lab tests
- Record patient observations and notes
- Manage nurse assignments
- Virtual consultations
- Full patient medical records access

### **Nurse** 👩‍⚕️
- **IPD Console Access** - Manage inpatient ward care
- **Emergency Console Access** - Handle emergency cases
- Record vital signs and patient observations
- Manage wound care and assessments
- Patient communication
- Medication administration tracking
- Nursing care documentation

### **Administrator** 👨‍💼
- **Full System Access** - All consoles and modules
- User management (Doctors, Nurses, Patients)
- Department and staff management
- Finance and billing administration
- System configuration
- Report generation and analytics
- Hospital operations oversight

---

## 📊 Dashboard & Analytics

### Executive Dashboard
- Hospital KPIs and statistics
- Patient volume and trends
- Revenue tracking
- Staff utilization metrics
- Department performance analytics

### Department Dashboard
- Department-specific metrics
- Patient queue status
- Staff allocation and availability
- Resource utilization

### Personal Dashboard
- Individual staff schedule
- Patient queue and assignments
- Pending tasks and alerts
- Messages and notifications

---

## 💊 Clinical Features

### Patient Management
- Complete patient profiles with demographics
- Medical history and previous records
- Vital signs tracking with visual charts
- Health records (diagnoses, conditions, allergies)
- Document management

### Appointment System
- Schedule appointments with preferred doctors
- Doctor availability management
- Appointment reminders
- Cancellation and rescheduling
- No-show tracking

### Prescription Management
- E-prescription generation
- Refill request management
- Prescription history tracking
- Pharmacy integration

### Lab Management
- Test ordering
- Result tracking and reporting
- Historical analysis
- Test scheduling

### Wound Care Tracking
- Wound assessment documentation
- Treatment tracking
- Healing progress monitoring

### Virtual Care
- Secure video consultations
- Telemedicine sessions
- Remote patient monitoring

---

## 💰 Finance & Administration

### Billing System
- Patient billing and invoicing
- Insurance claim management
- Payment tracking and reconciliation
- Billing reports and analytics

### Staff Management
- Doctor and nurse profiles
- Specialization tracking
- License management
- Department assignments

### Department Management
- Department organization
- Resource allocation
- Performance tracking

---

## 🔐 Security & Compliance

✅ **HIPAA Compliance** - Healthcare data protection standards  
✅ **Role-Based Access Control (RBAC)** - User permission management  
✅ **Data Encryption** - Secure transmission and storage  
✅ **Audit Logging** - Complete activity tracking  
✅ **Secure Messaging** - HIPAA-compliant communication  
✅ **Backup & Disaster Recovery** - Data protection measures  

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 12+ (optional, uses in-memory storage by default)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd neudebri-health-fullstack

# Install dependencies
npm install

# Start development server
npm run dev
```

**Available at:** `http://localhost:5000`

### Build for Production

```bash
# Build client and server
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
neudebri-health-fullstack/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── dashboard.tsx    # Main dashboard
│   │   │   ├── opd-console.tsx  # OPD module
│   │   │   ├── ipd-console.tsx  # IPD module
│   │   │   ├── emergency-console.tsx  # Emergency module
│   │   │   ├── patients.tsx
│   │   │   ├── doctors.tsx
│   │   │   ├── nurses.tsx
│   │   │   └── ...
│   │   ├── components/       # Reusable UI components
│   │   └── lib/             # Utility functions
│   └── index.html
├── server/                    # Express Backend
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   ├── static.ts            # Static file serving
│   └── storage.ts           # Data storage layer
├── shared/                    # Shared types and schemas
│   └── schema.ts
├── render.yaml              # Render deployment config
├── vercel.json              # Vercel deployment config
└── package.json
```

---

## 🔗 API Endpoints

### Authentication
- `GET /api/auth/demo/:role` - Demo user login
- `POST /api/auth/login` - User login

### Patients
- `GET /api/users/patients` - List all patients
- `GET /api/patient/:id` - Get patient details
- `POST /api/patients` - Create new patient

### Doctors
- `GET /api/users/doctors` - List all doctors
- `GET /api/doctor/:id` - Get doctor details

### Nurses
- `GET /api/nurses` - List all nurses
- `GET /api/nurse/:id` - Get nurse details

### Appointments
- `GET /api/appointments` - List appointments
- `GET /api/appointments/upcoming` - Upcoming appointments
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment

### Health Records
- `GET /api/health-records` - Get health records
- `POST /api/health-records` - Create health record

### Vital Signs
- `GET /api/vital-signs` - Get vital signs
- `POST /api/vital-signs` - Record vital signs

### Lab Results
- `GET /api/lab-results` - Get lab results
- `POST /api/lab-results` - Create lab result

### Prescriptions
- `GET /api/prescriptions` - List prescriptions
- `POST /api/prescriptions` - Create prescription

### Messaging
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

---

## 📱 Deployment

### **Backend: Render.com**
```bash
# Configuration
Build Command: npm run build
Start Command: npm start
Environment: production
```

### **Frontend: Vercel**
```bash
# Configuration
Build Command: npm run build:client
Output Directory: dist/public
Environment: VITE_API_BASE=https://your-render-backend.com
```

---

## 🎯 Demo Users

### Patient
- **Username:** patient
- **Password:** password
- **Role:** Patient

### Doctor
- **Username:** doctor
- **Password:** password
- **Role:** Doctor

### Admin
- **Username:** admin
- **Password:** password
- **Role:** Administrator

---

## 📚 Documentation

- [SANITAS HMIS Specification](./SANITAS_HMIS_SPECIFICATION.md)
- [Deployment Instructions](./DEPLOYMENT_INSTRUCTIONS.md)
- [Design Guidelines](./design_guidelines.md)

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Wouter** - Routing
- **TanStack React Query** - Data fetching

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime
- **TypeScript** - Type safety
- **Drizzle ORM** - Database
- **Zod** - Validation

### Deployment
- **Render.com** - Backend hosting
- **Vercel** - Frontend hosting

---

## 📈 Performance

- ⚡ Fast page loads
- 📱 Mobile-responsive
- 🔄 Real-time updates
- 🎯 Optimized bundle size
- 📊 Efficient data fetching

---

## 🤝 Contributing

This is a professional HMIS system. For contributions or issues, please follow standard Git workflow practices.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support

For questions or support, please refer to the documentation or contact the development team.

---

**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Last Updated:** January 23, 2026


3. **Development Setup**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

**Demo Credentials (Development)**
- **Patient**: username: `patient`, password: `password`
- **Doctor**: username: `doctor`, password: `password`  
- **Admin**: username: `admin`, password: `password`

### Build for Production

```bash
npm run build
```

This creates optimized bundles in the `dist/` directory.

### Running Production Build

```bash
npm start
```

## 📁 Project Structure

```
neudebri-health-fullstack/
├── client/                 # React frontend application
│   └── src/
│       ├── pages/         # Page components for each feature
│       ├── components/    # Reusable UI components
│       ├── lib/          # Utilities and context
│       ├── hooks/        # Custom React hooks
│       └── App.tsx       # Main application component
├── server/                # Express backend server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data storage (in-memory/database)
│   └── vite.ts          # Vite dev server setup
├── shared/                # Shared code between client and server
│   └── schema.ts         # Database schema and types
├── script/
│   └── build.ts          # Build script
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/neudebri

# Server
NODE_ENV=development
PORT=5000

# Application
VITE_API_BASE=http://localhost:5000
```

### Database Setup

For production with PostgreSQL:

```bash
# Push schema to database
npm run db:push
```

## 📊 Dashboard Features

### Patient Dashboard
- Upcoming appointments
- Recent health records
- Current vital signs
- Active prescriptions
- Lab results status
- Messages from healthcare providers

### Doctor Dashboard
- Patient list
- Appointment schedule
- Patient vital signs overview
- Pending prescriptions and lab orders
- Messages from patients

### Admin Dashboard
- Total patient count
- Total doctor count
- Appointments metrics
- Pending lab results
- System-wide messaging
- Revenue and billing overview

## 🔐 Security Features

- **HIPAA Compliant** - Follows HIPAA regulations for healthcare data
- **Secure Authentication** - Role-based access control
- **Encrypted Messaging** - End-to-end encryption for patient-doctor communication
- **Data Privacy** - Patient data isolated by role and permissions
- **Audit Logging** - Track all data access and modifications

## 🎨 User Interface

Built with:
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Recharts** - Data visualization
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful icon set

### Responsive Design
- Mobile-first approach
- Fully responsive layouts
- Touch-friendly interfaces
- Dark/Light theme support

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/demo/:role` - Demo user login
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/patients` - Get all patients
- `GET /api/users/doctors` - Get all doctors
- `GET /api/users/contacts` - Get user contacts

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment

### Health Records
- `GET /api/health-records` - Get health records
- `POST /api/health-records` - Create record
- `GET /api/vital-signs` - Get vital signs
- `POST /api/vital-signs` - Record vital signs

### Prescriptions
- `GET /api/prescriptions` - Get prescriptions
- `POST /api/prescriptions` - Create prescription
- `POST /api/prescriptions/:id/refill` - Request refill

### Lab Results
- `GET /api/lab-results` - Get lab results
- `POST /api/lab-results` - Create lab result

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `PATCH /api/messages/:id/read` - Mark as read

### Finance
- `GET /api/finance/billing` - Get billing records
- `POST /api/finance/billing` - Create billing record
- `GET /api/finance/insurances` - Get insurance providers
- `POST /api/finance/payments` - Record payment

### Wound Care
- `GET /api/wound-care` - Get wound records
- `POST /api/wound-care` - Create wound record

### Departments
- `GET /api/departments` - Get departments
- `POST /api/departments` - Create department

## 📱 Pages & Features

### Patient Pages
- **Dashboard** - Overview of health status and upcoming appointments
- **Appointments** - Book, view, and manage appointments
- **Health Records** - View medical history and vital signs
- **Prescriptions** - View active prescriptions and request refills
- **Lab Results** - View and download lab test results
- **Virtual Care** - Connect with doctors via video consultation
- **Wound Care** - Track wound treatment and recovery
- **Messages** - Communicate securely with healthcare providers
- **Settings** - Manage profile and preferences

### Doctor Pages
- **Dashboard** - Patient overview and appointment schedule
- **Appointments** - Manage and schedule patient appointments
- **My Patients** - View patient list and health records
- **Virtual Care** - Conduct video consultations
- **Prescriptions** - Write and manage prescriptions
- **Lab Results** - Order and review lab tests
- **Messages** - Communicate with patients
- **Wound Care** - Document wound assessments
- **Nurses** - Manage nursing staff

### Admin Pages
- **Dashboard** - System-wide metrics and KPIs
- **Patients** - Manage all registered patients
- **Doctors** - Manage healthcare providers
- **Departments** - Organize medical departments
- **Nurses** - Manage nursing staff
- **Appointments** - Monitor all appointments
- **Finance** - Billing and revenue management
- **Messages** - System messaging
- **Settings** - System configuration

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t neudebri-health .
docker run -p 5000:5000 neudebri-health
```

### Vercel Deployment
```bash
vercel deploy
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🧪 Testing

```bash
# Type checking
npm run check

# Build
npm run build
```

## 📚 Technologies Used

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router (Wouter)
- React Query
- Recharts
- Framer Motion

### Backend
- Express.js
- Node.js
- Drizzle ORM
- PostgreSQL
- TypeScript

### Infrastructure
- Vite (Build tool)
- PostCSS
- Autoprefixer

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 📞 Support

For support and documentation:
- View [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Check [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md)
- Review [DEPLOYMENT_SETTINGS.md](./DEPLOYMENT_SETTINGS.md)

## 🎯 Roadmap

### Upcoming Features
- Advanced analytics and reporting
- AI-powered health insights
- Mobile app (React Native)
- Integration with EHR systems
- Appointment reminders via SMS/Email
- Prescription automation
- Insurance claim processing
- Telemedicine enhancements

## 🔗 Links

- [Demo](http://localhost:5000) - Local development
- [Documentation](./docs) - Full documentation
- [API Reference](./server/routes.ts) - API endpoint details

---

**Neudebri Health Monitoring System** - Transforming Healthcare Delivery ❤️
