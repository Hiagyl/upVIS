# upVIS(UP Virgils Integrated System)

<span>upVIS is a web-based information system designed to support the financial management and beneficiary support operations of UPV Virgils.</span>

---

## Logical View Diagram

upVIS (UPV Virgils Integrated System) is a web-based information system designed to automate the financial management and scholar support operations of UPV Virgils.
The primary user of the system is the Administrator, who manages donations, expenses, scholar records, member records, and distribution tracking.

The system centralizes:

- 📦 Distribution records

- 🧑 Members directory

- 🎓 Scholars directory

- ❤️ Donors directory

- 💰 Donation tracking

- 💸 Expense tracking

- 📊 Financial records and summaries

The goal of the system is to ensure transparency, proper tracking of distributions, and accurate financial reporting for the organization.

### Core Entities and Responsibilities

- **Member**  
  Represents the organization's officers or volunteers.  
  - Helps in distributions  

- **Scholar**  
  Represents the beneficiaries of the organization.  
  - Receives distributions  

- **Donor**  
  Represents individuals who donate funds.  
  - Can make multiple donations  

- **Donation**  
  Represents financial donations made by donors.  
  - Linked to a donor  
  - Contributes to financial records  

- **Expense**  
  Represents the operational costs of the organization.  
  - Deducted from the total donations  

- **Distribution**  
  Represents the distribution of groceries or monetary assistance.  
  - Involves the scholar  
  - Contains details about the distribution  

- **FinancialRecord**  
  Represents the financial summary of the organization.  
  - Total Donations  
  - Total Expenses  
  - Remaining Balance  

### Conceptual Model
#### User-System Interaction
<p align="center">
  <img src="./img1.png" width="500"/>
</p>

The user can manage and track different transactions and directories in the system as shown in the image above. Basically, the system is just composed of different pages with functionalities related to managing a specific transaction or members, donors, and recipients of the organization.

#### Distribution Flow
<p align="center">
  <img src="./img3.png" width="500"/>
</p>
This is a high-level overview of the process done in the system. Donors will donate donations(money) and it will be used to purchase groceries and other expenses for the distribution to the scholars.

#### Financial Flow
<p align="center">
  <img src="./img4.png" width="500"/>
</p>
This is a high-level overview of the financial transactions happening in the system. Donations from the donors will be the main source of finance in this organization and expenses will be deducted from the overall donations to determine the balance. They will be used for the financial reports.
### Entity-Relationsip Diagram of upVIS

<p align="center">
  <img src="./img2.png" width="500"/>
</p>

The diagram above shows the relationship between the entities in this system. This also shows the cardinality of the entities.

### Interaction Flow

The interaction flow is as follows:
   1. The Administrator interacts with the View Layer through HTML pages in the public/ folder.
   2. Client-side JavaScript sends HTTP requests to the backend.
   3. Requests are handled by the Routing Layer (Routes/).
   4. Routes forward requests to the appropriate Controllers.
   5. Controllers process business logic and interact with Models.
   6. Models communicate with the database to store or retrieve data.

<p align="center">
  <img src="./LogicalDiagram.png" width="500"/>
</p>

---

## Software Architecture

### 1. Client–Server Architecture
   
upVIS follows a Client–Server architecture.

      a. The Client is the web browser used by UPV Virgils administrators.
      
      b. The Server is the Node.js + Express backend application.
      
      c. Communication happens via HTTP requests and responses.
      
This architecture enables centralized data processing while allowing administrators to access the system through standard web browsers.

### 2️. Model–View–Controller (MVC)

The backend follows the MVC architectural pattern:

#### Model (Model/)
Represents the system’s data and database interaction logic.

Examples:

      a. Donations.js
      
      b. Expenses.js
      
      c. Scholars.js
      
      d. Members.js
      
These files define the structure of financial records, scholar data, and member data.

##### View (frotend/)
Contains:

      a. React Components
      
      b. CSS styling
      
      c. Client-side JavaScript
      
This layer handles presentation and user interaction.

#### Controller (Controllers/)
Contains business logic for processing requests.

Examples:

      a. financeController.js
      
      b. scholarController.js
      
      c. memberController.js
      
Controllers validate input, compute financial summaries, and coordinate database operations.

### 3️. Layered Architecture
The system is also structured as a layered architecture:

      a. Presentation Layer → public/
      
      b. Routing Layer → routes/
      
      c. Application Logic Layer → controllers/
      
      d. Data Access Layer → model/
      
      e. Testing Layer → tests/

      f. Data Layer → MongoDB Atlas
      
Each layer has a defined responsibility that improves maintainability, scalability, and clarity of responsibilities.

---

## Project Stucture 
<span>Overview</span>

<span>The project is divided into two main components: Frontend and Backend. The backend follows an MVC structure to ensure separation of concerns, while the frontend handles user interface logic.</span>

### High-Level Structure

```bash
upVIS/  
├── backend/      # This is the server in our client/server model that contains the model + control
└── frontend/     # React frontend view
```

### Backend Structure
<span>Description</span>

<span>The backend serves as the core of the system. It handles API requests, processes logic, and manages communication with the database. The backend is structured following the MVC architectural pattern to separate concerns between data handling, request processing, and routing.</span>

```bash
backend/  
├── Controllers/                    # Contains business logic and request handlers  
│   ├── distributionController.js   # Handles scholar distribution operations  
│   ├── donationController.js       # Handles donation recording and processing  
│   ├── donorController.js          # Manages donor-related logic  
│   ├── expenseController.js        # Handles expense tracking and validation  
│   ├── financeController.js        # Computes totals and financial summaries  
│   ├── memberController.js         # Manages organization member records  
│   ├── reportController.js         # Generates financial and summary reports  
│   └── scholarController.js        # Manages scholar records and status  
│
├── Model/                          # Defines database schemas and data operations  
│   ├── Distributions.js            # Distribution data model  
│   ├── Donations.js                # Donation data model  
│   ├── Donors.js                   # Donor data model  
│   ├── Expenses.js                 # Expense data model  
│   ├── Members.js                  # Organization member data model  
│   ├── Reports.js                  # Reporting data model  
│   └── Scholars.js                 # Scholar data model  
│
├── Routes/                         # Defines API endpoints and maps them to controllers  
│   ├── distributionRoutes.js       # Routes for distribution-related requests  
│   ├── donationRoutes.js           # Routes for donation operations  
│   ├── donorRoutes.js              # Routes for donor operations  
│   ├── expenseRoutes.js            # Routes for expense operations  
│   ├── financeRoutes.js            # Routes for finance summaries  
│   ├── memberRoutes.js             # Routes for member management  
│   ├── reportRoutes.js             # Routes for reporting  
│   └── scholarRoutes.js            # Routes for scholar management  
│
│
├── tests/                          # API endpoint testing files  
│   ├── distribution.http             
│   ├── donors.http                 
│   ├── members.http                
│   └── scholars.http               
│
└── server.js           # Main entry point of the Express application
```

### Frontend Structure
<span>Description</span>

 <span>The frontend serves as the client-side application that interacts with users. It is responsible for rendering UI components, handling user input, and communicating with the backend through REST API calls.</span>

```bash

frontend/
├── public/                                 # Static files
│   └── index.html                          # Single HTML file used by React
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                      # Navigation bar
│   │   ├── Table.jsx                       # Reusable table component
│   │   └── Form.jsx                        # Reusable form component
│   │
│   ├── pages/                              # Page-level components
│   │   ├── Members.jsx                     # Members page
│   │   ├── Scholars.jsx                    # Scholars page
│   │   ├── Finance.jsx                     # Finance page
│   │   ├── Transactions.jsx                # Transactions page
│   │   └── Reports.jsx                     # Reports page
│   │
│   ├── services/                           # API connection logic
│   │   └── api.js                          # axios config
│   │
│   ├── App.jsx                             # React entry point
│   └── main.jsx                            # React entry point
│
└── package.json                            # Frontend dependencies
```
##

The system is structured into two primary components: Backend and Frontend, ensuring clear separation of responsibilities and maintainability.

The Backend follows the MVC (Model–View–Controller) architecture. Controllers manage business logic and request handling, Models define database schemas and perform CRUD operations, and Routes map API endpoints to their respective controllers. Additional testing files validate API functionality, while server.js initializes the Express server and middleware. This structure promotes modularity, scalability, and organized code management.

The Frontend is built using React and serves as the client-side interface. It consists of reusable components, page-level views, and centralized API service logic for backend communication. The application entry points (App.jsx and main.jsx) manage routing and rendering. This layered approach ensures a responsive, maintainable, and well-organized user interface.

Overall, the project structure supports clean architecture principles, efficient development, and long-term scalability of the full-stack application.

---

## 🚀 Deployment Plan

upVIS is deployed as a decoupled full-stack application, splitting frontend asset delivery from backend business logic processing for optimal speed and reliability.

1. Frontend Deployment (Static Hosting)
The React single-page application (SPA) is built into optimized static files and hosted on a global Content Delivery Network (CDN) like Vercel or Netlify.
- Root Directory: frontend/
- Build Command: npm run build
- Output Directory: dist/
- Routing Rule: Configure a catch-all rewrite (/index.html) on the hosting provider to prevent 404 errors on page refresh.

3. Backend Deployment (Web Service)
The Node.js/Express REST API is deployed as an active background web service on an infrastructure provider like Render or Railway.
- Root Directory: backend/
- Build Command: npm install
- Start Command: node server.js

4. Production Environment Variables
The following environment configurations must be set up securely in your production hosting dashboards to link the services together:
Backend (.env)
```bash
PORT=5000
NODE_ENV=production
MONGO_URI=your_production_mongodb_atlas_connection_string
FRONTEND_URL=https://your-upvis-frontend.vercel.app
```

Frontend (.env.production)
```bash
VITE_API_BASE_URL=https://your-upvis-backend.onrender.com
```
