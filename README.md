## 🚀 Getting Started

This project is structured with separate **frontend** and **backend** directories.

---

### 📁 Frontend

**Tech Stack:** Vite + React + TypeScript + [shadcn/ui](https://ui.shadcn.dev/)

#### Requirements

-   [Node.js](https://nodejs.org/) (v18 or later)
-   npm (comes with Node)

#### Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: [http://localhost:5173](http://localhost:5173)

---

### 📁 Backend

**Tech Stack:** FastAPI (Python 3.10+)

#### Requirements

-   [Python](https://www.python.org/) 3.10 or later

#### Setup

```bash
cd backend
python -m venv env
# Activate the virtual environment:
# On Windows:
env\Scripts\activate
# On macOS/Linux:
source env/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

The backend API will be available at: [http://localhost:8000](http://localhost:8000)
