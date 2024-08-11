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
