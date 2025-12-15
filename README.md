# 🏢 CoWork-TN

> A modern, multi-tenant coworking space management platform built with Next.js and Supabase

[![Next.js](https://img.shields.io/badge/Next.js-16.0.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [Authentication & Roles](#authentication--roles)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

CoWork-TN is a comprehensive platform for managing coworking spaces. It supports multiple spaces (multi-tenant), role-based access control, member management, booking systems, billing, and invoicing. The platform is fully internationalized with support for French and Arabic (RTL).

### Key Capabilities

- **Multi-tenant Architecture**: Support for multiple coworking spaces with complete data isolation
- **Role-Based Access Control**: Three distinct user roles with granular permissions
- **Member Management**: Complete member lifecycle management with subscriptions
- **Booking System**: Resource booking with calendar integration
- **Billing & Invoicing**: Automated invoice generation and payment tracking
- **Internationalization**: Multi-language support (French, Arabic with RTL)

---

## ✨ Features

- 🔐 **Authentication & Authorization**
  - Email/password authentication via Supabase Auth
  - Role-based access control (Super Admin, Space Admin, Coworker)
  - Protected routes with middleware
  - Session management

- 📊 **Dashboards**
  - Super Admin Dashboard: System-wide analytics and management
  - Space Admin Dashboard: Space-specific management
  - Member Dashboard: Personal bookings and invoices

- 👥 **Member Management**
  - Member profiles with subscription plans
  - QR code generation for members
  - Credit-based and unlimited plans
  - Member activity tracking

- 📅 **Booking System**
  - Resource booking (desks, meeting rooms, phone booths)
  - Calendar view with availability
  - Booking status management
  - Check-in functionality

- 💰 **Billing & Invoicing**
  - Automated invoice generation
  - Multiple payment statuses
  - Invoice PDF generation
  - Payment tracking

- 🌍 **Internationalization**
  - French (FR) and Arabic (AR) support
  - RTL layout for Arabic
  - Language switcher component

- 🎨 **UI/UX**
  - Modern, responsive design
  - Dark mode support
  - Accessible components (Radix UI)
  - Tailwind CSS styling

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16.0.5](https://nextjs.org/) (App Router)
- **React**: 19.2.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/) + [react-day-picker](https://react-day-picker.js.org/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

### Backend & Database
- **Backend**: Next.js API Routes + Server Actions
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **ORM/Query**: Supabase JavaScript Client
- **Row Level Security**: PostgreSQL RLS policies

### Development Tools
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linting**: ESLint + Next.js ESLint config
- **Code Formatting**: Prettier
- **Language**: JavaScript (ES6+)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher ([Installation guide](https://pnpm.io/installation))
- **Supabase Account**: Free tier works fine ([Sign up](https://supabase.com/))

### Optional but Recommended
- **Git**: For version control
- **VS Code**: With extensions (ESLint, Prettier, Tailwind CSS IntelliSense)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Taha-99/cowork-tn
cd mini_projet_web/cowork-tn
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the `cowork-tn` directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For production
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**How to get these values:**
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 4. Set Up the Database

#### Step 1: Initialize Database Schema

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Open `supabase/init.sql` from this project
4. Copy the entire content and paste it into the SQL Editor
5. Click **Run** to execute

This will create:
- All required tables (spaces, profiles, members, resources, bookings, invoices, etc.)
- Row Level Security (RLS) policies
- Helper functions
- Triggers for auto-updating timestamps
- Demo data (spaces and resources)

#### Step 2: Create User Accounts

1. In Supabase Dashboard, go to **Authentication** → **Users** → **Add User**
2. Create these three demo users (check "Auto Confirm User"):
   - Email: `super@cowork.tn` (Password: your choice)
   - Email: `admin@cowork.tn` (Password: your choice)
   - Email: `user@cowork.tn` (Password: your choice)

3. Go back to **SQL Editor**
4. Open `supabase/create_users.sql` from this project
5. Copy and paste the content, then click **Run**

This will assign the correct roles to each user.

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | ✅ Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) | ⚠️ Optional | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

⚠️ **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

---

## 🗄️ Database Setup

### Schema Overview

The database consists of the following main tables:

- **`spaces`**: Coworking spaces (tenants)
- **`profiles`**: User profiles with roles and space assignments
- **`members`**: Members with subscription plans
- **`resources`**: Bookable resources (desks, rooms, etc.)
- **`bookings`**: Member bookings
- **`invoices`**: Generated invoices
- **`activity_log`**: System activity tracking

### Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Isolate data by space (multi-tenant)
- Grant permissions based on user roles
- Prevent unauthorized access

### Helper Functions

- `public.is_super_admin()`: Check if current user is super admin
- `public.get_user_role()`: Get current user's role
- `public.get_user_space_id()`: Get current user's space_id
- `public.handle_new_user()`: Auto-create profile on signup
- `public.update_updated_at()`: Auto-update timestamps

---

## 📁 Project Structure

```
cowork-tn/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Internationalized routes
│   │   ├── app/                 # Space admin dashboard
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── my/                  # Member dashboard
│   │   └── super-admin/         # Super admin dashboard
│   ├── layout.js                # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components (Radix UI)
│   ├── dashboard-shell.js       # Admin dashboard layout
│   ├── coworker-shell.js        # Member dashboard layout
│   └── ...
│
├── lib/                         # Utility libraries
│   ├── auth.js                  # Authentication functions
│   ├── supabase.js              # Supabase client
│   ├── supabase-server.js       # Server-side Supabase client
│   ├── i18n.js                  # Internationalization config
│   └── ...
│
├── messages/                    # Translation files
│   ├── fr.json                  # French translations
│   └── ar.json                  # Arabic translations
│
├── supabase/                    # Database scripts
│   ├── init.sql                 # Database schema & setup
│   └── create_users.sql         # User creation script
│
├── i18n/                        # i18n configuration
│   ├── request.js               # Server-side i18n
│   └── routing.js               # Routing configuration
│
├── proxy.js                     # Next.js middleware (route protection)
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── package.json                 # Dependencies
```

---

## 🔐 Authentication & Roles

### Role System

The platform supports three roles with different access levels:

#### 1. Super Admin (`super_admin`)
- **Access**: Full system access
- **Capabilities**:
  - View and manage all spaces
  - View and manage all users
  - System-wide analytics
  - Billing and settings management
- **Dashboard**: `/super-admin`
- **No space restriction**

#### 2. Space Admin (`admin`)
- **Access**: Space-specific management
- **Capabilities**:
  - Manage their assigned space
  - Manage members in their space
  - Manage resources and bookings
  - View invoices and analytics for their space
- **Dashboard**: `/app`
- **Restricted to assigned `space_id`**

#### 3. Coworker (`coworker`)
- **Access**: Member-level access
- **Capabilities**:
  - View their own profile
  - Create and view their bookings
  - View their invoices
  - Manage their profile
- **Dashboard**: `/my`
- **Restricted to their own data**

### Authentication Flow

1. User logs in with email/password via `/login`
2. Supabase Auth authenticates the user
3. System fetches user profile with role
4. User is redirected based on role:
   - `super_admin` → `/super-admin`
   - `admin` → `/app`
   - `coworker` → `/my`

### Route Protection

Routes are protected via middleware (`proxy.js`):
- `/super-admin` → Only `super_admin`
- `/app` → `super_admin` or `admin`
- `/my` → All authenticated users

Unauthorized users are redirected to their appropriate dashboard or login page.

### Demo Accounts

After running `create_users.sql`, you can login with:

| Email | Password | Role | Dashboard |
|-------|----------|------|-----------|
| `super@cowork.tn` | (your password) | Super Admin | `/super-admin` |
| `admin@cowork.tn` | (your password) | Space Admin | `/app` |
| `user@cowork.tn` | (your password) | Coworker | `/my` |

---

## 💻 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

### Code Style

- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (configured)
- **JavaScript**: ES6+ features
- **Components**: React Server Components where possible

### Adding New Features

1. **New Page**: Add to `app/[locale]/` directory
2. **New Component**: Add to `components/` directory
3. **New Translation**: Add keys to `messages/fr.json` and `messages/ar.json`
4. **New Database Table**: Add schema to `supabase/init.sql` and create migration

### Internationalization

All text should be internationalized using `next-intl`:

```javascript
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('myNamespace');
  return <h1>{t('title')}</h1>;
}
```

Add translations to `messages/fr.json` and `messages/ar.json`.

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab
2. Import project in [Vercel](https://vercel.com/)
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically detect Next.js and configure everything.

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted (Docker)

### Environment Variables in Production

Make sure to set all environment variables in your hosting platform's dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (if needed)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Supabase public env vars are missing"

**Solution**: Create `.env.local` file with your Supabase credentials (see [Environment Variables](#environment-variables)).

#### 2. "No rows returned" when running `create_users.sql`

**Solution**: Users must be created in Supabase Dashboard first. The SQL only assigns roles, it doesn't create auth users.

#### 3. "Function Search Path Mutable" warning

**Solution**: This is fixed in `init.sql`. All functions have `SET search_path = public, pg_temp` configured.

#### 4. Login redirects to wrong page

**Solution**: Check user's role in database:
```sql
SELECT email, role FROM public.profiles WHERE email = 'user@example.com';
```

#### 5. RLS policies blocking queries

**Solution**: Verify user has correct role and `space_id` (for admins/coworkers). Super admins should have `role = 'super_admin'` and `space_id = NULL`.

### Database Reset

To reset the database:

1. In Supabase Dashboard → SQL Editor
2. Run: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
3. Re-run `init.sql`
4. Re-run `create_users.sql`

⚠️ **Warning**: This deletes all data!

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Radix UI Documentation](https://www.radix-ui.com/)

---

## 📝 License

This project is private and proprietary.

---

## 👥 Contributing

For developers working on this project:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
5. Ensure all linting passes: `pnpm lint`

---

## 📧 Support

For questions or issues, contact the development team.

---

**Built with ❤️ using Next.js and Supabase**
