import React from "react";

function AddTaskModal({isOpen, onClose, onSave, categorias}){
    if(!isOpen) return null;

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">
                    Agregar Tarea
                </h2>

                <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const data = {
                            nombre: formData.get("nombre"),
                            categoria: formData.get("categoria"),
                            descripcion: formData.get("descripcion"),
                        };
                        onSave(data);
                    }}
                >
                <div className="mb-4">
                    <label className="block text-sm mb-1">
                        Nombre de la tarea
                    </label>
                    <input
                        name="nombre"
                        type="text"
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm mb-1">
                        Selecciona la categoria
                    </label>
                    <select
                        name="categoria"
                        required
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Elige una opcion</option>
                        {categorias.map((cat, index) => (
                            <option key={index} value={cat.nombre}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-1">
                        Descripcion
                    </label>
                    <textarea 
                        name="descripcion" 
                        rows="3"
                        className="w-full border rounded px-3 py-2"
                    >
                    </textarea>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    </div>
    )
}

export default AddTaskModal;