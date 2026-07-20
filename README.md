# 🖋️ InklyLog

InklyLog is a modern, full-stack social media blogging platform built with Next.js. It allows users to write rich-text articles, follow other creators, engage via real-time messaging, and interact with posts through likes, views, and comments.

---

## 🚀 Features

- **Robust Authentication**: Secure credential-based registration and login powered by `NextAuth.js`.
- **Rich Text Editor**: Interactive article creation and seamless viewing utilizing `Tiptap`.
- **Social Interactivity**: Follow/Unfollow user workflows, look up creators with real-time user search, and track post interactions (views, likes, and comments).
- **Real-Time Messaging**: Chat instantly with other creators using integrated `Socket.io` workflows.
- **Media Management**: Secure, high-performance image uploads and asset delivery integrated via `ImageKit`.
- **Responsive Styling**: Sleek user interface featuring a dynamic dark/light theme engine built using `Tailwind CSS`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Real-Time Engines**: WebSockets / Socket.io
- **Image Hosting**: ImageKit API
- **Styling**: Tailwind CSS

---

## 📂 Project Structure

```text
InklyLog-main/
├── app/                  # Next.js App Router (Pages & API Routes)
│   ├── api/              # Backend endpoints (auth, blogs, messages, interactions)
│   ├── dashboard/        # User workspace (writing, editing, profile settings)
│   ├── messages/         # Real-time chat interface windows
│   └── post/             # Publicly viewable dynamically routed articles
├── components/           # Reusable UI Blocks (Navbar, Editor, Search bars)
│   └── utils/            # Modular UI elements (trackers, buttons, tabs)
├── lib/                  # Core configurations (Mongoose init, Auth options, Sockets)
├── models/               # MongoDB Mongoose Data Schemas (User, Blog, Comment, Message)
└── public/               # Static web assets (Icons, default images)
```

---

## ⚙️ Getting Started

Follow these steps to configure and boot up your local instance of InklyLog.

### 1. Prerequisites
Ensure you have the following installed on your local environment:
- **Node.js** (v18.x or higher recommended)
- **MongoDB Instance** (Local Community Server or Atlas Cluster Cloud database)

### 2. Clone the Repository
```bash
git clone https://github.com
cd InklyLog
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment Variables
Create a file named `.env` in your root directory and supply the following configuration paths:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# NextAuth Config
NEXTAUTH_SECRET=your_nextauth_cryptographic_secret
NEXTAUTH_URL=http://localhost:3000

# ImageKit Media Provider API
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Socket Server (If deploying backend chat system externally)
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:3000
```

### 5. Running the Application

To run the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser to check the results.

To compile a production optimized build profile:
```bash
npm run build
npm run start
```

---

## 📝 License

This project is licensed under the MIT License. Feel free to modify and build upon it!
