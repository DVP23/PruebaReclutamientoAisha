# PruebaReclutamientoAisha

Proyecto técnico de tareas usando **React** (frontend) y **Flask (Python)** (backend).

---

## 📦 Requisitos

- Node.js (preferentemente v16+)
- Python 3.9 o superior
- pip
- Git

---

## 🚀 Instrucciones de instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/DVP23/PruebaReclutamientoAisha.git
cd PruebaReclutamientoAisha
```

---

### 2. Configura el Backend (Flask)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # En Windows usa: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

> Esto levantará el backend en `http://localhost:5001`

---

### 3. Configura el Frontend (React)

```bash
cd ../prueba-aisha-tareas
npm install
npm run dev
```

> Esto iniciará el frontend en `http://localhost:5173` (o similar)

---

## 🛠️ Notas adicionales

- Asegúrate de que el backend esté corriendo antes de iniciar el frontend.
- Las credenciales del login deben coincidir con usuarios registrados (desde la pestaña de registro).

---

## 🧪 Tecnologías usadas

- React + Tailwind CSS
- Flask + SQLAlchemy
- SQLite como base de datos

---

## 📝 Licencia

Este proyecto es de uso libre para pruebas técnicas, entrevistas o aprendizaje personal.
