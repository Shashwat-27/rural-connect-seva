# Rural Telemedicine Platform

Complete telemedicine platform with home page, operator/doctor authentication, AI health assessment, video recording, and SMS prescription delivery.

## Demo Credentials
- **Operators**: OP001/OP002, Password: demo123
- **Doctors**: DOC001/DOC002, Password: demo123

## Features
✅ Home page with platform overview  
✅ Role-based authentication (operators & doctors)  
✅ Patient registration with visual icons  
✅ Vitals entry (BP, sugar, temperature, oxygen)  
✅ Symptoms selection with medical icons  
✅ AI assessment (simple/moderate/high risk)  
✅ Video recording for moderate cases  
✅ Doctor dashboard for case review  
✅ Prescription management  
✅ Offline-first with sync  
✅ Multilingual (Hindi, English, Punjabi)  

## Quick Start
```bash
npm install
npm run dev
```

## File Structure
- `src/components/` - All UI components
- `src/contexts/` - Auth & language contexts  
- `src/hooks/` - AI assessment, video recording, offline sync
- Database automatically configured with sample data

Perfect for rural healthcare with low-bandwidth optimization and visual interface for semi-literate users.