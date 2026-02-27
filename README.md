# upVIS(UP Virgils Integrated System)

<span>upVIS is a web-based information system designed to support the financial management and beneficiary support operations of UPV Virgils.</span>

---

## Logical View Diagram

upVIS (UPV Virgils Integrated System) is a web-based information system designed to automate the financial management and scholar support operations of UPV Virgils.
The primary user of the system is the Administrator, who manages donations, expenses, scholar records, member records, and distribution tracking.

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

##### View (public/)
Contains:

      a. HTML pages (e.g., finance.html, scholars.html)
      
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
      
      b. Routing Layer → Routes/
      
      c. Application Logic Layer → Controllers/
      
      d. Data Access Layer → Model/
      
      e. Testing Layer → tests/

      f. Data Layer → MongoDB Atlas
      
Each layer has a defined responsibility that improves maintainability, scalability, and clarity of responsibilities.

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
##
### Frontend Structure
<span>Description</span>

 <span>The frontend serves as the client-side application that interacts with users. It is responsible for rendering UI components, handling user input, and communicating with the backend through REST API calls.</span>

```bash

├── frontend/
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
```

The upVIS system follows the Model–View–Controller (MVC) architectural pattern combined with a layered backend design. Although the frontend files are served inside the backend directory, the system maintains clear separation between presentation, routing, business logic, and data access layers.

The project structure is organized as follows:

upVIS/
│
├── Backend/                                # Main application directory
│   │
│   ├── Controllers/                        # Handles business logic (MVC - Controller)
│   │   ├── distributionController.js       # Processes scholar distribution operations
│   │   ├── donationController.js           # Handles donation recording and logic
│   │   ├── donorController.js              # Manages donor-related operations
│   │   ├── expenseController.js            # Processes expense entries
│   │   ├── financeController.js            # Computes financial summaries and totals
│   │   ├── memberController.js             # Manages organization member records
│   │   ├── reportController.js             # Generates system reports
│   │   └── scholarController.js            # Manages scholar registry and status
│   │
│   ├── Model/                              # Data access layer (MVC - Model)
│   │   ├── Distributions.js                # Distribution database schema
│   │   ├── Donations.js                    # Donation database schema
│   │   ├── Donors.js                       # Donor database schema
│   │   ├── Expenses.js                     # Expense database schema
│   │   ├── Members.js                      # Member database schema
│   │   ├── Reports.js                      # Reporting data schema
│   │   └── Scholars.js                     # Scholar database schema
│   │
│   ├── Routes/                             # API endpoint definitions
│   │   ├── distributionRoutes.js           # Routes for distribution requests
│   │   ├── donationRoutes.js               # Routes for donation endpoints
│   │   ├── donorRoutes.js                  # Routes for donor management
│   │   ├── expenseRoutes.js                # Routes for expense operations
│   │   ├── financeRoutes.js                # Routes for financial summaries
│   │   ├── memberRoutes.js                 # Routes for member management
│   │   ├── reportRoutes.js                 # Routes for reporting features
│   │   └── scholarRoutes.js                # Routes for scholar operations
│   │
│   ├── public/                             # Frontend files (MVC - View Layer)
│   │   ├── index.html                      # Dashboard interface
│   │   ├── finance.html                    # Finance monitoring page
│   │   ├── scholars.html                   # Scholar registry interface
│   │   ├── members.html                    # Organization members page
│   │   ├── transactions.html               # Donation and expense records page
│   │   ├── styles.css                      # Application styling
│   │   └── *.js                            # Client-side JavaScript files
│   │
│   ├── tests/                              # API endpoint testing files
│   │   ├── distribution.http               # Distribution endpoint tests
│   │   ├── donors.http                     # Donor endpoint tests
│   │   ├── members.http                    # Member endpoint tests
│   │   └── scholars.http                   # Scholar endpoint tests
│   │
│   └── server.js                           # Express server entry point
│
└── README.md                               # Project documentation
```

### Structure Explanation
      a. Controllers/ handle business logic and request processing.
      b. Model/ defines database schemas and performs CRUD operations.
      c. Routes/ defines API endpoints and connects them to controllers.
      d. public/ contains the user interface files (HTML, CSS, JS) served by the backend.
      e. tests/ contains endpoint testing files for validation.
      f. server.js initializes the Express server and middleware configuration.
