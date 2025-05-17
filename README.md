# jsd9-pheonix_wicianburi_grill-backend

## Project Overview and Purpose

This repository contains the backend for the jsd9-pheonix_wicianburi_grill e-commerce application. The backend is built using Node.js and Express, providing RESTful API endpoints to support the frontend application. Its primary purpose is to handle data management, business logic, user authentication, order processing, product management, reviews, and administrative functions for the e-commerce platform.

## Installation and Setup

To set up the backend locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd jsd9-pheonix_wicianburi_grill/backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend/` directory based on the `.env.example` (if available, otherwise refer to project documentation for required variables). This file should include database connection strings, API keys, and other configuration settings.

    Example `.env` content:

    ```env
    PORT=5000
    NODE_ENV=development
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    # Add other necessary environment variables
    ```

4.  **Database Setup:**
    Ensure you have a MongoDB instance running and accessible via the `MONGO_URI` specified in your `.env` file.

5.  **Run the application:**
    ```bash
    npm start
    ```
    The server should now be running, typically on port 5000 (or the port specified in your `.env` file).

## Project Structure

The backend project is organized as follows:

- [`controllers/`](backend/controllers/): Contains the logic for handling requests and interacting with models.
- [`middlewares/`](backend/middlewares/): Houses custom middleware functions for tasks like authentication, error handling, and rate limiting.
- [`models/`](backend/models/): Defines the Mongoose schemas for the database collections (e.g., User, Product, Order, Review, Admin).
- [`routes/`](backend/routes/): Defines the API endpoints and links them to the appropriate controller functions.
- [`utils/`](backend/utils/): Contains utility functions used across the application.
- [`server.js`](backend/server.js): The main entry point of the application, setting up the Express server, connecting to the database, and defining global middleware.

## Available API Endpoints

The backend provides the following main API endpoint categories:

- **`/api/products`**: Endpoints for fetching, adding, updating, and deleting product information.
- **`/api/users`**: Endpoints for user registration, authentication, profile management, and potentially user listing (for admin).
- **`/api/orders`**: Endpoints for creating, viewing, and managing user orders.
- **`/api/reviews`**: Endpoints for submitting, viewing, and managing product reviews.
- **`/api/admin`**: Endpoints for administrative tasks, requiring specific authentication and permissions (e.g., managing users, products, orders).

Detailed documentation for each endpoint, including request methods, parameters, and response formats, can be found in the [`routes.rest`](backend/routes.rest) file or dedicated API documentation (if available).

## Other Relevant Information

- **Authentication:** The backend uses JWT (JSON Web Tokens) for authentication. Users need to log in to receive a token, which must be included in the headers of protected routes.
- **Error Handling:** A centralized error handling middleware is implemented to provide consistent error responses.
- **Rate Limiting:** Rate limiting is applied to protect against abuse and ensure fair usage of the API.
- **Database:** MongoDB is used as the primary database. Mongoose is used as the ODM (Object Data Modeling) library.

This README provides a foundational understanding of the backend. For more detailed information on specific functionalities or code implementations, please refer to the respective files within the project structure.
