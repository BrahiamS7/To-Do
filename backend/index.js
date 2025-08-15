// IMPORTACIONES
import express from 'express';
import env from 'dotenv';
import cors from 'cors'
import usuariosRoutes from "./routes/usuarios.routes.js"
import notasRoutes from './routes/notas.routes.js'
env.config();

//CONSTANTES
const app=express();
const port=process.env.port

//UTILIDADES
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//RUTAS GET
app.get("/",(req,res)=>{
    res.json({msg:'api funcionando correctamente!'})
})

//RUTAS
app.use("/api/usuarios",usuariosRoutes)
app.use("/api/notas",notasRoutes)

app.listen(port,()=>{
    console.log(`Servidor corriendo en el puerto: ${port}`);
})