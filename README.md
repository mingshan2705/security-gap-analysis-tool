# AudiBot Frontend <!-- omit in toc -->

This portion contains the frontend component of the application.

## Table of Contents <!-- omit in toc -->

- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
  - [Frameworks/ Libraries](#frameworks-libraries)
- [General Functionalities](#general-functionalities)
  - [Interactions with the Backend API](#interactions-with-the-backend-api)
  - [Pages](#pages)
- [Set up](#set-up)
- [Local Development](#local-development)
  - [Installation of Libraries](#installation-of-libraries)
  - [Running the Frontend Application](#running-the-frontend-application)
- [Containerisation](#containerisation)
  - [General Idea](#general-idea)

## Folder Structure

```
.
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── sections/
│   └── api.js
├── .env.development
├── .env.production
├── Dockerfile
├── nginx.conf
├── tailwind.config.js
└── vite.config.js
```

|     Folder/File      |                                                                 Description                                                                 |             Link             |
| :------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------: |
|      `public/`       |                                                    Contains static assets (pictures etc)                                                    |      [Link](./public/)       |
|        `src/`        |                                                        Contains all the source codes                                                        |        [Link](./src/)        |
|  `src/components/`   |                               Contains all the resuable components that can be reused across layouts/sections                               |   [Link](./src/components)   |
|    `src/layouts/`    |                 Contains all the layout related components that can be used to structure certain layouts that may be reused                 |    [Link](./src/layouts)     |
|   `src/sections/`    |                                    Contains all the components that represents a page in the application                                    |    [Link](./src/sections)    |
|     `src/api.js`     |                                   Contains the relevant configurations for connecting to the backend API                                    |     [Link](./src/api.js)     |
|  `.env.development`  |                                           Contains the environment variables for development mode                                           |  [Link](./.env.development)  |
|  `.env.production`   |                                           Contains the environment variables for production mode                                            |  [Link](./.env.production)   |
|     `Dockerfile`     |                                           Dockerfile for containerising the frontend application                                            |     [Link](./Dockerfile)     |
|     `nginx.conf`     | Nginx configuration file used for containerisation of the application. This will be used after the build stage of the frontend application. |     [Link](./nginx.conf)     |
| `tailwind.config.js` |                                                       Configurations for TailwindCSS.                                                       | [Link](./tailwind.config.js) |
|   `vite.config.js`   |                                                       Configurations for using vite.                                                        |   [Link](./vite.config.js)   |

## Tech Stack

The frontend is created using **React** which is a JavaScript library that allows for component based development of web
components. This interface would allow users to upload the relevant documents, query with a chatbot and receive a
summarised report of the potential security gaps.

### Frameworks/ Libraries

- **React** - Used for the overall development of the frontend interface.

- **TailwindCSS** - Used for the styling of CSS.

- **Vite** - Build tool for configuring the development of frontend interfaces.

## General Functionalities

The interface only helps in facilitating the users to communicate with the chatbot that we have configured in the backend. Users
will be able to communicate with the chatbot and get summarised issues with their configurations based on the security guidelines
that is uploaded in the knowledge base. There will also be a summarised report that is generated afterwards.

### Interactions with the Backend API

1. When user sends a query, the query is sent to the `/api/chatbot` endpoint of the backend api.

### Pages

1. `/` - Homepage that the users will first look at.

   - **Relevant Files**: [`Home.jsx`](./src/sections/Home.jsx)

2. `/dashboard` - Users will be first greeted by this page after logging in. This will also start up a new chat for the users and prompting them for some inputs on the system that they are trying to analyse.

   - **Relevant Files**: [`NewChat.jsx`](./src/sections/NewChat.jsx)

3. `/dashboard/chat` - This will be for specific chats that the users are currently interacting with.

   - **Relevant Files**: [`Chat.jsx`](./src/sections/Chat.jsx), [`ChatInterface.jsx`](./src/components/ChatInterface.jsx), [`Report.jsx`](./src/components/Report.jsx)

## Set up

No additional setup is required for the frontend.

## Local Development

If you want to run the frontend application locally, you will need to run the backend API locally as well. This is because
we will need the backend API to connet to an LLM model that allows for the response to be shown in the application.

### Installation of Libraries

You will have to first install the libraries that are used in this application, you will see a `node_modules` folder being generated after
you run the following commands in terminal:

```bash
cd client
npm install
```

_Note:_ Note that you should start from root directory of this repository and change directory into the client folder.
If you are in another directory, navigate accordingly to the `client/` folder.

### Running the Frontend Application

You can run the following command in the terminal to run a local server:

```bash
npm run dev
```

After running the above command, a local server should start up and if you did not change the configurations, it will run on `http://localhost:5173`

## Containerisation

The containerisation of the frontend application is captured under the [`Dockerfile`](./Dockerfile)

### General Idea

The application is containerised by first creating a production build and serving it on an **Nginx** server.
