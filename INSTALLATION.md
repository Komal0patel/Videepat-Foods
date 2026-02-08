# Food Delivery Platform - New Tech Stack

This project has been migrated to a modern, scalable tech stack:
- **Backend:** Django + Django REST Framework + MongoDB (via MongoEngine)
- **Admin Panel:** React + Tailwind CSS + Vite
- **Website:** React + Tailwind CSS + Vite

## 🚀 Getting Started

### 1. Backend (Django)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt (or manually install dependencies)
python manage.py migrate
python manage.py runserver
```

**Credentials:**
- Admin: `admin` / `admin123`

### 2. Admin Frontend
```bash
cd admin-frontend
npm install
npm run dev
```

### 3. Website Frontend
```bash
cd website-frontend
npm install
npm run dev
```

## 🏗️ Architecture
- **API-First:** The backend provides a pure REST API consumed by both the admin and website.
- **Dynamic Content:** The Page Builder allows non-technical users to create pages, which are served as JSON and rendered dynamically by the website's `BlockRenderer`.
- **Flexible Data:** MongoDB handles complex nested structures for page content and product attributes.
