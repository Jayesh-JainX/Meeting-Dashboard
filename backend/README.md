# Meetings API Backend

This directory contains the Django REST Framework backend for the Meetings application.

## Prerequisites

- Python 3.8+
- pip (Python package installer)
- Virtual environment (recommended)

## Setup and Running the Backend

1.  **Navigate to the `backend/meetings_project` directory:**

    ```bash
    cd backend/meetings_project
    ```

2.  **Create and activate a virtual environment (optional but recommended):**

    ```bash
    python -m venv venv
    # On Windows
    venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies from `requirements.txt`:**
    The `backend/meetings_project/requirements.txt` file lists all necessary Python packages.

    ```bash
    pip install -r requirements.txt
    ```

    This file includes:

    - `Django`
    - `djangorestframework`
    - `django-cors-headers`
    - `gunicorn` (for serving the application)
    - `dj-database-url` (for parsing `DATABASE_URL` from Railway)
    - `psycopg2-binary` (PostgreSQL adapter, commonly used with Railway databases)
    - `whitenoise[brotli]` (for serving static files efficiently)
    - `python-dotenv` (optional, for loading `.env` files in local development)

    If you add or change dependencies, update `requirements.txt`:

    ```bash
    pip freeze > requirements.txt
    ```

    Ensure this file is always up-to-date and committed to your repository.

4.  **Local Environment Variables (Optional but Recommended for Local Dev):**

    - In the `backend/meetings_project` directory, you can create a `.env` file for local development by copying from `.env.example`:
      ```bash
      cp .env.example .env
      ```
    - Edit the `.env` file to set your local `DJANGO_SECRET_KEY` and other development-specific variables if needed. **DO NOT commit your actual `.env` file.**
    - The `settings.py` is configured to optionally load variables from `.env` if `python-dotenv` is installed and you uncomment the relevant lines in `settings.py`.

5.  **Apply database migrations:**

    ```bash
    python manage.py makemigrations api
    python manage.py migrate
    ```

6.  **Create a superuser (optional, for accessing Django admin):**

    ```bash
    python manage.py createsuperuser
    ```

    Follow the prompts to create an admin user.

7.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will typically be available at `http://127.0.0.1:8000/`.

## API Endpoints

All endpoints are prefixed with `/api/`.

### Authentication

- **Register User:**

  - **POST** `/api/register/`
  - **Request Body:**
    ```json
    {
      "username": "yourusername",
      "password": "yourpassword"
    }
    ```
  - **Response (Success 201):**
    ```json
    {
      "id": 1,
      "username": "yourusername"
    }
    ```

- **Login User:**

  - **POST** `/api/login/`
  - **Request Body:**
    ```json
    {
      "username": "yourusername",
      "password": "yourpassword"
    }
    ```
  - **Response (Success 200):**
    ```json
    {
      "message": "Login successful",
      "user_id": 1,
      "username": "yourusername"
    }
    ```
    (Session cookie will be set by the browser)

- **Logout User:**
  - **POST** `/api/logout/`
  - Requires authentication (session cookie).
  - **Response (Success 200):**
    ```json
    {
      "message": "Logout successful"
    }
    ```

### Meetings CRUD

These endpoints require authentication (user must be logged in).

- **List All Meetings / Create New Meeting:**

  - **GET** `/api/meetings/`
    - Lists all meetings for the authenticated user (if user-specific logic is fully implemented) or all meetings.
    - **Response (Success 200):**
      ```json
      [
        {
          "id": 1,
          "agenda": "Team Sync",
          "status": "upcoming",
          "date_of_meeting": "2025-06-01",
          "start_time": "10:00:00",
          "meeting_url": "https://meet.example.com/teamsync"
        }
        // ... more meetings
      ]
      ```
  - **POST** `/api/meetings/`
    - Creates a new meeting.
    - **Request Body:**
      ```json
      {
        "agenda": "Client Call",
        "status": "upcoming", // (upcoming, in_review, cancelled, overdue, published)
        "date_of_meeting": "2025-06-02",
        "start_time": "14:30:00",
        "meeting_url": "https://meet.example.com/clientcall"
      }
      ```
    - **Response (Success 201):** The created meeting object.

- **Retrieve / Update / Delete a Specific Meeting:**
  - **GET** `/api/meetings/<id>/`
    - Retrieves details of a specific meeting by its ID.
    - **Response (Success 200):** The meeting object.
  - **PUT** `/api/meetings/<id>/`
    - Updates an existing meeting.
    - **Request Body:** Same as POST, with fields to update.
    - **Response (Success 200):** The updated meeting object.
  - **PATCH** `/api/meetings/<id>/`
    - Partially updates an existing meeting.
    - **Request Body:** Subset of fields to update.
    - **Response (Success 200):** The updated meeting object.
  - **DELETE** `/api/meetings/<id>/`
    - Deletes a specific meeting.
    - **Response (Success 204 No Content):** No body.

## Status Choices for Meetings

- `upcoming`
- `in_review`
- `cancelled`
- `overdue`
- `published`

(These are defined in `api/models.py`)

## Deploying to Railway.app

This Django backend can be deployed to Railway. Follow these steps:

1.  **Ensure your project is a Git repository and pushed to GitHub/GitLab.** Railway deploys from a Git repository.

2.  **Create `Procfile` and `runtime.txt`:**

    - In your `backend/meetings_project` directory (the one with `manage.py`), create a file named `Procfile` (no extension) with the following content:
      ```
      web: gunicorn meetings_project.wsgi --log-file -
      ```
    - In the same directory, create a file named `runtime.txt` with your desired Python version (Railway will use this):
      ```
      python-3.10.4
      ```
      (Adjust the version as needed, e.g., `python-3.9.13`. Check Railway's supported Python runtimes.)

3.  **Create `requirements.txt`:**

    - If you haven't already, ensure you have a `requirements.txt` file in the `backend/meetings_project` directory. This file lists all Python dependencies.
    - Activate your virtual environment and run:
      ```bash
      pip freeze > requirements.txt
      ```
    - Make sure `gunicorn`, `dj-database-url`, `psycopg2-binary` (if using PostgreSQL on Railway, which is common), and `whitenoise` are included in this file.

4.  **Configure Django `settings.py` for Production:**

    - Open `backend/meetings_project/meetings_project/settings.py`. It has been configured to read these settings from environment variables.
    - **`DJANGO_SECRET_KEY`**:
      - **What it is**: Django's `SECRET_KEY` is a large random value used for cryptographic signing, such as for session data, password reset tokens, and CSRF protection tokens. It's crucial that this key is kept secret and is unique to your application.
      - **Why it's important**: If an attacker gains access to your `SECRET_KEY`, they could potentially forge signed data, leading to serious security vulnerabilities like session hijacking or remote code execution.
      - **How to generate a strong one**: You can generate a new, strong secret key using Django's built-in utility. Run this in your terminal (with your virtual environment activated):
        ```bash
        python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
        ```
        Copy the output. This is your production `SECRET_KEY`.
      - **How to use**: In `settings.py`, it's set up as `os.environ.get('DJANGO_SECRET_KEY', 'fallback-dev-key')`. You will set `DJANGO_SECRET_KEY` as an environment variable in Railway with the generated strong key. **Never commit your production `SECRET_KEY` to version control.** The fallback key is only for local development convenience if the environment variable isn't set.
    - **`DJANGO_DEBUG`**:
      - In `settings.py`: `DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'`
      - For production on Railway, set the `DJANGO_DEBUG` environment variable to `False`.
    - **`DJANGO_ALLOWED_HOSTS`**:
      - In `settings.py`: Parsed from `os.environ.get('DJANGO_ALLOWED_HOSTS')`.
      - On Railway, set the `DJANGO_ALLOWED_HOSTS` environment variable to a comma-separated string of your app's domain(s) (e.g., `your-app-name.up.railway.app,www.yourcustomdomain.com`).
    - **`DATABASE_URL`**:
      - In `settings.py`: `DATABASES` is configured using `dj_database_url.config()`.
      - Railway will automatically provide a `DATABASE_URL` environment variable when you provision and link a database service (like PostgreSQL) to your Django application service. No manual setting is usually needed for this specific variable on Railway if you use their database service.
    - **Static Files (Whitenoise)**:
      - `settings.py` is configured with `STATIC_ROOT = BASE_DIR / 'staticfiles'` and `STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'`.
      - `whitenoise.middleware.WhiteNoiseMiddleware` is added to `MIDDLEWARE`.
    - **CSRF & CORS for Production**:
      - `settings.py` is configured to read `DJANGO_CORS_ALLOWED_ORIGINS` and `DJANGO_CSRF_TRUSTED_ORIGINS` from environment variables when `DEBUG` is `False`.
      - On Railway, set these environment variables:
        - `DJANGO_CORS_ALLOWED_ORIGINS`: Comma-separated list of your frontend's production URL(s) (e.g., `https://your-frontend.vercel.app`).
        - `DJANGO_CSRF_TRUSTED_ORIGINS`: Comma-separated list of your frontend's production URL(s).
      - `CORS_ALLOW_CREDENTIALS` is set to `True` in `settings.py`.
      - Production cookie settings (`SESSION_COOKIE_SAMESITE`, `CSRF_COOKIE_SAMESITE`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`) are also configured in `settings.py` to be secure when `DEBUG` is `False` (assuming HTTPS).

5.  **Railway Project Setup:**

    - Go to [Railway.app](https://railway.app/) and create a new project.
    - Choose "Deploy from GitHub repo" and select your repository.
    - Railway might auto-detect it as a Python/Django app. If not, you might need to configure the service.
    - **Root Directory**: When Railway asks for the root directory, if your `Procfile`, `runtime.txt`, and `requirements.txt` are in `backend/meetings_project`, you should specify `backend/meetings_project` as the root directory for this service. If they are in `backend/`, then specify `backend/`. **It's generally best to have these deployment files at the root of what Railway considers the service directory.** For this project structure, it's `backend/meetings_project/`.

6.  **Environment Variables in Railway:**

    - In your Railway project service settings, go to the "Variables" tab.
    - Add the following environment variables:
      - `DJANGO_SECRET_KEY`: Your production secret key.
      - `DATABASE_URL`: Railway usually injects this automatically if you add a database service (e.g., PostgreSQL) to your project and link it.
      - `DJANGO_ALLOWED_HOSTS`: Your Railway app domain (e.g., `your-app-name.up.railway.app`) and any custom domains. You can often use `*.up.railway.app` or your specific domain.
      - `DEBUG`: Set to `False` for production.
      - `FRONTEND_URL`: The URL of your deployed frontend application (e.g., `https://my-frontend.vercel.app`).
      - Any other API keys or settings your application needs.

7.  **Deployment:**

    - Railway will automatically build and deploy your application when you push changes to your connected Git branch (usually `main` or `master`).
    - Check the deployment logs in Railway for any errors.

8.  **Run Migrations on Railway:**

    - Once deployed, you'll need to run Django migrations. Railway allows you to open a shell to your deployed service or configure a deploy command.
    - A common way is to add `python manage.py migrate --noinput` to your `Procfile` as a release command if Railway supports it, or run it manually via a shell if needed.
      Example `Procfile` with release command:
      ```Procfile
      release: python manage.py migrate --noinput
      web: gunicorn meetings_project.wsgi --log-file -
      ```
      (Check Railway's documentation for the most current way to handle release phase tasks like migrations.)

9.  **Collect Static Files:**
    - The `python manage.py collectstatic --noinput` command also needs to be run. Whitenoise will then serve these files. This can also be part of a release command or build step.
      If not in `Procfile release`, you might need to run it manually or ensure your build pack does it.
      Updated `Procfile` example:
      ```Procfile
      release: python manage.py collectstatic --noinput && python manage.py migrate --noinput
      web: gunicorn meetings_project.wsgi --log-file -
      ```

This guide provides a comprehensive overview. Always refer to the latest [Railway Django deployment documentation](https://docs.railway.app/deploy/django) for the most up-to-date practices.
