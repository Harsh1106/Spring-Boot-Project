# Parcel Service Application - Comprehensive Architecture & Flow Guide

This document provides an in-depth explanation of the **Parcel Service Application**, detailing its architecture, how modules interact, and the implementation concepts behind the system. It also serves as a guide to understanding **Microservices** concepts using this project as a practical reference.

---

## 1. Project Architecture Overview

The application is architected as a **Full-Stack Client-Server System**, designed with modularity that mimics Microservices principles.

### The "Big Picture" Diagram
```text
[ Browser / User ]
       |
       | (HTTP / JSON)
       v
+------------------------+          +------------------------+
|   Frontend (Client)    |          |    Backend (Server)    |
|------------------------|          |------------------------|
| Technology: Angular 19 | <------> | Technology: Spring Boot|
| Port: 4200             |          | Port: 8080             |
| Responsibilities:      |          | Responsibilities:      |
| - UI/UX Rendering      |          | - API Gateway          |
| - Input Validation     |          | - Business Logic       |
| - State Management     |          | - Data Persistence     |
+------------------------+          +------------------------+
                                             |
                                             | (JPA / SQL)
                                             v
                                    +------------------------+
                                    |    Database (Store)    |
                                    |------------------------|
                                    | Technology: H2 (Memory)|
                                    | Responsibilities:      |
                                    | - Storing Users,       |
                                    |   Bookings, Logs       |
                                    +------------------------+
```

---

## 2. Module Communication & Deep Dive

How do different parts of the system "talk" to each other? This communication happens in two distinct ways: **Network Calls** (Frontend to Backend) and **Method Calls** (Internal Backend Layers).

### A. Frontend-Backend Communication (The "Bridge")
The Frontend and Backend are completely independent. They don't know about each other's code; they only speak a common language: **HTTP & JSON**.

1.  **The Requester (Angular)**:
    *   **Services (`AuthService`, `DataService`)**: These are the "messengers". They don't draw the UI; they just fetch data.
    *   **HttpClient**: The tool used to send messages. It acts like a browser making a request in the background.
    *   **Observables (RxJS)**: The system waits for the answer asynchronously. It doesn't freeze the screen while waiting for the server.

2.  **The Receiver (Spring Boot)**:
    *   **Controllers (`UserController`, `BookingController`)**: These act as the "Front Desk". They listen for specific URLs (e.g., `/registerCustomer`).
    *   **@RequestBody**: Converts the incoming JSON message back into Java Objects (DTOs) that the backend understands.

### B. Internal Backend Communication (The "Brain")
Once the request reaches the backend, it flows through strict layers. This **Separation of Concerns** is crucial for clean architecture.

1.  **Controller Layer** (*"The Receptionist"*)
    *   **Role**: Accepts requests, validates input format, and hands off work.
    *   **Example**: `BookingController` receives a booking request. It doesn't calculate costs itself; it passes it to the Service.

2.  **Service Layer** (*"The Worker"*)
    *   **Role**: The brain. It handles business logic, calculations, and rules.
    *   **Example**: `BookingService` receives the raw booking. It generates a unique Booking ID (`BK...`), calculates the price based on weight, and decides if the booking is valid.

3.  **Repository Layer** (*"The Librarian"*)
    *   **Role**: The only layer allowed to touch the database. It speaks SQL (via Hibernate).
    *   **Example**: `BookingRepository` takes the fully prepared Booking object and saves it to the permanent storage table.

---

## 3. Microservices: Concept vs. Implementation

The user asked: *"How do microservices work, how do we implement that, and what is the use of it?"*

### What are Microservices?
In a **Monolithic** application (like a standard simple app), all features (User Management, Booking, Payment, Notification) live in **one single code project** running on **one server**.
*   *Problem*: If the "Payment" code crashes, the whole server crashes. If you need to update "Booking", you have to restart the "User" part too.

In a **Microservices Architecture**, we split these features into **separate, independent applications** that talk to each other over the network.

### How this Project Implements Modular Design
This project is a **Modular Monolith**. It is built in a way that *prepares* it for microservices but keeps it simple for development.

| Feature | How it works here (Monolith) | How it would work in Microservices |
| :--- | :--- | :--- |
| **User Service** | `UserService.java` class inside the main app. | A completely separate Spring Boot app running on Port 8081. |
| **Booking Service** | `BookingService.java` class inside the main app. | A completely separate Spring Boot app running on Port 8082. |
| **Communication** | Direct Java method calls: `userService.getUser()`. | HTTP Network calls: `http.get("localhost:8081/users")`. |
| **Database** | One shared H2 Database. | Each service has its *own* private database (e.g., BookingDB, UserDB). |

### Why use Microservices?
1.  **Scalability**: If millions of people are tracking parcels but only 10 are registering, you can launch 5 copies of the "Tracking Service" and only 1 "User Service".
2.  **Resilience**: If the "Booking Service" crashes, users can still log in and track existing parcels because those services are separate.
3.  **Technology Freedom**: You could write the "Booking Service" in Java and the "Invoice Service" in Python.

### How we implement "Microservice-like" behavior here
We use **REST APIs** (`@RestController`). Because our Backend exposes data via HTTP URLs (e.g., `/viewbookService`) instead of rendering HTML pages directly, the Frontend *treats* the Backend exactly like a microservice. You could technically swap out our backend for a Node.js one, and the Angular frontend wouldn't know the difference.

---

## 4. Detailed Data Flow: The "Life of a Packet"

Let's trace a **Parcel Booking** from start to finish to see all modules working together.

### Step 1: The Trigger (Frontend)
*   **User**: Fills out "Sender Name", "Receiver Name", "Weight: 500g" on `customer-booking.component.html`.
*   **Component**: Captures this data in a TypeScript object.
*   **Validation**: Checks if pickup time is valid (frontend logic).

### Step 2: The Transmission (Network)
*   **Service**: `DataService.createBooking()` is called.
*   **Action**: It fires an HTTP POST request to `http://localhost:8080/viewbookService`.
*   **Payload**: `{"customerName": "John", "weight": 500, ...}`.

### Step 3: The Processing (Backend Controller)
*   **Controller**: `BookingController.createBooking()` wakes up.
*   **Action**: It maps the JSON payload to a Java `Booking` object.
*   **Handoff**: Calls `bookingService.saveBooking(booking)`.

### Step 4: The Logic (Backend Service)
*   **Service**: `BookingService` takes over.
*   **Logic 1**: Generates a random ID: `BK98765`.
*   **Logic 2**: Calculates Cost. `if (weight > 1000) cost = 100 else cost = 50`.
*   **Logic 3**: Sets Status: `Pending Payment`.

### Step 5: The Storage (Database)
*   **Repository**: `BookingRepository.save()` is triggered.
*   **Hibernate**: Translates Java object -> SQL: `INSERT INTO Booking VALUES (...)`.
*   **H2 DB**: Writes the row to memory.

### Step 6: The Return Journey
*   The Database confirms save -> Repository confirms -> Service returns object -> Controller converts to JSON -> Sends HTTP 200 OK.
*   **Angular**: Receives the response, sees the new `BK98765` ID, and navigates the user to the Payment Page.

---

## 5. How to Run This Project

To run this distributed system, you need to start the **Server** and **Client** separately.

### Prerequisites
*   **Java JDK 17+**
*   **Node.js (LTS)**
*   **Maven**

### Execution Commands

**1. Start the Backend (The Brain)**
Open a terminal in the `backend/` folder:
```bash
mvn spring-boot:run
```
*Wait for: "Started ParcelServiceApplication in X seconds"*

**2. Start the Frontend (The Face)**
Open a terminal in the project root folder:
```bash
npm start
```
*Wait for: "Angular Live Development Server is listening on localhost:4200"*

**3. Access the App**
Open your browser and go to: `http://localhost:4200`


jdbc:h2:mem:parceldb