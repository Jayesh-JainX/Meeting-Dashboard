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

3.  **Install dependencies:**
    Make sure you have a `requirements.txt` file (we will create this later, for now, you'd manually install Django and djangorestframework).

    ```bash
    pip install Django djangorestframework django-cors-headers gunicorn dj-database-url psycopg2-binary whitenoise
    # (Note: djangorestframework-simplejwt is if you choose JWT, we've set up session auth for now)
    # psycopg2-binary is for PostgreSQL, common on Railway. dj-database-url helps parse DATABASE_URL.
    # gunicorn is the WSGI server. whitenoise is for serving static files.
    ```

    **Important:** Create a `requirements.txt` file in the `backend/meetings_project` directory:

    ```bash
    # (After activating virtual env and installing packages)
    pip freeze > requirements.txt
    ```

    Ensure this file is committed to your repository.

4.  **Apply database migrations:**

    ```bash
    python manage.py makemigrations api
    python manage.py migrate
    ```

5.  **Create a superuser (optional, for accessing Django admin):**

    ```bash
    python manage.py createsuperuser
    ```

    Follow the prompts to create an admin user.

6.  **Run the development server:**
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

    - Open `backend/meetings_project/meetings_project/settings.py`.
    - **`SECRET_KEY`**:
      - Do NOT hardcode your production `SECRET_KEY`. Set it from an environment variable.
      - ```python
        import os
        SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'your-default-development-secret-key')
        ```
      ```

      ```
    - **`DEBUG`**:
      - Set `DEBUG = False` for production. You can use an environment variable:
      - ```python
        DEBUG = os.environ.get('DJANGO_DEBUG', '') != 'False' # Defaults to True if DJANGO_DEBUG is not 'False'
        ```
      ````
      Or more simply for Railway:
      ```python
      DEBUG = os.environ.get('DEBUG', 'False') == 'True' # Set DEBUG=True in Railway env vars for debugging if needed
      ````
    - **`ALLOWED_HOSTS`**:

      - Railway will provide a domain for your app (e.g., `myproject.up.railway.app`). Add this to `ALLOWED_HOSTS`.
      - You can get this from an environment variable provided by Railway or set it directly.
      - ```python
        ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
        RAILWAY_STATIC_URL = os.environ.get('RAILWAY_STATIC_URL')
        if RAILWAY_STATIC_URL:
            ALLOWED_HOSTS.append(RAILWAY_STATIC_URL.split('//')[1]) # Extract hostname
        ```

      # For custom domains on Railway:

      # CUSTOM_DOMAIN = os.environ.get('CUSTOM_DOMAIN')

      # if CUSTOM_DOMAIN:

      # ALLOWED_HOSTS.append(CUSTOM_DOMAIN)

      ````
      A simpler approach for Railway's generated domain:
      ```python
      ALLOWED_HOSTS = []
      RAILWAY_APP_HOSTNAME = os.environ.get('RAILWAY_APP_HOSTNAME') # Railway might set this or similar
      if RAILWAY_APP_HOSTNAME:
          ALLOWED_HOSTS.append(RAILWAY_APP_HOSTNAME)
      # It's often easier to set ALLOWED_HOSTS directly in Railway's environment variables as a comma-separated string
      # e.g., .up.railway.app,yourcustomdomain.com
      # Then parse it:
      # ALLOWED_HOSTS_ENV = os.environ.get('DJANGO_ALLOWED_HOSTS')
      # if ALLOWED_HOSTS_ENV:
      #     ALLOWED_HOSTS.extend(ALLOWED_HOSTS_ENV.split(','))
      ````

      For Railway, it's common to set `ALLOWED_HOSTS = ['*']` initially during setup and then refine it, or use the `.up.railway.app` domain.
      A safe bet for Railway is to use their provided domain:

      ```python
      ALLOWED_HOSTS = [os.environ.get('RAILWAY_PUBLIC_DOMAIN', '.up.railway.app')] if 'RAILWAY_PUBLIC_DOMAIN' in os.environ else []
      # Also add localhost for health checks if needed
      ALLOWED_HOSTS.append('localhost')
      ALLOWED_HOSTS.append('127.0.0.1')
      ```

    - **Database (`DATABASES`)**:
      - Railway provides a `DATABASE_URL` environment variable for its provisioned databases (e.g., PostgreSQL).
      - Install `dj-database-url`: `pip install dj-database-url` (should be in `requirements.txt`).
      - Modify `DATABASES` setting:
        ```python
        import dj_database_url
        DATABASES = {
            'default': dj_database_url.config(
                default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}", # Fallback to SQLite for local dev if DATABASE_URL not set
                conn_max_age=600,
                conn_health_checks=True,
            )
        }
        ```
    - **Static Files (Whitenoise)**:
      - Install `whitenoise`: `pip install whitenoise` (should be in `requirements.txt`).
      - Add `whitenoise.middleware.WhiteNoiseMiddleware` to your `MIDDLEWARE` list, right after `SecurityMiddleware`:
        ```python
        MIDDLEWARE = [
            'django.middleware.security.SecurityMiddleware',
            'whitenoise.middleware.WhiteNoiseMiddleware', # Add this
            # ... other middleware
        ]
        ```
      - Add to `settings.py`:
        ```python
        STATIC_ROOT = BASE_DIR / 'staticfiles'
        STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
        ```
    - **CSRF & CORS for Production**:
      - `CSRF_TRUSTED_ORIGINS`: Update this list with your frontend's production URL.
        ```python
        CSRF_TRUSTED_ORIGINS = [os.environ.get('FRONTEND_URL', 'http://localhost:3000')]
        ```
      - `CORS_ALLOWED_ORIGINS` (if `CORS_ALLOW_ALL_ORIGINS = False` in production):
        ```python
        CORS_ALLOWED_ORIGINS = [
            os.environ.get('FRONTEND_URL', 'http://localhost:3000')
        ]
        CORS_ALLOW_CREDENTIALS = True # If your frontend needs to send cookies
        ```
        It's often better to set `CORS_ALLOW_ALL_ORIGINS = False` in production and explicitly list origins.

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
