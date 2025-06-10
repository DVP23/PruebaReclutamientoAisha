import { useState, useEffect, useRef } from 'react'
import AddTaskModal from './components/AddTaskModal'
import Login from './components/Login';
import Register from './components/Register';

const BACKEND_URL = "http://localhost:5001";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [tareas, setTareas] = useState([]);
  const [vistaActual, setVistaActual] = useState("pendientes");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [categorias, setCategorias] = useState([
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const coloresGlobales = useRef([
    "bg-pink-500", "bg-orange-500", "bg-cyan-500", "bg-lime-500", "bg-emerald-500", "bg-teal-500", "bg-sky-500", "bg-indigo-500", "bg-fuchsia-500", "bg-rose-500"
  ]);

  const coloresBordeDisponibles = useRef([
    "border-red-500", "border-blue-500", "border-purple-500", "border-pink-500", "border-yellow-500", "border-green-500", "border-orange-500", "border-cyan-500", "border-rose-500"
  ]);

  const getDotColor = (color) => {
    const map ={
      "bg-red-600": "bg-red-600",
      "bg-blue-600": "bg-blue-600",
      "bg-purple-600": "bg-purple-600",
      "bg-green-600": "bg-green-600",
      "bg-yellow-600": "bg-yellow-600",
      "bg-pink-500": "bg-pink-500",
      "bg-orange-500": "bg-orange-500",
      "bg-cyan-500": "bg-cyan-500",
      "bg-lime-500": "bg-lime-500",
      "bg-emerald-500": "bg-emerald-500",
      "bg-teal-500": "bg-teal-500",
      "bg-sky-500": "bg-sky-500",
      "bg-indigo-500": "bg-indigo-500",
      "bg-fuchsia-500": "bg-fuchsia-500",
      "bg-rose-500": "bg-rose-500",
    };
    return map[color] || "bg-gray-300";
  };

  const getBorderColor = (color) => {
    const map ={
      "border-red-500": "border-red-500",
      "border-blue-500": "border-blue-500",
      "border-purple-500": "border-purple-500",
      "border-pink-500": "border-pink-500",
      "border-yellow-500": "border-yellow-500",
      "border-green-500": "border-green-500",
      "border-orange-500": "border-orange-500",
      "border-cyan-500": "border-cyan-500",
      "border-rose-500": "border-rose-500"
    };
    return map[color] || "border-gray-300";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if(!isLoggedIn) return;

    fetch(`${BACKEND_URL}/categorias`)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al obtener categorias:", err));
  }, [isLoggedIn]);

  useEffect(()=> {
    if(!isLoggedIn) return;

    fetch(`${BACKEND_URL}/tareas`)
      .then((res) => res.json())
      .then((data) => setTareas(data))
      .catch((err) => console.error("Error al obtener las tareas:", err));
  }, [isLoggedIn]);

  const handleCrearCategoria = () => {
    if(!nuevaCategoria.trim()) return;

    const nombre = nuevaCategoria.trim();

    if(categorias.find((c) => c.nombre === nombre)){
      alert("Lo sentimos. Ya existe una categoria con ese nombre.");
      return;
    }

    if(coloresGlobales.current.length === 0){
      alert("Ya no hay colores disponibles para nuevas categorias.");
      return;
    }

    const index = Math.floor(Math.random() * coloresGlobales.current.length);
    const color = coloresGlobales.current.splice(index, 1)[0];

    const nueva = {nombre, color};

    fetch(`${BACKEND_URL}/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nueva),
    })
    .then((res) => {
      if (!res.ok) throw new Error("Error al guardar la categoria");
      return fetch(`${BACKEND_URL}/categorias`);
    })
    
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al crear la categoria:", err));

    setNuevaCategoria("");
  };
  
  const handleSave = (data) => {
    const categoria = categorias.find((c) => c.nombre === data.categoria);

    if(!categoria) return;

    const coloresDisponibles = coloresBordeDisponibles.current.filter(
      (color) => !categoria.color.includes(color.replace("border-", "bg-"))
    );

    const colorBorde = coloresDisponibles[
      Math.floor(Math.random() * coloresDisponibles.length)
    ];

    const nuevaTarea = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      categoria: data.categoria,
      puntoColor: categoria.color,
      bordeColor: colorBorde,
      estado: "pendiente"
    };

    fetch(`${BACKEND_URL}/tareas`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(nuevaTarea)
    })
      .then((res) => res.ok && fetch(`${BACKEND_URL}/tareas`))
      .then((res) => res.json())
      .then((data) => setTareas(data))
      .catch((err) => console.error("Error al guardar tarea:", err));

    setShowModal(false);
  };
  
  const handleFinalizar = (id) => {
    fetch(`${BACKEND_URL}/tareas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ estado: "finalizada"}),
    })
      .then((res) => {
        if(!res.ok) throw new Error("No se pudo actualizar");
        return fetch(`${BACKEND_URL}/tareas`);
      })
      .then((res) => res.json())
      .then((data) => setTareas(data))
      .catch((err) => console.error("Error ak actualizar tarea:", err));
  };

  const handleEliminarTarea = (id) => {
    fetch(`${BACKEND_URL}/tareas/${id}`, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if(!res.ok) throw new Error("No se pudo eliminar");
      return fetch(`${BACKEND_URL}/tareas`);
    })
    .then((res) => res.json())
    .then((data) => setTareas(data))
    .catch((err) => console.error("Error al eliminar tarea:", err));
  }

  const handleSeleccionCategoria = (nombre) => {
    setCategoriaSeleccionada((prev) => (prev === nombre ? null : nombre));
  };

  if(!isLoggedIn){
    return showRegister ? (
      <Register
        onRegisterSuccess={() => setShowRegister(false)}
        onSwitch={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLoginSuccess={() => setIsLoggedIn(true)}
        onSwitch={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>
          Mis tareas
        </h1>
        <div className='flex gap-2'>
        <button
          onClick={() => setShowModal(true)}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Agregar tarea
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }}
          className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
        >  
          Cerrar sesion
        </button>
        </div>
      </div>
      <div className='bg-white p-4 rounded shadow mb-6 max-w-md mx-auto'>
        <h2 className='text-lg font-semibold mb-2'>Crear nueva categoria</h2>
        <div className='flex gap-2'>
          <input
            type="text"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            placeholder='Nombre de la nueva categoria'
            className='flex-1 border rounded px-3 py-2'
          />
          <button 
            onClick={handleCrearCategoria}
            className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
          >
            Crear
          </button>
        </div>
      </div>
      <div className='flex justify-center mb-6'>
        <div className='inline-flex rounded-full bg-gray-200 p-1'>
          <button
            onClick={()=> setVistaActual("pendientes")}
            className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${vistaActual === "pendientes" ? "bg-white text-black shadow" : "text-gray-600"
            }`}
          >
            Tareas Pendientes
          </button>
          <button
            onClick={() => setVistaActual("finalizadas")}
            className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
              vistaActual === "finalizadas" ? "bg-white text-black shadow" : "text-gray-600"
            }`}
          >
            Tareas Finalizadas
          </button>
        </div>
      </div>
      <div className='flex gap-6'>
        <div className='w-48 bg-gray-100 p-4 rounded shadow text-sm'>
          <h3 className='font-semibold mb-2'>Categorias</h3>
          <ul className='space-y-2'>
            {categorias.map((cat, idx) => (
              <li 
                key={idx} 
                className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded ${categoriaSeleccionada === cat.nombre ? "bg-blue-100 font-semibold" : ""}`}
              onClick={() => handleSeleccionCategoria(cat.nombre)}
              >
                <span className={`w-3 h-3 rounded-full ${getDotColor(cat.color)}`}></span>
                <span>{cat.nombre}</span>
              </li>
            ))}
          </ul>

        {categoriaSeleccionada && (
          <button
            onClick={() => setCategoriaSeleccionada(null)}
            className='mt-4 text-blue-600 text-sm underline hover:text-blue-800'
          >
            Mostrar todas las categorias
          </button>
        )}
        </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1'>
      {tareas
      .filter((t)=> t.estado === vistaActual.slice(0,-1))
      .filter((t) => 
        categoriaSeleccionada ? t.categoria === categoriaSeleccionada : true
      ).length === 0 && (
        <p className='text-center text-gray-500 col-span-full'>
          No hay tareas en esta vista.
        </p>
      )}
      {tareas
      .filter((t)=> t.estado === vistaActual.slice(0,-1))
      .filter((t) => categoriaSeleccionada ? t.categoria === categoriaSeleccionada : true )
      .map((tarea)=>(
        <div
          key={tarea.id}
          className={`rounded p-4 shadow flex flex-col justify-between border-2 ${getBorderColor(tarea.bordeColor)} ${ tarea.estado === "finalizada" ? "bg-green-100" : "bg-white"}`}
        >
          <div>
            <h3 className='font-semibold text-lg mb-1'>{tarea.nombre}</h3>
            <p className='text-xs mt-2 text-gray-500'>
              Categoria: {tarea.categoria}
            </p>
            <p className='text-sm text-gray-700'>{tarea.descripcion}</p>
          </div>

          <div className='flex justify-between items-center mt-4'
          >
              <span
                className={`w-4 h-4 rounded-full ${getDotColor(tarea.puntoColor)}`}
                title={tarea.categoria}
              ></span>
            <div className='flex gap-2'>
            {tarea.estado === "pendiente" ? (
              <button
                onClick={() => handleFinalizar(tarea.id)}
                className='px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm'
              >
                Finalizar tarea
              </button>
            ): (
              <p className='mt-4 text-sm text-green-600 font-semibold'>
                Tarea finalizada 
              </p>
            )}
            <button
              onClick={() => handleEliminarTarea(tarea.id)}
              className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm'
            >
              Eliminar tarea
            </button>
            </div>
          </div>
        </div>
      ))}
      </div>
      </div>
      <AddTaskModal 
        isOpen={showModal}
        onClose={()=> setShowModal(false)}
        onSave={handleSave}
        categorias={categorias}
      />


    </div>
  )
}

export default App
