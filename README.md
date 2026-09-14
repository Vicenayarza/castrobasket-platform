# 🏀 Castrobasket Platform

**Web platform for basketball club management**

Castrobasket Platform is a web application developed to centralize and simplify the management of a basketball club, providing different interfaces and functionalities for administrators, referees, teams and spectators.

The platform combines a modern React frontend with Firebase services to provide authentication, data management and backend functionality.

---

## 🚀 Features

### 🏆 Competition management

* Match management and scheduling
* Results and standings
* Playoff management
* Competition configuration
* Automatic standings calculations and adjustments

### 👥 User roles

* Administrator interface
* Referee interface
* Role-based access to application areas
* Protected routes and authenticated users

### 📊 Public platform

* Public home page
* Match information
* Results
* Team information
* Competition standings

### 📺 Match & TV interface

* Dedicated TV/screen view for displaying match information
* Live match status
* Public match information

### 🛠️ Administration

* Centralized management interface
* Match administration
* Competition and standings management
* Team and match information management

---

## 🧩 Technology Stack

### Frontend

* **React**
* **Vite**
* **JavaScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Radix UI**

### Backend & Cloud Services

* **Firebase Authentication**
* **Cloud Firestore**
* **Firebase Storage**
* **Firebase Cloud Functions**

### Development

* **Node.js**
* **npm**
* **ESLint**
* **Git / GitHub**

---

## 🏗️ Architecture

The application follows a client-centric architecture supported by Firebase services:

```text
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │ React + Vite        │
                    │ Tailwind + shadcn   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │ Firebase   │   │ Firestore  │   │  Storage   │
       │    Auth    │   │ Database   │   │   Files    │
       └────────────┘   └────────────┘   └────────────┘
                               │
                               ▼
                       ┌───────────────┐
                       │ Cloud         │
                       │ Functions     │
                       └───────────────┘
```

---

## 📁 Project Structure

```text
castrobasket-platform/
│
├── functions/                  # Firebase Cloud Functions
│
├── public/                     # Static assets
│
├── src/
│   ├── components/             # Reusable UI components
│   ├── config/                 # Application configuration
│   ├── pages/                  # Application pages
│   └── services/               # Business logic and Firebase services
│
├── firebase.json               # Firebase configuration
├── .firebaserc                 # Firebase project configuration
├── package.json
└── vite.config.js
```

---

## 🔐 Authentication & Access Control

The application uses **Firebase Authentication** for user authentication and protected application routes.

Different application areas are available depending on the user's role, including:

* Administrator
* Referee
* Public users

Protected routes prevent unauthenticated users from accessing restricted areas of the application.

> A dedicated security review and hardening phase is planned for the project, including a deeper review of Firebase security rules, authorization and application security.

---

## 🎯 Project Goals

The main objectives of the platform are:

* Reduce manual management of competitions and matches.
* Centralize club information.
* Provide different interfaces according to user roles.
* Make competition information easily accessible to players, coaches and spectators.
* Create a scalable technical foundation for future club management features.

---

## 📌 Project Status

**Active development**

The platform is currently being developed and improved with new competition management, administration and user-facing features.

---

## 👨‍💻 Author

**Vicente Ayarza**

Computer Engineer · MSc in Cybersecurity

GitHub: [@Vicenayarza](https://github.com/Vicenayarza)

---

## 📄 License

This project is currently intended as a personal/portfolio project.
