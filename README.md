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

- Have a GPU that supports CUDA and Tensorflow
- Download and Install [Python](https://www.python.org/downloads/)
- Download and Install [Node.js](https://nodejs.org/)
- Download and Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Installation and Setup

### Setting Up the Backend

1. **Navigate to the Backend Directory**

   ```sh
   cd app/backend
   ```

2. **Import Database**

   - Download the db from https://drive.google.com/drive/folders/10dIZxSu8B0-3vvuU8fy_ivHPWx0EIsJ6?usp=sharing

   - Put the db.sqlite3 file to current directory

   ```sh
   app/backend
   ```

3. **Create environment variables:**

   - Create a .env file
   - SAMPLE KEY: XzF0KcFHcRh9rng2RVv3D9mwxr6LEoU_tinkRrEu8-A=

   ###### .env

   ```
   SECRET_KEY=<YOUR_SECRET_KEY>
   DEBUG=True
   DJANGO_ALLOWED_HOSTS=localhost
   CSRF_TRUSTED_ORIGINS=http://localhost
   ```

4. **Build Docker Image**

   ```sh
   docker-compose build
   ```

   - This will install all the dependencies for the API

5. **Run the Docker Image**

   ```sh
   docker-compose up
   ```

6. **Stopping the Docker Image**

   ```sh
   docker-compose down
   ```

### Setting Up the Frontend

1. **Navigate to the Frontend Directory:**

   - From the root folder

   ```sh
   cd app/frontend/denguedash
   ```

2. **Install Dependencies**

   ```sh
   npm install --legacy-peer-deps
   ```

3. **Create environment variables:**

   - Create a .env
   - SAMPLE KEY: XzF0KcFHcRh9rng2RVv3D9mwxr6LEoU_tinkRrEu8-A=

   ###### .env

   ```
   NEXT_PUBLIC_DJANGO_URL = http://localhost:8000/api/
   JWT_SECRET=<YOUR_SECRET_KEY>
   ```

   - Input the following lines (Frontend):

   ###### .env

   ```
   NEXT_PUBLIC_DJANGO_URL = http://localhost:8000/api/
   SECRET_KEY=<YOUR_SECRET_KEY>
   ```

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
