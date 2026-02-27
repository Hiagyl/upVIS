# upVIS(UP Virgils Integrated System)

<span>upVIS is a web-based information system designed to support the financial management and beneficiary support operations of UPV Virgils.</span>

---

## Logical View Diagram

---

## Software Architecture

---

## Project Stucture 
<span>Overview</span>

<span>The project is divided into two main components: Frontend and Backend. The backend follows an MVC structure to ensure separation of concerns, while the frontend handles user interface logic.</span>

##
### Backend Structure
<span>Description</span>

<span>The backend serves as the core of the system. It handles API requests, processes logic, and manages communication with the database. The backend is structured following the MVC architectural pattern to separate concerns between data handling, request processing, and routing.</span>

```bash
Backend/
├── Controllers/      # Handle logic and request handlers
├── Model/            # Database schemas and data operations
├── Routes/           # API endpoint definitions
├── public/           # Static files served by backend
├── tests/            # Unit and integration tests
└── server.js         # Application entry point
```
##
### Frontend Structure
<span>Description</span>

 <span>The frontend serves as the client-side application that interacts with users. It is responsible for rendering UI components, handling user input, and communicating with the backend through REST API calls.</span>

```bash
Frontend/
└── src/
    ├── app.js          # Main React application component
    └── assets/         # Static resources (images, styles)
```
