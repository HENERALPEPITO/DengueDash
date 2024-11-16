## DengueDash

This repository contains the code and the paper for the DengueDash, a web application that monitors and forecasts Dengue Cases in Iloilo City. Developed using Django and Next.js

## Contributors

- Kurt Matthew Amodia
- Glen Andrew C. Bulaong
- Carl Benedict Elipan

## Tech Stack

- **Front-end:** Next.js
- **Back-end:** Django

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Download and Install [Python](https://www.python.org/downloads/)
- Download and install [Postman](https://www.postman.com/downloads/) (for Testing the API)
- Download and install [SQLite](https://www.sqlite.org/download.html) (To view the Database. The project is currently using SQLite as its database structure)
- Download and install [Node.js](https://nodejs.org/)

## Installation and Setup

### Setting Up the Backend

1. **Install Prerequisite Packages:**

   ```sh
   pip install -r requirements.txt
   ```

2. **Navigate to the Backend Directory**

   ```sh
   cd app/backend
   ```

3. **Run Migrations**

   ```sh
   py manage.py makemigrations
   ```

   and

   ```sh
   py manage.py migrate
   ```

4. **Seed the Database**

   - User Classifications

   ```sh
   py manage.py user_classification_seeder
   ```

   - DRU

   ```sh
   py manage.py dru_seeder
   ```

5. **Create a superuser**

   ```sh
   py manage.py createsuperuser
   ```

   Input and follow the instructions

6. **Seed the Database using Fake Data (Optional but Recommended)**

   - Patient and Case Data

   ```sh
   py manage.py patient_case_seeder
   ```

7. **Run the Django Server**

   ```sh
   py manage.py runserver
   ```

8. **Check if API is working using Postman**

   - Open Postman
   - Use `GET` and input the following URI
     `http://127.0.0.1:8000/api/quick-stat?year=2024`

### Setting Up the Frontend

1. **Navigate to the Frontend Directory:**

   - From the root folder

   ```sh
   cd app/frontend/denguedash
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Create environment variables:**

   - Create a .env file in the frontend directory
   - Input the following line:

   ###### .env

   ```
   NEXT_PUBLIC_DJANGO_URL = http://localhost:8000/api/
   ```

   ###### .env

4. **Run and Launch the Web Application:**

   ```sh
   npm run dev
   ```

   - From the terminal, it will output

   ```sh
   ▲ Next.js 15.0.1
   - Local:        http://localhost:3000
   - Environments: .env
   ```

   Use Ctrl + Left Click on the URL (underlined) to access the application
