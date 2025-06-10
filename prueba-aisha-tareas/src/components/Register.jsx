import { useState } from "react";

const BACKEND_URL = "http://localhost:5001";

function Register({ onRegisterSuccess }){
    const [form, setForm] = useState({nombre: "", correo: "", contra:""});
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch(`${BACKEND_URL}/registro`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if(!res.ok){
                setError(data.error || "Error al registrarse");
                return;
            }

            onRegisterSuccess();
        } catch (err){
            setError("Error de red");
        }
    }

return(
    <form onSubmit={handleRegister} className="bg-white p-4 rounded shadow max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">Crear Cuenta</h2>
        <input 
            type="text"
            name="nombre"
            placeholder="Nombre Completo"
            value={form.nombre}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            required
        />
        <input 
            type="email"
            name="correo"
            placeholder="Correo electronico"
            value={form.correo}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            required
        />
        <input 
            type="password"
            name="contra"
            placeholder="Contraseña"
            value={form.contra}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">Registrarse</button>
    </form>
);
}

export default Register;