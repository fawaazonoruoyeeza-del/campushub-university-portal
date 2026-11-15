# CampusHub — Student Management System

A responsive student-record management web application built with **HTML, CSS, JavaScript, React and a REST API**.

## Features
- Dashboard with total, active, inactive and department counts
- View student records in a searchable directory
- Filter records by Active or Inactive status
- Add, edit and delete student records
- Responsive layout for desktop and mobile
- REST API communication using `fetch()`
- Sample student data stored in `db.json`

## Requirements
Install Node.js (LTS) from https://nodejs.org/ and use a terminal in this project folder.

## Run the project
1. Extract the ZIP file.
2. Open the extracted `student-management-system` folder in VS Code.
3. Install the packages:
   ```bash
   npm install
   ```
4. Open a terminal and start the API server:
   ```bash
   npm run server
   ```
   The API will run at `http://localhost:3001/students`.
5. Open a **second terminal** in the same project folder and start React:
   ```bash
   npm run dev
   ```
6. Open the local address printed by Vite, usually `http://localhost:5173`.

Keep both terminals running while using the application.

## How the technologies are used
- **HTML:** `index.html` provides the page document and the root element where React displays the application.
- **CSS:** `src/styles.css` controls colours, spacing, layout, tables, forms and mobile responsiveness.
- **JavaScript:** Handles form submission, searching, filtering, validation, calculations and API requests.
- **React:** `src/App.jsx` builds the interface from reusable components and uses state/effects to update the screen.
- **REST API:** `src/api.js` sends HTTP requests to JSON Server. `GET` reads students, `POST` adds a student, `PUT` updates a student and `DELETE` removes a student.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/students` | Retrieve all students |
| POST | `/students` | Add a student |
| PUT | `/students/:id` | Update a student |
| DELETE | `/students/:id` | Delete a student |

JSON Server is used as a lightweight local REST API for this demonstration. It stores records in `db.json`. This is a learning/demo project, not a production system: it does not include authentication, role permissions or a hosted database.

## Suggested project demonstration
1. Open the dashboard and explain the summary cards.
2. Search for a student by name or ID.
3. Filter the directory by student status.
4. Add a sample student and show it appearing in the table.
5. Edit the student's details.
6. Delete the sample record.
7. Explain how the React frontend sends requests to the REST API.
