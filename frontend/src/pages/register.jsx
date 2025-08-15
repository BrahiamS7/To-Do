import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const url = import.meta.env.VITE_API_URL;
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${url}/api/usuarios/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          navigate("/home");
        }
        setUser("");
        setPass("");
        setMsg(data.msg);
        setTimeout(() => setMsg(""), 5000);
      })
      .catch(() => {
        setMsg("Error en el servidor");
      });
  };

  useEffect(() => {}, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Registro</h2>
        {msg && (
          <div className="bg-blue-100 text-blue-800 text-center p-2 rounded mb-3">
            {msg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Registrarse
          </button>
        </form>
        <div className="text-center mt-3">
          <Link to="/" className="text-blue-500 hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
