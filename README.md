# Rural Telemedicine Platform

## Overview
Complete telemedicine platform designed for rural healthcare with operator authentication, AI health assessment, video consultation, doctor portal, and SMS prescription delivery system.

## 🚀 Features
- **Home Page**: Platform overview and navigation
- **Role-based Authentication**: Separate login for operators and doctors
- **Patient Management**: Registration and data collection by operators
- **Vitals Collection**: Blood pressure, sugar, temperature, oxygen saturation
- **Symptoms Assessment**: Visual symptom selection interface
- **AI Risk Assessment**: Automatic categorization (Simple/Moderate/High)
- **Video Consultation**: Recording for moderate cases with Supabase storage
- **Doctor Dashboard**: Case review and prescription management
- **Prescription System**: Medicine prescription with SMS alerts
- **Offline Support**: Data sync when connection restored
- **Multilingual**: Hindi, English, Punjabi support

## 🛠️ Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Supabase (Database, Storage, Authentication)
- **UI Components**: Radix UI with custom design system
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM

## 📋 Prerequisites
Before running this project on your laptop, ensure you have:

1. **Node.js** (version 18 or higher)
   ```bash
   # Check if Node.js is installed
   node --version
   
   # If not installed, download from https://nodejs.org/
   ```

2. **npm** (comes with Node.js)
   ```bash
   # Check npm version
   npm --version
   ```

3. **Git** (for cloning)
   ```bash
   # Check git version
   git --version
   ```

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
# Clone the project
git clone <your-repository-url>

# Navigate to project directory
cd rural-telemedicine-platform
```

### Step 2: Install Dependencies
```bash
# Install all project dependencies
npm install

# This will install all packages listed in package.json including:
# - React, TypeScript, Vite
# - Supabase client
# - UI components (Radix UI)
# - Form handling (React Hook Form)
# - And all other dependencies
```

### Step 3: Environment Configuration
The project uses Supabase for backend services. The configuration is already set up in:
- `src/integrations/supabase/client.ts` - Supabase client configuration
- `.env` - Environment variables (if needed for local development)

### Step 4: Start Development Server
```bash
# Start the development server
npm run dev

# The application will be available at:
# http://localhost:5173
```

### Step 5: Build for Production (Optional)
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🗂️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (buttons, cards, etc.)
│   ├── HomePage.tsx    # Landing page
│   ├── LoginPage.tsx   # Authentication page
│   ├── PatientDashboard.tsx         # Operator interface
│   ├── PatientRegistrationForm.tsx  # Patient registration
│   ├── VitalsEntryForm.tsx         # Vitals collection
│   ├── SymptomsForm.tsx            # Symptoms selection
│   ├── VideoRecordingComponent.tsx # Video consultation
│   ├── AssessmentResultComponent.tsx # AI assessment results
│   └── DoctorDashboard.tsx         # Doctor interface
├── contexts/           # React contexts
│   ├── AuthContext.tsx      # User authentication
│   └── LanguageContext.tsx  # Multilingual support
├── hooks/              # Custom React hooks
│   ├── useAIAssessment.tsx  # AI health assessment logic
│   ├── useVideoRecorder.tsx # Video recording functionality
│   └── useOfflineSync.tsx   # Offline data synchronization
├── integrations/       # External service integrations
│   └── supabase/       # Supabase configuration and types
├── lib/               # Utility functions
├── pages/             # Page components
└── main.tsx          # Application entry point
```

## 🔐 Demo Credentials

### For Operators (Data Entry):
- **Username**: OP001 or OP002
- **Password**: demo123
- **Role**: operator

### For Doctors (Case Review):
- **Username**: DOC001 or DOC002  
- **Password**: demo123
- **Role**: doctor

## 🎯 User Workflow

### 1. **Operator Workflow**:
```
Home Page → Login (Operator) → Patient Registration → Vitals Entry → 
Symptoms Selection → AI Assessment → Video Recording (if moderate) → 
Complete Case
```

### 2. **Doctor Workflow**:
```
Home Page → Login (Doctor) → Dashboard → Select Case → 
Review Patient Data → Watch Video (if available) → 
Write Prescription → Submit
```

### 3. **Patient Journey**:
```
Registration by Operator → Vitals Collection → Symptoms Assessment → 
AI Risk Evaluation → Video Recording (moderate cases) → 
Doctor Review → Prescription → SMS Alert
```

## 🏥 System Components

### **Authentication System**
- Role-based access control (operators vs doctors)
- Secure login with demo credentials
- Session management with localStorage

### **Patient Data Collection**
- **Registration**: Name, age, gender, contact, address
- **Vitals**: Blood pressure, sugar levels, temperature, oxygen saturation
- **Symptoms**: Visual selection interface with medical icons

### **AI Assessment Engine**
- **Simple Risk**: Direct prescription of general medicines
- **Moderate Risk**: Video consultation required
- **High Risk**: Immediate doctor attention needed

### **Video Consultation**
- WebRTC-based video recording
- Supabase storage integration
- Real-time preview during recording
- Automatic upload to secure cloud storage

### **Doctor Portal**
- Case dashboard with priority filtering
- Patient data review interface
- Video playback functionality
- Prescription writing system
- Case status management

### **Offline Capability**
- Local data storage during network outages
- Automatic synchronization when online
- Sync status indicator
- Data integrity preservation

## 🌐 Database Schema

### Tables:
- **operators**: Operator user data
- **doctors**: Doctor user data  
- **patients**: Patient information
- **medical_cases**: Case data with assessments
- **user_auth**: Authentication credentials

### Storage:
- **medical-videos**: Video consultation recordings

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use**:
   ```bash
   # Kill process on port 5173
   npx kill-port 5173
   
   # Or use different port
   npm run dev -- --port 3000
   ```

2. **Node modules issues**:
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**:
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   
   # Restart TypeScript server in VS Code
   Ctrl+Shift+P → "TypeScript: Restart TS Server"
   ```

4. **Camera/Video issues**:
   - Ensure browser permissions for camera/microphone
   - Use HTTPS in production for video recording
   - Check browser compatibility (Chrome/Firefox recommended)

## 🚀 Deployment

### For Production Deployment:
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables for production Supabase instance
4. Set up SSL certificate for video recording functionality

### Recommended Hosting:
- **Vercel**: Easy deployment with automatic builds
- **Netlify**: Static site hosting with form handling
- **AWS S3 + CloudFront**: Scalable solution
- **Firebase Hosting**: Google's hosting solution

## 📱 Mobile Compatibility
- Responsive design for tablets and mobile devices
- Touch-optimized interface for rural users
- Offline-first approach for low connectivity areas
- Visual icons for semi-literate users

## 🔒 Security Features
- Role-based access control
- Secure video storage with Supabase RLS policies
- HIPAA-compliant data handling practices
- Encrypted data transmission

## 📞 Support
For technical support or questions:
1. Check the troubleshooting section above
2. Review Supabase documentation for backend issues
3. Check browser console for JavaScript errors
4. Ensure all dependencies are properly installed

## 📄 License
This project is designed for rural healthcare improvement and educational purposes.

---

**Perfect for rural healthcare with low-bandwidth optimization and visual interface for semi-literate users.**