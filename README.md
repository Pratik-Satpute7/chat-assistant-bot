# 🤖 AI Chat Application

An advanced full-stack AI-powered chat application that enables users to interact with an AI model in real time. The system supports multiple chat sessions, maintains conversation history, and provides context-aware responses using AI. Additional features like voice input, text-to-speech, and markdown rendering enhance the overall user experience.

---

## ⚙️ Setup / Installation

### 🔹 1. Clone the Repository
```bash
git clone https://github.com/Pratik-Satpute7/chat-assistant-bot.git
cd ai-chat-application
````

---

### 🔹 2. Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment

# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload

### 🔹 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

---

### 🔹 4. Environment Variables

Create a `.env` file inside the backend folder:

```env
DATABASE_URL=your_postgresql_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🌐 Live Demo

🔗 [https://chat-assistant-bot.netlify.app](https://chat-assistant-bot.netlify.app)

---

## ✨ Features

* Multiple Chat Sessions
* Chat History with Context Awareness
* Rename and Delete Chat
* Voice Input (Speech-to-Text)
* Text-to-Speech (Audio Playback)
* Copy Message Functionality
* Markdown Rendering
* Loader / Typing Indicator
* Dark and Light Mode
* Ai Model Selection

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS
* Bootstrap
* Axios / Fetch
* React Markdown
* FontAwesome

### Backend

* FastAPI
* SQLAlchemy

### Database

* PostgreSQL

### Authentication

* Google OAuth

### AI Integration

* Gemini API (Model: gemini-2.5-flash)

---

## 🧠 How It Works

1. User logs in using Google OAuth
2. User creates or selects a chat session
3. User sends a message
4. Backend stores the message in PostgreSQL
5. Previous messages are fetched for context
6. Request is sent to Gemini API
7. AI generates a response
8. Response is stored and returned to frontend

---

## 📡 API Endpoints

| Method | Endpoint                      | Description                   |
| ------ | ----------------------------- | ----------------------------- |
| POST   | /auth/google-login            | User login using Google OAuth |
| POST   | /session/create               | Create new chat session       |
| GET    | /session/list                 | Get all user chat sessions    |
| PUT    | /session/rename/{session_id}  | Rename chat session           |
| DELETE | /session/delete/{session_id}  | Delete chat session           |
| POST   | /session/generate-title       | Generate smart chat title     |
| POST   | /message/send                 | Send message to AI            |
| GET    | /message/history/{session_id} | Get chat history              |

---

## 🗄️ Database Design

**Database Name:** `aichatdb`

### Tables:

* users
* sessions
* messages

### Relationships:

* One User → Many Sessions
* One Session → Many Messages

---

## 🏗️ Architecture

```
React Frontend → FastAPI Backend → Gemini API
                        ↓
                   PostgreSQL
```


## 👨‍💻 Author

* Pratik Satpute

---
