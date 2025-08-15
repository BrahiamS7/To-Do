import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const url = import.meta.env.VITE_API_URL;
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${url}/api/usuarios/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          navigate("/home");
        } else {
          setMsg(data.msg);
          setTimeout(() => setMsg(""), 5000);
        }
        setUser("");
        setPass("");
      })
      .catch((err) => {
        console.log(err);
        setMsg("Error en el servidor");
      });
  };

  useEffect(() => {}, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar Sesión
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition duration-200"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/register" className="text-blue-500 hover:underline">
            Registrarse
          </Link>
        </div>

        {msg && (
          <p className="mt-4 text-center text-red-500 font-medium">{msg}</p>
        )}
      </div>
    </div>
  );
}

export default Login;
