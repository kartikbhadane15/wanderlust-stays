🏡 WanderLust (Airbnb-like Project)

An Airbnb-inspired web application where users can list properties, browse accommodations, and book stays. Built with Node.js, Express, MongoDB, and EJS/React (depending on your stack).


✨ Features

🔑 User Authentication (Signup/Login using Passport.js/JWT)

🏘️ Create, Edit, and Delete Property Listings

📍 Search & Filter by Location

🖼️ Image Uploads (Cloudinary/Local Storage)

⭐ Review & Ratings System

🛒 Booking and Reservation System

📱 Responsive Design with Bootstrap/Tailwind

🛠️ Tech Stack


Frontend: HTML, CSS, Bootstrap (or React if using SPA)

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ODM)

Authentication: Passport.js / JWT

Deployment: Render / Vercel / Heroku

Extras: Cloudinary for image uploads, Mapbox for geolocation (if added)


📂 Project Structure
📦 airbnb-clone
 ┣ 📂 models       # MongoDB Schemas
 ┣ 📂 routes       # Express Routes
 ┣ 📂 views        # EJS Templates (if using server-side rendering)
 ┣ 📂 public       # Static files (CSS, JS, Images)
 ┣ 📂 controllers  # Controller logic
 ┣ 📜 app.js       # Main server file
 ┣ 📜 package.json
 ┗ 📜 README.md


🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/kartikbhadane15/wanderlust-stays.git
cd airbnb-clone

2️⃣ Install dependencies
npm install

3️⃣ Set up environment variables

Create a .env file in the root folder and add:

MONGO_URI=your_mongo_connection_string
SESSION_SECRET=your_secret_key
CLOUDINARY_KEY=your_key (if using Cloudinary)
CLOUDINARY_SECRET=your_secret
MAPBOX_TOKEN=your_mapbox_token (if using maps)

4️⃣ Run the app
npm start


The app will run at: http://localhost:3000/

🧪 Sample Test User

Email: test@example.com

Password: 123456

📸 Screenshots

(Add some screenshots of your project UI here)


🤝 Contributing

Fork the repository

Create a feature branch (git checkout -b feature-name)

Commit your changes (git commit -m 'Add feature')

Push to branch (git push origin feature-name)

Open a Pull Request

📜 License

This project is licensed under the MIT License.