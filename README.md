# Setup Instructions for Testing the Org-Chart Assessment Locally

This guide provides step-by-step instructions to set up and test the Org-Chart project on your local machine. The application consists of a FastAPI backend and a React frontend, using SQLite as the database.

## Prerequisites
Before you begin, ensure you have the following installed on your system:

- **Python (>=3.8)** – Required for the FastAPI backend  
- **Node.js (>=18.x)** – Required for the React frontend  
- **Git** – To clone the repository  

---

## Step 1: Clone the Repository
Open a terminal and run:

```sh
git clone https://github.com/adityaranjan06/org-chart.git
cd org-chart
```

---

## Step 2: Set Up the Backend (FastAPI)

### 1. Navigate to the Backend Directory
```sh
cd backend
```

### 2. Create a Virtual Environment
```sh
python -m venv venv
```
Activate it:

- **Windows:**
  ```sh
  venv\Scripts\activate
  ```
- **Mac/Linux:**
  ```sh
  source venv/bin/activate
  ```

### 3. Install Dependencies
```sh
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the backend directory:

```sh
touch .env
```

Open the file and add:

```ini
FRONTEND_ORIGIN=http://localhost:3000
SECRET_KEY=mysecretkey
DATABASE_URL=sqlite:///./backend.db
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

ADMIN_EMAIL=xxxxxxxx
ADMIN_PASSWORD=xxxxxxxxx
REQUIRED_PERFORMANCE_CATEGORIES=Technical Skills,Communication,Leadership,Initiative
```

### 5. Run the Backend Server
```sh
uvicorn main:app --reload
```

Your FastAPI backend should now be running at:
👉 **http://127.0.0.1:8000**

---

## Step 3: Set Up the Frontend (React)

### 1. Navigate to the Frontend Directory
Open a new terminal and run:

```sh
cd frontend
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the frontend directory:

```sh
touch .env
```

Open the file and add:

```ini
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 4. Start the Frontend Server
```sh
npm start
```

Your React frontend should now be running at:
👉 **http://localhost:5173**

---

## Step 4: Test the Application

1. Open **http://localhost:5173** in your browser.
2. Sign up/log in as an admin.
3. Add employees and build the organization chart interactively.
