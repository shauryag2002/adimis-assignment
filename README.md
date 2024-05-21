# User Registration Form

This project is a user registration form built using React, TypeScript, Zod, and Supabase. It demonstrates how to create a form with validation, file uploads, and data persistence.
- [Demo of Website](https://adimis-assignment-shauryag2002-shauryag2002s-projects.vercel.app?_vercel_share=8cH7yYMdVyYg8FRjkJy0AobwIkYrKgTA)
## Features

- User input fields with validation
- Profile picture upload
- Data persistence using localStorage
- Integration with Supabase for data storage and retrieval

## Technologies Used

- React
- TypeScript
- Zod for schema validation
- Supabase for backend services
- `@adimis/react-formix` for form management
- `uuid` for unique ID generation

## Prerequisites

- Node.js
- npm
- Supabase account

## Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/shauryag2002/adimis-assignment.git
   cd adimis-assignment
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Create a `.env` file:**
   ```sh
   touch .env
   ```

   Add your Supabase project URL and anon key to the `.env` file:
   ```sh
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON=your-supabase-anon-key
   ```

4. **Set up Supabase:**
   - Create a new Supabase project.
   - Set up a `users` table with the following columns:
     - `id` (integer, primary key)
     - `username` (text)
     - `email` (text)
     - `address` (text)
     - `phone` (text)
     - `password` (text)
     - `gender` (text)
     - `terms` (boolean)
     - `file` (text) [URL to uploaded file]
     - `date` (TIMESTAMPZ)
     - `year` (integer)
     - `expertise` (JSONB [Array of strings])

   - Set up a storage bucket named `profile-pictures` for uploading profile pictures.

5. **Run the development server:**
   ```sh
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) to view the app in the browser.

## Usage

1. **Fill out the form:**
   - Enter your username, email, address, phone number, password, gender, and expertise.
   - Accept the terms and conditions.
   - Upload a profile picture.
   - Select the date and year.

2. **Submit the form:**
   - Click the "Submit" button to submit the form.
   - The form data will be validated and saved to Supabase.
   - The profile picture will be uploaded to Supabase storage.

3. **Data Persistence:**
   - The form data will be saved in localStorage.
   - On subsequent visits, the form will be pre-filled with the saved data.

## Code Overview

### `src/App.tsx`

This is the main component that renders the user registration form. It includes the form fields, validation logic, and file upload functionality.

### `src/SupabaseClient.ts`

This file initializes the Supabase client using the environment variables.

### `README.md`

This file provides setup and usage instructions for the project.

---

For any questions, contact me at [guptashaurya2002@gmail.com].
___
Thank you...!