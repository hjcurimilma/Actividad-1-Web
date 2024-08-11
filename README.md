# Actividad-1-Web
1.- Frontend: Iniciamos un nuevo proyecto Stencil:
Ingresamos el componente creado:
 
Instalamos dependencias:
 
2.- Backend: Desarrollar una API REST con Express que se conecte con una Base de Datos MySQL para gestionar las tareas.

•	Creamos la carpeta para el Backend
 
•	Md backend, cd backend, Iniciamos el unevo proyecto para node, npm init-y.
 
Instalamos Express y el paquete para conectar a MySQL:

Necesitamos el paquete cors para manejar las solicitudes entre el front y el backend
Npm install cors:
Una vez completo, procedemos al desarrollo Backend.

3.- Creamos nuestra tabla de Base de Datos:
 
1.	Creamos nuestra tabla en la base de datos:
CREATE TABLE cuadernos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  fabricante VARCHAR(255) NOT NULL
);
2.	Creamos nuestra API en base a la tabla:
En la carpeta backend, creamos un archivo llamado server.js y escribimos el código que servirá para nuestro api:

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'gestion_cuadernos'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Rutas CRUD

app.get('/tareas', (req, res) => {
  connection.query('SELECT * FROM cuadernos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/tareas', (req, res) => {
  const { nombre, fabricante } = req.body;
  connection.query('INSERT INTO cuadernos (nombre, fabricante) VALUES (?, ?)', [nombre, fabricante], (err, results) => {
    if (err) throw err;
    res.json({ id: results.insertId, nombre, fabricante });
  });
});

app.put('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, fabricante } = req.body;
  connection.query('UPDATE cuadernos SET nombre = ?, fabricante = ? WHERE id = ?', [nombre, fabricante, id], (err) => {
    if (err) throw err;
    res.json({ id, nombre, fabricante });
  });
});

app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM cuadernos WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ id });
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

Para probar su funcionalidad iniciamos el servidor con el siguiente comando:
node server.js
 
 Se puede observar que el servidor ya se encuentra levantado Para verificar que el API funcione de forma correcta, se llama a cada uno de los métodos creados de forma manual:
Get: listar
Post: Insertar
Put: actualizer
Delete: eliminar
 
Finalmente se crea la Interface que nos permite administrar los registros
Se crea un nuevo componente, con sus archivos tsx y css denominado admin-tareas.
 
Archivo: admin-tareas.tsx
import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'admin-tareas',
  styleUrl: 'admin-tareas.css',
  shadow: true,
})
export class AdminTareas {
  @State() tareas: any[] = []; // Estado para almacenar la lista de cuadernos
  @State() nuevoNombre: string = ''; // Estado para el nombre del cuaderno 
  @State() nuevoFabricante: string = ''; // Estado para el fabricante de la nueva tarea
  @State() tareaEditarId: number | null = null; // Estado para almacenar el ID de la tarea que se está editando
  @State() editarNombre: string = ''; // Estado para el nombre de la tarea en edición
  @State() editarFabricante: string = ''; // Estado para el fabricante de la tarea en edición

  // Método que se ejecuta cuando el componente se ha cargado
  async componentDidLoad() {
    await this.obtenerTareas(); // Obtiene los registros al cargar el componente
  }

  // Método para obtener la lista de tareas desde la API
  async obtenerTareas() {
    const respuesta = await fetch('http://localhost:3000/tareas');
    this.tareas = await respuesta.json(); // Actualiza el estado con la lista de cuadernos
  }

  // Método para crear un registro nuevo para cuaderno
  async crearTarea() {
    if (this.nuevoNombre && this.nuevoFabricante) {
      const respuesta = await fetch('http://localhost:3000/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: this.nuevoNombre,
          fabricante: this.nuevoFabricante,
        }),
      });
      const nuevaTarea = await respuesta.json();
      this.tareas = [...this.tareas, nuevaTarea]; // Agrega el nuevo registro a la lista
      this.nuevoNombre = ''; // Limpia el campo del nombre
      this.nuevoFabricante = ''; // Limpia el campo del fabricante
    }
  }

  // Método para actualizar una tarea existente
  async actualizarTarea() {
    if (this.tareaEditarId !== null && this.editarNombre && this.editarFabricante) {
      const respuesta = await fetch(`http://localhost:3000/tareas/${this.tareaEditarId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: this.editarNombre,
          fabricante: this.editarFabricante,
        }),
      });
      const tareaActualizada = await respuesta.json();
      this.tareas = this.tareas.map(tarea =>
        tarea.id === this.tareaEditarId ? tareaActualizada : tarea
      ); // Actualiza 
      this.tareaEditarId = null; // Limpia el ID actual en edición
      this.editarNombre = ''; // Limpia el campo del nombre
      this.editarFabricante = ''; // Limpia el campo del fabricante
    }
  }

  // Método para eliminar un registro
  async eliminarTarea(id: number) {
    await fetch(`http://localhost:3000/tareas/${id}`, {
      method: 'DELETE',
    });
    this.tareas = this.tareas.filter(tarea => tarea.id !== id); // Filtra la tarea eliminada de la lista
  }

  // Método para renderizar el componente
  render() {
    return (
      <div>
        <h2>Gestión de Cuadernos</h2>
        
        {/* Formulario para crear un nuevo registro */}
        <div>
          <h3>Crear Cuaderno</h3>
          <input 
            type="text" 
            placeholder="Nombre del cuaderno" 
            value={this.nuevoNombre} 
            onInput={(event: any) => this.nuevoNombre = event.target.value} 
          />
          <input 
            type="text" 
            placeholder="Fabricante" 
            value={this.nuevoFabricante} 
            onInput={(event: any) => this.nuevoFabricante = event.target.value} 
          />
          <button onClick={() => this.crearTarea()}>Crear</button>
        </div>
        
        {/* Formulario para editar un cuaderno existente */}
        {this.tareaEditarId !== null && (
          <div>
            <h3>Editar</h3>
            <input 
              type="text" 
              placeholder="Nombre del cuaderno" 
              value={this.editarNombre} 
              onInput={(event: any) => this.editarNombre = event.target.value} 
            />
            <input 
              type="text" 
              placeholder="Fabricante" 
              value={this.editarFabricante} 
              onInput={(event: any) => this.editarFabricante = event.target.value} 
            />
            <button onClick={() => this.actualizarTarea()}>Actualizar</button>
            <button onClick={() => this.tareaEditarId = null}>Cancelar</button>
          </div>
        )}
        
        {/* Listado */}
        <ul>
          {this.tareas.map(tarea => (
            <li key={tarea.id}>
              {tarea.nombre} - {tarea.fabricante}
              <button onClick={() => {
                this.tareaEditarId = tarea.id;
                this.editarNombre = tarea.nombre;
                this.editarFabricante = tarea.fabricante;
              }}>Editar</button>
              <button onClick={() => this.eliminarTarea(tarea.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}


Archivo admin-tareas.css

div {
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  
  h2 {
    font-size: 1.5em;
  }
  
  h3 {
    font-size: 1.2em;
  }
  
  input {
    margin-right: 8px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    margin-right: 8px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 8px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

Con nuestro servidor backend iniciado.
 
Iniciamos nuestra app frontend
Verificamos su funcionamiento dando funcionalidad a nuestro CRUD para el usuario Final.
