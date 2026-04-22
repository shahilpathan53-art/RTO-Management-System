# 🚀 RTO Management System - Running Guide

Follow these steps to run the project on your machine.

## 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Installed and running locally)

---

## 2. Backend Setup (Server)
Open a terminal and navigate to the `server` folder:

```bash
cd server
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
Ensure the `.env` file in the `server` directory has the following content:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/rto_db
JWT_SECRET=mysecretkey1234567890
node_env=development
```

### Seed the Database (Important)
Run this command once to create the Admin and Officer accounts:
```bash
node seed.js
```

### Start the Backend Server
```bash
npm run dev
```
The server will start on [http://localhost:5000](http://localhost:5000).

---

## 3. Frontend Setup (Client)
Open a **new** terminal and navigate to the `client` folder:

```bash
cd client
```

### Install Dependencies
```bash
npm install
```

### Start the Frontend Server
```bash
npm run dev
```
The application will be available at [http://localhost:5173](http://localhost:5173).

---

## 🔑 Login Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@rto.gov.in` | `Admin@123` |
| **Officer** | `officer@rto.gov.in` | `Officer@123` |
| **User** | *Register a new account* | - |
