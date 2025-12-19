# Neudebri Health Monitoring System

A comprehensive, full-featured health monitoring system built with modern web technologies. Neudebri is a complete healthcare management platform that includes patient management, appointments, electronic health records, prescriptions, lab results, virtual care, and more.

## 🏥 Features

### Core Healthcare Features
- **Patient Management** - Complete patient profiles with demographics, medical history, and health metrics
- **Health Records** - Secure electronic health records (EHR) with full medical history
- **Vital Signs Monitoring** - Real-time vital signs tracking with visual charts and trends
- **Appointments** - Comprehensive appointment scheduling with doctor-patient matching
- **Prescriptions** - E-prescriptions with refill management and pharmacy integration
- **Lab Results** - Lab test ordering, result tracking, and historical analysis
- **Virtual Care** - Secure video consultations and telemedicine sessions
- **Wound Care** - Specialized wound assessment and treatment tracking
- **Messages** - Secure HIPAA-compliant messaging between healthcare providers and patients
- **Finance & Billing** - Invoice management, payment tracking, and insurance handling

### Administrative Features
- **Dashboard** - Comprehensive analytics and KPI tracking
- **Staff Management** - Manage doctors, nurses, and medical staff
- **Department Management** - Organize services and departments
- **Patient Management** - View and manage all patients
- **Reporting** - Generate reports on healthcare metrics

### User Roles
- **Patient** - Access personal health records, book appointments, view test results
- **Doctor** - Manage patients, write prescriptions, order tests, schedule appointments
- **Nurse** - Assist with patient care, wound care documentation
- **Admin** - System-wide management and reporting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL 12+ (for production)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd neudebri-health-fullstack
```

2. **Install dependencies**
```bash
npm install
```

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
