BACKEND - https://pathrise-project.onrender.com

---

FRONTEND - https://pathrise-project.vercel.app/login

---

MONGO_URL - mongodb+srv://raonitinkumar06_db_user:LvspPcGND7W7Rnic@pathrise.splyy11.mongodb.net/?appName=pathRise


# Pathrise – Smart Job & Internship Portal


---

## 1. Project Title
**Pathrise – Smart Job & Internship Portal**

---

## 2. Problem Statement
Finding relevant job opportunities or internships is often a time-consuming process for students and fresh graduates. Traditional job boards can be cluttered, generic, or not personalized to the user's skills, making it hard to find suitable positions.  

**Pathrise** aims to solve this problem by creating a platform where candidates can explore internships and jobs based on their skills, interests, and location. Employers can post positions, manage applications, and track candidate responses efficiently, making the recruitment process smoother and more effective.

---

## 3. System Architecture

**Structure:**  


**Stack:**  
- **Frontend:** React.js with React Router for smooth page navigation  
- **Backend:** Node.js + Express.js to handle RESTful APIs  
- **Database:** MongoDB (non-relational)  
- **Authentication:** JWT-based login/signup with role-based access (Candidate, Employer, Admin)  

**Hosting:**  
- Frontend → Vercel  
- Backend → Render  
- Database → MongoDB Atlas  

---

## 4. Key Features

| Category | Features |
|----------|----------|
| **Authentication & Authorization** | Secure signup, login, and logout with roles for candidates, employers, and admins |
| **CRUD Operations** | Add, view, update, and delete job or internship postings and applications |
| **Search, Filter, Sort & Pagination** | Search postings by title, company, or skills; filter by location, type, or salary; sort by date or relevance; paginate long lists |
| **Application Management** | Candidates can apply to jobs; employers can review, shortlist, and respond to applications |
| **Dashboard** | Separate dashboards for candidates, employers, and admins to manage tasks, applications, and postings |
| **Frontend Routing** | Pages: Home, Login, Dashboard, Job Listings, Application Status, Profile |
| **Hosting** | Fully deployed online for candidates and employers to access from anywhere |

---

## 5. Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React.js, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (MongoDB Atlas) |
| **Authentication** | JSON Web Token (JWT) |
| **Hosting** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## 6. API Overview

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/signup` | POST | Register a new user (Candidate/Employer/Admin) | Public |
| `/api/auth/login` | POST | Authenticate user and generate token | Public |
| `/api/jobs` | GET | Fetch all job/internship postings | Authenticated |
| `/api/jobs/:id` | POST | Create new job posting | Employer/Admin |
| `/api/jobs/:id` | PUT | Update job posting | Employer/Admin |
| `/api/jobs/:id` | DELETE | Delete job posting | Admin only |
| `/api/applications` | POST | Candidate applies to a job | Authenticated |
| `/api/applications/:id` | GET | Employer views applications | Employer/Admin |

---

## 7. Conclusion
Pathrise is designed to simplify the job and internship search process for candidates while providing employers and admins a seamless way to manage postings and applications. With a role-based dashboard, advanced search, and CRUD operations, it enhances efficiency, personalization, and user experience in the recruitment ecosystem.

---

## 8. Author
**Nitin Kumar**  

