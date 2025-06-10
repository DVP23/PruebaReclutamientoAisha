from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Tarea, Categoria, Usuario
import os

app = Flask(__name__)
CORS(app, resources={r"/*":{"origins": "*"}}, supports_credentials=True)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'tareas.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

    if Categoria.query.count() == 0:
        categorias_defecto = [
            { "nombre":"Trabajo", "color": "bg-red-600"},
            { "nombre":"Estudio", "color": "bg-blue-600"},
            { "nombre":"Casa", "color": "bg-purple-600"},
            { "nombre":"Familia", "color": "bg-green-600"},
            { "nombre":"Diversion", "color": "bg-yellow-600"},
        ]
        for c in categorias_defecto:
            db.session.add(Categoria(nombre=c["nombre"], color=c["color"]))
        db.session.commit()

@app.route("/tareas", methods=["GET"])
def obtener_tareas():
    tareas = Tarea.query.all()
    return jsonify([{
        "id": t.id,
        "nombre": t.nombre,
        "descripcion": t.descripcion,
        "categoria": t.categoria,
        "puntoColor": t.punto_color,
        "bordeColor": t.borde_color,
        "estado": t.estado
    } for t in tareas])

@app.route("/tareas", methods=["POST"])
def crear_tarea():
    data = request.json
    nueva = Tarea(
        nombre=data["nombre"],
        descripcion=data["descripcion"],
        categoria=data["categoria"],
        punto_color=data["puntoColor"],
        borde_color=data["bordeColor"],
        estado=data["estado"]
    )
    db.session.add(nueva)
    db.session.commit()
    return jsonify({"mensaje": "Tarea guardada"}), 201

@app.route("/tareas/<int:id>", methods=["DELETE", "OPTIONS"])
def eliminar_tarea(id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    tarea = Tarea.query.get(id)
    if not tarea:
        return jsonify({"error": "Tarea no encontrada"}), 404
    db.session.delete(tarea)
    db.session.commit()
    return jsonify({"mensaje": "Tarea eliminada"}), 200

@app.route("/tareas/<int:id>", methods=["PUT", "OPTIONS"])
def actualizar_tarea(id):
    if request.method == "OPTIONS":
        return jsonify({}),200
    tarea = Tarea.query.get(id)
    if not tarea:
        return jsonify({"error": "Tarea no encontrada"}), 404
    data = request.json
    tarea.estado = data.get("estado", tarea.estado)
    db.session.commit()
    return jsonify({"mensaje", "Tarea actualizada"}), 200

@app.route("/categorias", methods=["GET"])
def get_categorias():
    categorias = Categoria.query.all()
    return jsonify([
        {"id": c.id, "nombre": c.nombre, "color": c.color}
        for c in categorias
    ])

@app.route("/categorias", methods=["POST"])
def crear_categoria():
    data = request.json
    if not data.get("nombre") or not data.get("color"):
        return jsonify({"error": "Faltan datos"}), 400
    
    if Categoria.query.filter_by(nombre=data["nombre"]).first():
        return jsonify({"error": "Categoria ya existe"}), 409
    
    nueva = Categoria(nombre=data["nombre"], color=data["color"])
    db.session.add(nueva)
    db.session.commit()
    return jsonify({"mensaje": "Categoria creada"}), 201

@app.route("/registro", methods=["POST"])
def registrar_usuario():
    data = request.json
    if not data.get("correo") or not data.get("contra"):
        return jsonify({"error": "Correo y contraseña requerido"}), 400
    
    if Usuario.query.filter_by(correo=data["correo"]).first():
        return jsonify({"error": "El correo ya fue registrado"}), 409
    
    nuevo_usuario = Usuario(correo=data["correo"])
    nuevo_usuario.set_password(data["contra"])
    db.session.add(nuevo_usuario)
    db.session.commit()
    return jsonify({"mensaje": "Usuario registrado correctamente"}), 201

@app.route("/login", methods=["POST"])
def login_usuario():
    data = request.json
    if not data.get("correo") or not data.get("contra"):
        return jsonify({"error": "Correo y contraseña requeridos"}), 400
    
    usuario = Usuario.query.filter_by(correo=data["correo"]).first()
    if not usuario or not usuario.check_password(data["contra"]):
        return jsonify({"error": "Validaciones incorrectas"}), 401
    
    return jsonify({"mensaje": "Login exitoso", "usuario_id": usuario.id})


if __name__ == "__main__":
    app.run(debug=True, port=5001)