import { useState } from "react";

const BACKEND_URL = "http://localhost:5001";

function Login({ onLoginSuccess, onSwitch }){
    const [form, setForm] = useState({ correo: "", contra: ""});
    const [error, setError] = useState("");


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch(`${BACKEND_URL}/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if(!res.ok){
                setError(data.error || "Error al iniciar sesion");
                return;
            }
            localStorage.setItem("token", data.token);
            onLoginSuccess();
        } catch (err){
            setError("Error de red");
        }
    };

    return(
        <form onSubmit={handleLogin} className="bg-white p-4 rounded shadow max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">Iniciar Sesion</h2>            
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Entrar</button>
        <p className="mt-2 text-sm text-center">
            ¿No tienes cuenta?
            <button
                type="button"
                onClick={onSwitch}
                className="text-blue-600 hover:underline ml-1"
            >
                Registrate aqui
            </button>
        </p>
        </form>
    );
}

export default Login;