# 🇮🇳 JanSuvidha — Know Your Government Schemes

> A Dockerized Full-Stack Civic Tech Application for Government Scheme Eligibility Detection

## 📌 About

**JanSuvidha** (जन सुविधा) means *Citizen Convenience* in Hindi.

Over **800+ central government schemes** exist in India — but **80% of citizens miss out** because they simply don't know they qualify. JanSuvidha solves this by letting any citizen enter their basic profile and instantly discover every scheme they are eligible for — with direct application links.

> *"Enter your age, income, caste, state, and occupation — get your results in 30 seconds."*

---

## 📁 Project Structure

```
JanSuvidha/
├── docker-compose.yml          ← Runs all 3 services together
├── backend/
│   ├── server.js               ← Express API + Eligibility Engine
│   ├── schemes.json            ← 44 government schemes database
│   ├── seed.js                 ← Seeds MongoDB with schemes
│   ├── package.json
│   ├── .env                    ← Environment variables
│   └── Dockerfile              ← Backend container
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js        ← Login page
    │   │   ├── Register.js     ← Register page
    │   │   ├── Dashboard.js    ← Home dashboard
    │   │   ├── Checker.js      ← Eligibility checker ⭐
    │   │   ├── Browse.js       ← Browse all schemes
    │   │   ├── History.js      ← Search history
    │   │   └── NotFound.js     ← 404 page
    │   ├── components/
    │   │   └── Sidebar.js      ← Navigation sidebar
    │   ├── context/
    │   │   └── AuthContext.js  ← Auth state management
    │   ├── App.js              ← Routes
    │   └── App.css             ← Global styles
    ├── public/
    │   └── index.html
    ├── package.json
    └── Dockerfile              ← Frontend container
```

---

## 🌐 Running the App

### Option A — With Docker (Recommended — DevOps way 🐳)

Make sure Docker Desktop is running, then:

```bash
docker-compose up --build
```

This single command starts **all 3 services**:
- ✅ MongoDB on port 27017
- ✅ Backend API on port 5000
- ✅ Frontend on port 3000

Open **http://localhost:3000** — done!

### Option B — Without Docker (Manual)

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm start
```

Open **http://localhost:3000**

---

## 🔍 How It Works

1. User **registers/logs in**
2. Goes to **Check Eligibility** page
3. Fills in: Age, Annual Income, Gender, Caste/Category, State, Occupation
4. Backend **Eligibility Engine** checks all 44 schemes against the profile
5. Results shown **grouped by category** with benefit details and direct apply links
6. Search saved to **history** for future reference

---

## 📊 Scheme Categories Covered

| Category | Schemes | Examples |
|---|---|---|
| 🏠 Housing | 2 | PM Awas Yojana Urban & Gramin |
| 🏥 Health | 6 | Ayushman Bharat, JSSK, JSY |
| 🎓 Education | 7 | SC/ST/OBC/Minority Scholarships, PMRF |
| 💼 Employment | 5 | MGNREGA, PM Mudra, PMEGP |
| 👩 Women | 7 | Ujjwala, Sukanya Samriddhi, PMMVY |
| 🌾 Agriculture | 4 | PM-KISAN, KCC, PMFBY |
| 🛡️ Insurance | 3 | PMJJBY, PMSBY, APY |
| 👴 Senior Citizens | 2 | IGNOAPS, IGNWPS |
| ♿ Disability | 2 | IGNDPS, ADIP |
| 🚀 Startup | 4 | Startup India, Stand-Up India |
| 🛠️ Skill Development | 2 | PMKVY, DDU-GKY |
| **Total** | **44** | |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| DevOps | Docker, Docker Compose |
| Styling | Custom CSS (India-themed — Saffron + Green) |

---

## 🐳 Docker Architecture

```
┌─────────────────────────────────────────┐
│           docker-compose.yml            │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │ Frontend │  │ Backend  │  │ Mongo │ │
│  │  :3000   │→ │  :5000   │→ │ :27017│ │
│  │  React   │  │ Node.js  │  │  DB   │ │
│  └──────────┘  └──────────┘  └───────┘ │
│                                         │
│         jansuvidha-net (bridge)         │
└─────────────────────────────────────────┘
```

All 3 containers communicate over a shared Docker bridge network (`jansuvidha-net`).

---

## ✨ Key Features

- 🔍 **Instant Eligibility Check** — 44 schemes checked in milliseconds
- 🗂️ **Category Filtering** — Filter results by Housing, Health, Education etc.
- 📋 **Browse All Schemes** — Search and explore all schemes with full details
- 🕐 **Search History** — Last 10 searches saved per user
- 🔐 **Secure Auth** — JWT-based login/register with bcrypt password hashing
- 📱 **Mobile Responsive** — Works on phones with hamburger sidebar
- 🇮🇳 **India-themed UI** — Saffron and green color palette
- 🐳 **Fully Dockerized** — One command to run everything

---

## 🚀 Future Enhancements

- [ ] State-specific scheme filtering
- [ ] Multilingual support (Telugu, Hindi, Tamil)
- [ ] PDF report download of eligible schemes
- [ ] Email notifications for new schemes
- [ ] GitHub Actions CI/CD pipeline
- [ ] Deploy to cloud (AWS/Railway)

---

## 👩‍💻 Author

**Hruthika Veldi**
2303A51543
Department of Computer Science
SR University

---


*JanSuvidha — Because every citizen deserves to know what they're entitled to.* 🇮🇳
