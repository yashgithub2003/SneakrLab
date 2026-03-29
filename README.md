👟 SneakrLab – E-Commerce Web Application

A modern e-commerce platform with secure authentication and role-based access control.

Recyclo is a full-stack web application designed to provide a seamless online shopping experience. It supports secure user authentication, product browsing, cart management, and role-based functionalities for users and administrators.

🚀 Key Features
👤 User Module
Browse products with detailed views
Add/remove items from cart
Place orders and manage purchases
🔐 Authentication System
Secure JWT-based authentication
User registration and login
Protected routes for authorized access
🛠 Admin Module
Manage product listings (add/update/delete)
Monitor user activity and orders
Role-based access control for admin operations
🛠 Tech Stack
Layer	Technology
Frontend	HTML, CSS, JavaScript
Backend	Node.js, Express.js
Database	MongoDB
Auth	JWT
🔄 System Workflow
User registers/logs in using JWT authentication
User browses products and adds items to cart
User places an order
Admin manages products and monitors orders
System ensures secure access via role-based control
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/yashgithub2003/SneakrLab.git
cd SneakrLab
2️⃣ Install Dependencies
npm install
3️⃣ Setup Environment Variables

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
4️⃣ Run the Server
npm start
5️⃣ Open in Browser
http://localhost:5000/s
