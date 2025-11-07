# 🔐 Verification System

> A modern, secure verification platform for email and phone number validation with elegant UI and robust backend integration.

## ✨ Features

🚀 **Multi-Step Verification Flow**

- Contact input (email/phone) with real-time validation
- 6-digit verification code generation and delivery
- Secure dashboard access after verification

📧 **Email Integration**

- Beautiful HTML email templates with verification codes
- SMTP configuration with Nodemailer
- Real-time email delivery status

🔒 **Security Features**

- Rate limiting (max 5 attempts per verification)
- Code expiration (10 minutes)
- Input validation and sanitization
- Secure database operations with Supabase

🎨 **Modern UI/UX**

- Responsive design with Tailwind CSS
- Smooth animations and transitions
- Lucide React icons for beautiful interfaces
- Mobile-first approach

## 🛠️ Tech Stack

### Frontend

- **⚛️ React 19** - Modern React with hooks and components
- **📘 TypeScript** - Type-safe development
- **⚡ Vite** - Lightning-fast build tool and dev server
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🎯 Lucide React** - Beautiful SVG icons

### Backend & Database

- **🗄️ Supabase** - PostgreSQL database with real-time capabilities
- **📧 Node.js + Express** - Email server for verification codes
- **📮 Nodemailer** - Email delivery service
- **🔧 TypeScript** - Full-stack type safety

### Development Tools

- **🔍 ESLint** - Code linting and formatting
- **📦 PostCSS** - CSS processing
- **🔄 Concurrently** - Run multiple scripts simultaneously

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- SMTP email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd myproject
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `env.example` to `.env` and configure:

   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # SMTP Configuration
   VITE_SMTP_HOST=smtp.gmail.com
   VITE_SMTP_PORT=587
   VITE_SMTP_USER=your_email@gmail.com
   VITE_SMTP_PASS=your_app_password
   VITE_FROM_NAME=Your App Name
   VITE_FROM_EMAIL=your_email@gmail.com
   ```

4. **Database Setup**
   Create a `verification_requests` table in Supabase:
   ```sql
   CREATE TABLE verification_requests (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     contact TEXT NOT NULL,
     contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'phone')),
     code TEXT NOT NULL,
     is_verified BOOLEAN DEFAULT FALSE,
     attempts INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 minutes'),
     verified_at TIMESTAMP WITH TIME ZONE
   );
   ```

### 🏃‍♂️ Running the Application

**Development with email server:**

```bash
npm run dev-with-emails
```

**Frontend only:**

```bash
npm run dev
```

**Email server only:**

```bash
npm run email-server
```

**Build for production:**

```bash
npm run build
```

## 📁 Project Structure

```
📦 Verification System
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 components/         # Reusable UI components
│   │   └── VerificationInput.tsx
│   ├── 📁 lib/               # Library configurations
│   │   └── supabase.ts       # Supabase client setup
│   ├── 📁 pages/             # Application pages
│   │   ├── ContactInputPage.tsx    # Contact entry form
│   │   ├── VerificationPage.tsx    # Code verification
│   │   └── DashboardPage.tsx       # Post-verification dashboard
│   ├── 📁 services/          # Business logic
│   │   └── verificationService.ts  # Verification API calls
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── server.js                 # Express email server
├── package.json              # Dependencies and scripts
└── README.md                # You are here! 📍
```

## 🔧 Available Scripts

| Script                    | Description                             |
| ------------------------- | --------------------------------------- |
| `npm run dev`             | 🚀 Start development server             |
| `npm run build`           | 📦 Build for production                 |
| `npm run preview`         | 👀 Preview production build             |
| `npm run lint`            | 🔍 Run ESLint                           |
| `npm run email-server`    | 📧 Start email server                   |
| `npm run dev-with-emails` | 🚀 Start both frontend and email server |

## 🌟 Key Features Explained

### 🔐 Verification Flow

1. **Contact Input** - User enters email or phone number
2. **Code Generation** - System generates 6-digit verification code
3. **Code Delivery** - Code sent via email (phone SMS coming soon)
4. **Verification** - User enters code to verify identity
5. **Dashboard Access** - Secure access granted after verification

### 📧 Email System

- Beautiful HTML email templates
- Automatic code expiration (10 minutes)
- SMTP error handling and retry logic
- Development and production email configurations

### 🔒 Security Measures

- Input validation for emails and phone numbers
- Rate limiting (5 attempts per verification request)
- Secure code storage and verification
- Automatic cleanup of expired codes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Supabase** for the excellent backend-as-a-service
- **Tailwind CSS** for the beautiful styling system
- **Vite** for the lightning-fast development experience

---

<div align="center">

**Built with ❤️ and ☕ by Athur**

🌟 If you found this project helpful, please give it a star!

</div>
