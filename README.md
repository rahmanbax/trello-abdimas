# Trello Abdimas - Project Management Tool

![Product Catalog App Screenshot](https://i.postimg.cc/yYDbDGsy/Screenshot-2026-06-22-221523.png)

A web-based project management application inspired by Trello, specifically designed to help manage, organize, and track community service (Pengabdian Masyarakat / Abdimas) projects.

## Features

- **Authentication**: Secure Login and Registration system using token-based authentication (stored in localStorage & cookies).
- **Owner Dashboard**: An intuitive overview of all projects, featuring a custom academic semester filter (e.g., 2024/2025 - Ganjil/Genap) that persists via local storage.
- **Kanban Task Board**: A rich drag-and-drop interface for managing tasks across different progression states (To Do, In Progress, Done).
- **Task Management**: Create, assign, and track tasks with descriptions and Google Drive documentation links.
- **Modern UI/UX**: Smooth interactions, glassmorphism elements, custom modals, hover effects, and toast notifications.

## Tech Stack

### Core Framework
- **Laravel**: Used as the primary framework for routing and serving views via Blade templates.

### Frontend Technologies
- **HTML/Blade Templating**: Modular view structuring.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and responsive design (bundled with Vite).
- **Vanilla CSS**: Custom styling for intricate components like the horizontal scrolling Kanban boards, datepickers, and custom dropdowns.
- **Vanilla JavaScript & ES6**: Handles asynchronous API requests (`fetch` and `$.ajax`), DOM manipulations, and local state management.

### Libraries & Dependencies
- **jQuery (3.7.1) & jQuery UI**: Powering the seamless drag-and-drop (`Sortable`) functionality for the task cards.
- **Phosphor Icons**: Clean and modern iconography.
- **Toastr**: Lightweight library for non-blocking flash notifications.
- **Vite**: Next-generation frontend tooling for fast development and asset bundling.

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trello-abdimas
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Install NPM Dependencies**
   ```bash
   npm install
   ```

4. **Environment Setup**
   Copy the example environment file and generate an application key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Run the Development Servers**
   To work on this project locally, you need to run both Laravel's local development server and Vite's asset bundler simultaneously:
   
   Terminal 1 (Laravel Server):
   ```bash
   php artisan serve
   ```
   
   Terminal 2 (Vite):
   ```bash
   npm run dev
   ```

6. **Access the Application**
   Open your browser and navigate to `http://127.0.0.1:8000`

## Key File Structure

- `resources/views/` - Contains all application interfaces (Authentication, Owner Dashboard, Project Views).
- `public/assets/js/` - Core JavaScript logic (e.g., API interactions, Kanban logic in `owner-dashboard.js`).
- `public/assets/css/` - Custom design overrides and board styling.
- `routes/` - Web and API route definitions.

## Authors

Developed for the Abdimas Project Management initiative.
