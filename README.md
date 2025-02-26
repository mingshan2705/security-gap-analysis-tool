# Security Gap Analysis Tool <!-- omit in toc -->

This repository contains the Security Gap Analysis Tool, which includes both the frontend and backend components.

## Table of Contents <!-- omit in toc -->

- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
  - [Frameworks/ Libraries](#frameworks-libraries)
- [General Functionalities](#general-functionalities)
  - [Interactions with the Backend API](#interactions-with-the-backend-api)
  - [Pages](#pages)
- [Local Development](#local-development)
  - [Installation of Libraries](#installation-of-libraries)
  - [Running the Frontend Application](#running-the-frontend-application)
  - [Running the Backend Application](#running-the-backend-application)
- [Containerisation](#containerisation)
  - [General Idea](#general-idea)

## Folder Structure

```
.
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── sections/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

|     Folder/File      |                                                                 Description                                                                 |             Link             |
| :------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------: |
|      `backend/`      |                                                    Contains the backend FastAPI application                                                 |      [Link](./backend/)      |
|      `frontend/`     |                                                    Contains the frontend React application                                                  |      [Link](./frontend/)     |
| `docker-compose.yml` |                                      Docker Compose file to orchestrate the backend and frontend services                                    | [Link](./docker-compose.yml) |
|      `README.md`     |                                                        This README file with project details                                                |      [Link](./README.md)     |

## Tech Stack

The frontend is created using **React** and **TailwindCSS**, while the backend is built with **FastAPI**.

### Frameworks/ Libraries

- **React** - Used for the overall development of the frontend interface.
- **TailwindCSS** - Used for the styling of CSS.
- **Vite** - Build tool for configuring the development of frontend interfaces.
- **FastAPI** - Used for the backend API development.
- **Uvicorn** - ASGI server for serving the FastAPI application.

## General Functionalities

The interface helps users to upload relevant documents, generate reports, and view the analysis of potential security gaps.

### Interactions with the Backend API

1. When a user uploads files and generates a report, the data is sent to the `/api/generate-report` endpoint of the backend API.
2. The frontend fetches the list of reports from the `/api/reports` endpoint.
3. Users can download reports from the `/api/reports/{request_id}/download` endpoint.

### Pages

1. `/` - Homepage that the users will first look at.

   - **Relevant Files**: [`Home.jsx`](./frontend/src/sections/Home.jsx)

2. `/dashboard` - Dashboard layout for managing reports.

   - **Relevant Files**: [`DashboardLayout.jsx`](./frontend/src/layouts/DashboardLayout.jsx)

3. `/dashboard/report` - Page to view and download specific reports.

   - **Relevant Files**: [`ReportInterface.jsx`](./frontend/src/components/ReportInterface.jsx)


## Local Development

If you want to run the application locally, you will need to run both the frontend and backend applications.

### Installation of Libraries

You will have to first install the libraries that are used in this application. Run the following commands in the terminal:

```bash
# For the backend
cd backend
pip install -r requirements.txt

# For the frontend
cd ../frontend
npm install
```

### Running the Frontend Application

You can run the following command in the terminal to run a local server:

```bash
npm run dev
```

After running the above command, a local server should start up and if you did not change the configurations, it will run on `http://localhost:5173`.

### Running the Backend Application

You can run the following command in the terminal to start the backend server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

After running the above command, the backend server should start up and run on `http://localhost:8000`.

## Containerisation

The containerisation of the application is captured under the [`Dockerfile`](./frontend/Dockerfile) for the frontend and [`Dockerfile`](./backend/Dockerfile) for the backend.

### General Idea

The application is containerised by creating Docker images for both the frontend and backend, and orchestrating them using Docker Compose.
