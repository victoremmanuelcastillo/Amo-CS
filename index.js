const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const app = express();
app.use(cors());

// Inicializar Firebase
app.use(express.json());
const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
// Rutas
const db = admin.firestore();

app.get("/", (req, res) => { //Ruta GET
  res.send("Servidor corriendo Firebase");});

  // Crear documento usuario
app.post("/usuario/add", async (req, res) => { //Ruta POST
  try {
    const { email, full_name,password_hash } = req.body;    
    // Agregar documento a la colección "usuarios"   
    const docRef = await db.collection("usuarios").add({ email, full_name, password_hash}); 
    res.json({ id: docRef.id, message: "Usuario agregado" });  
    } 
    catch (error) {
    res.status(500).json({ error: error.message });  
    }
});

// Obtener datos de los documentos
app.get("/usuario/ver", async (req, res) => {
  try {
    const items = await db.collection("usuarios").get();

    const usuarios = items.docs.map(doc => { // Mapear documentos a un array de objetos
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        full_name: data.full_name,
        password_hash: data.password_hash
      };
    });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar usuario
app.put("/usuario/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, full_name, password_hash } = req.body;

    await db.collection("usuarios").doc(id).update({
      email,
      full_name,
      password_hash
    });

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar usuario
app.delete("/usuario/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("usuarios").doc(id).delete();
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//ALIMENTOS

// Crear alimento
app.post("/alimento/add", async (req, res) => {
  try {
    const { category, name } = req.body;
    const docRef = await db.collection("alimentos").add({ category, name });
    res.json({ id: docRef.id, message: "Alimento agregado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener alimentos
app.get("/alimento/ver", async (req, res) => {
  try {
    const items = await db.collection("alimentos").get();
    const alimentos = items.docs.map(doc => {
      const data = doc.data();
      return {
        item_id: doc.id,
        category: data.category,
        name: data.name
      };
    });
    res.json(alimentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar alimento
app.put("/alimento/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category, name } = req.body;

    await db.collection("alimentos").doc(id).update({
      category,
      name
    });

    res.json({ message: "Alimento actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar alimento
app.delete("/alimento/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("alimentos").doc(id).delete();
    res.json({ message: "Alimento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//PROVEEDORES
// Crear proveedor
app.post("/proveedor/add", async (req, res) => {
  try {
    const { business_name, user_id } = req.body;
    const docRef = await db.collection("proveedores").add({ business_name, user_id });
    res.json({ id: docRef.id, message: "Proveedor agregado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener proveedores
app.get("/proveedor/ver", async (req, res) => {
  try {
    const items = await db.collection("proveedores").get();
    const proveedores = items.docs.map(doc => {
      const data = doc.data();
      return {
        provider_id: doc.id,
        business_name: data.business_name,
        user_id: data.user_id
      };
    });
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar proveedor
app.put("/proveedor/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { business_name, user_id } = req.body;

    await db.collection("proveedores").doc(id).update({
      business_name,
      user_id
    });

    res.json({ message: "Proveedor actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar proveedor
app.delete("/proveedor/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("proveedores").doc(id).delete();
    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Conexión al servidor
const PORT = 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));