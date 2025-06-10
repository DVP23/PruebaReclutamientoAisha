from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Tarea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    descripcion = db.Column(db.Text)
    categoria = db.Column(db.String(50))
    punto_color = db.Column(db.String(50))
    borde_color = db.Column(db.String(50))
    estado = db.Column(db.String(20))

class Categoria(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), unique=True)
    color = db.Column(db.String(50))

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    correo = db.Column(db.String(120), unique=True, nullable=False)
    contra_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, contra):
        self.contra_hash = generate_password_hash(contra)
    
    def check_password(self, contra):
        return check_password_hash(self.contra_hash, contra)