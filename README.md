# Meetings Dashboard Application

This project is a full-stack application designed to manage meetings, featuring a React frontend with Tailwind CSS and a Django REST Framework backend.

## Project Structure

```
.
├── backend/
│   ├── meetings_project/  # Django project root
│   │   ├── api/           # Django app for meeting APIs
│   │   ├── meetings_project/ # Django project settings, urls etc.
│   │   └── manage.py
│   └── README.md          # Backend specific instructions
└── frontend/
    ├── public/
    ├── src/               # React application source
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── postcss.config.js
└── README.md              # This file (Overall project README)
```

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Python (v3.8 or later recommended)
- pip

## Setup and Running the Application

You will need two terminal windows to run both the backend and frontend servers simultaneously.

### 1. Backend Setup (Django REST Framework)

Detailed instructions for setting up and running the backend can be found in [`backend/README.md`](backend/README.md:1).

**Quick Start:**

1.  Navigate to the backend project directory:
    ```bash
    cd backend/meetings_project
    ```
2.  Create a virtual environment, activate it, and install dependencies:
    ```bash
    python -m venv venv
    # Windows: venv\Scripts\activate
    # macOS/Linux: source venv/bin/activate
    pip install Django djangorestframework django-cors-headers
    ```
    (A `requirements.txt` should ideally be used here. You can generate one after installing with `pip freeze > requirements.txt`)
3.  Apply database migrations:
    ```bash
    python manage.py makemigrations api
    python manage.py migrate
    ```
4.  Create a superuser (optional, for Django admin access):
    ```bash
    python manage.py createsuperuser
    ```
5.  Run the backend server (usually on `http://127.0.0.1:8000`):
    ```bash
    python manage.py runserver
    ```

### 2. Frontend Setup (React + Vite + Tailwind CSS)

1.  Navigate to the frontend project directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  Run the frontend development server (usually on `http://localhost:3000`):
    ```bash
    npm run dev
    # or
    # yarn dev
    ```

### Accessing the Application

- Once both servers are running, open your browser and go to `http://localhost:3000` (or the port specified by Vite for the frontend).
- The frontend will proxy API requests to the backend running on `http://127.0.0.1:8000`.

## Core Features

- User authentication (Login/Register/Logout).
- Sidebar navigation (Meetings section active).
- Meetings Dashboard:
  - Display list of meetings (Agenda, Status, Date, Start Time, URL).
  - "Add New" button.
- Status color-coding for meetings.
- Add/Edit Meeting Form.
- Full CRUD (Create, Read, Update, Delete) operations for meetings.

## Backend API Endpoints

Refer to [`backend/README.md`](backend/README.md:1) for a detailed list of API endpoints. The main endpoints are:

- `/api/register/` (POST)
- `/api/login/` (POST)
- `/api/logout/` (POST)
- `/api/meetings/` (GET, POST)
- `/api/meetings/<id>/` (GET, PUT, DELETE)

## Design

The application aims to replicate the design provided in the initial task description, focusing on the Meetings dashboard functionality.

## Important Notes

- Ensure the backend server is running before starting the frontend, as the frontend makes API calls to the backend.
- The `SECRET_KEY` in `backend/meetings_project/meetings_project/settings.py` is a placeholder and should be replaced with a strong, unique key for any production-like environment.
- `ALLOWED_HOSTS` in the Django settings is set to `*` for development convenience. This should be restricted in a production environment.
- CORS is configured to allow all origins for development. This should also be restricted in production.
