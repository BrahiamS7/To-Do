import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiTrash } from "react-icons/ci";
import { FiLogOut, FiPlusCircle } from "react-icons/fi";

const Home = () => {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [msg, setMsg] = useState("");
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [notas, setNotas] = useState([]);

  const handleLogOut = () => {
    fetch(`${url}/api/usuarios/logOut`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        cargarUser();
        setMsg(data.msg);
        setTimeout(() => setMsg(""), 5000);
      });
  };

  const cargarUser = () => {
    fetch(`${url}/api/usuarios/user`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          navigate("/");
          return;
        }
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
          cargarNotas(data.user.id);
        }
      })
      .catch(() => {
        navigate("/");
      });
  };

  const changeStatus = (id) => {
    fetch(`${url}/api/notas/cambiarEst/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        cargarUser();
        setMsg(data.msg);
        setTimeout(() => setMsg(""), 5000);
      });
  };

  const deleteNota = (id) => {
    fetch(`${url}/api/notas/delete/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        cargarUser();
        setMsg(data.msg);
        setTimeout(() => setMsg(""), 5000);
      });
  };

  const cargarNotas = (userId) => {
    fetch(`${url}/api/notas/buscar/${userId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setNotas(data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${url}/api/notas/add`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, contenido, user }),
    })
      .then(async (res) => {
        const data = await res.json();
        setMsg(data.msg);
        setTimeout(() => setMsg(""), 5000);
        setContenido("");
        setTitulo("");
        cargarUser();
      })
      .catch(() => {
        setMsg("Error en el servidor");
      });
  };

  useEffect(() => {
    cargarUser();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
            📒 Mis Notas
          </h2>
          <p className="text-gray-600 mt-1">
            Bienvenid@ <span className="font-semibold">{user.username}</span>
          </p>
        </div>
        <button
          onClick={handleLogOut}
          className="mt-3 md:mt-0 flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors duration-200 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
        >
          <FiLogOut /> Cerrar sesión
        </button>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
          <FiPlusCircle /> Agregar nueva nota
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
          />
          <textarea
            rows={3}
            placeholder="Contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-white px-4 py-2 rounded-lg font-medium shadow"
          >
            Agregar Nota
          </button>
        </form>
      </div>

      {/* Lista de notas */}
      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-700">Notas</h4>
        {notas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notas.map((nota) => (
              <div
                key={nota.id}
                onClick={() => changeStatus(nota.id)}
                className={`rounded-xl shadow p-4 cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-lg ${
                  nota.estado
                    ? "bg-gray-100 line-through text-gray-500"
                    : "bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-lg">{nota.titulo}</h5>
                    <p className="mt-1 text-sm">{nota.contenido}</p>
                  </div>
                  <CiTrash
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNota(nota.id);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer text-xl"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No hay notas aún, agrega una ✏️</p>
        )}
      </div>

      {/* Mensaje */}
      {msg && (
        <div className="mt-4 bg-blue-100 text-blue-800 p-3 rounded-lg shadow animate-fade-in">
          {msg}
        </div>
      )}
    </div>
  );
};

export default Home;
