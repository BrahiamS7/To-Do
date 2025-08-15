import express from "express";
import db from "../db.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get("/buscar/:user", async (req, res) => {
  const user = req.params.user;
  console.log(user);
  const response = await db.query("SELECT * FROM nota WHERE usuario=$1 ORDER BY id asc", [
    user,
  ]);
  const data = response.rows;
  res.json(data);
});
router.post("/cambiarEst/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await db.query("UPDATE nota SET estado=NOT estado WHERE id=$1", [id]);
  res.json({ msg: "Cambiado exitosamente" });
});
router.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await db.query("DELETE FROM nota * WHERE id=$1", [id]);
  res.json({ msg: "Eliminado exitosamente" });
});
router.post("/add", async (req, res) => {
  const titulo = req.body.titulo;
  const contenido = req.body.contenido;
  const user = req.body.user.id;
  await db.query(
    "INSERT INTO nota (titulo,contenido,estado,usuario) VALUES ($1,$2,false,$3)",
    [titulo, contenido, user]
  );
  res.json({ msg: "Nota añadida correctamente" });
});

export default router;
