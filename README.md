# SpiceBite Restaurant Website

SpiceBite is a full-stack restaurant website with a modern customer-facing frontend, online table reservation system, secure admin login, and an admin dashboard for managing bookings.

The project is built with plain HTML, CSS, and JavaScript on the frontend, and Node.js, Express.js, MongoDB, Mongoose, JWT, and bcrypt on the backend.

## Project Highlights

- Elegant dark-themed restaurant website
- Responsive layout for desktop, tablet, and mobile
- Interactive menu filtering
- Smooth scroll navigation
- Gallery lightbox preview
- Animated statistics section
- Booking form connected to a real backend API
- MongoDB Atlas database integration
- Admin authentication with JWT
- Password hashing using bcrypt
- Protected admin booking routes
- Admin dashboard to view and delete reservations
- Clean backend architecture with models, routes, controllers, middleware, and config files

## Live Features

### Customer Website

Customers can:

- Browse restaurant sections such as Home, Menu, About, Gallery, Booking, and Contact
- Filter menu items by category
- View gallery images in a lightbox
- Submit a table reservation
- Receive success or error feedback after submitting the form
- Open WhatsApp chat from the floating contact button
- View the restaurant location through embedded Google Maps

### Booking System

The booking form collects:

- Full name
- Phone number
- Date
- Time
- Number of guests
- Special requests

The frontend sends the booking data to:

```txt
POST http://localhost:5000/api/bookings
```

The backend validates the data, checks that the selected date is not in the past, and stores valid bookings in MongoDB.

### Admin System

Admins can:

- Log in with email and password
- Receive a JWT token after successful login
- View all customer bookings
- Delete bookings
- Refresh booking data
- Log out securely

Protected admin requests use:

```txt
Authorization: Bearer <token>
```

## Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts
- Google Maps iframe

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- nodemon

## Folder Structure

```txt
SPICE-BITE/
├── assets/
│   └── images/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Admin.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── bookingRoutes.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── admin.html
│   ├── admin.css
│   └── admin.js
├── index.html
├── style.css
├── script.js
└── README.md
```

## Backend API Routes

### Public Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | API health check |
| POST | `/api/bookings` | Create a new booking |
| POST | `/api/auth/login` | Admin login |

### Protected Admin Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/bookings` | Get all bookings |
| DELETE | `/api/bookings/:id` | Delete a booking |

## Environment Variables

Create a `.env` file inside the `backend/` folder.

Use [backend/.env.example](backend/.env.example) as a template:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/spicebiteDB?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_secret
ADMIN_EMAIL=admin@spicebite.com
ADMIN_PASSWORD=ChangeThisPassword123
```

Important:

- Never commit your real `.env` file to GitHub.
- Use a strong `JWT_SECRET`.
- Use a strong admin password.
- If your MongoDB password contains special characters, URL encode them.

Example:

```txt
@ becomes %40
# becomes %23
/ becomes %2F
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/spicebite.git
cd spicebite
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create `backend/.env` and add:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
ADMIN_EMAIL=admin@spicebite.com
ADMIN_PASSWORD=your_secure_password
```

### 4. Create the First Admin User

```bash
npm run create-admin
```

If the admin already exists, the script will safely skip creating a duplicate.

### 5. Start the Backend Server

For development:

```bash
npm run dev
```

For production-style start:

```bash
npm start
```

The backend runs at:

```txt
http://localhost:5000
```

## Running the Frontend

Open `index.html` directly in your browser, or use VS Code Live Server.

With Live Server, the customer website usually runs at:

```txt
http://127.0.0.1:5500/index.html
```

or:

```txt
http://localhost:5500/index.html
```

## Accessing the Admin Dashboard

Open:

```txt
http://127.0.0.1:5500/frontend/admin.html
```

or:

```txt
http://localhost:5500/frontend/admin.html
```

Login using the admin credentials from your `backend/.env` file:

```txt
Email: ADMIN_EMAIL
Password: ADMIN_PASSWORD
```

## How the Booking Flow Works

1. Customer fills out the booking form on `index.html`.
2. `script.js` validates required fields on the frontend.
3. The form sends a `POST` request to the backend.
4. Express receives the request at `/api/bookings`.
5. The controller validates the phone, date, time, and required fields.
6. Mongoose saves the booking in MongoDB.
7. The frontend shows a success message and resets the form.
8. Admin can log in and view the new booking in the dashboard.

## Security Features

- Admin passwords are hashed with bcrypt before saving
- JWT tokens expire after 1 day
- Booking list and delete routes are protected
- Invalid or expired tokens return `401 Unauthorized`
- Sensitive credentials are stored in environment variables
- Backend uses structured validation before saving bookings

## Production Notes

Before deploying:

- Add `.env` to `.gitignore`
- Replace development secrets with secure production secrets
- Restrict CORS to your deployed frontend domain
- Use HTTPS in production
- Use a process manager such as PM2 or a hosting platform such as Render, Railway, or Heroku
- Use MongoDB Atlas network rules carefully
- Rotate admin passwords regularly

## Suggested `.gitignore`

If you do not already have a `.gitignore`, add one:

```gitignore
node_modules/
.env
backend/.env
npm-debug.log*
.DS_Store
```

## Benefits

- Saves time by automating reservation collection
- Reduces manual booking errors
- Gives restaurant staff a simple admin dashboard
- Keeps customer booking and admin management separated
- Uses a scalable backend structure suitable for adding more features
- Protects admin data with hashed passwords and JWT authentication
- Works with plain frontend files, so no frontend build step is required

## Future Improvements

- Add booking status such as pending, confirmed, or cancelled
- Add email or WhatsApp notifications
- Add admin search and filters
- Add pagination for large booking lists
- Add role-based admin users
- Add deployment configuration
- Add automated tests for API routes

## Author

SpiceBite Restaurant Website - Full-stack restaurant booking system.

