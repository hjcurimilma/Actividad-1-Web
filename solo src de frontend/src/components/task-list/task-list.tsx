import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'task-list',
  styleUrl: 'task-list.css',
  shadow: true,
})
export class TaskList {
  @State() tasks: any[] = [];

  async componentDidLoad() {
    const response = await fetch('http://localhost:3000/tareas');
    this.tasks = await response.json();
  }

  render() {
    return (
      <div>
        <h2>Lista de Tareas</h2>
        <ul>
          {this.tasks.map(task => (
            <li>{task.nombre} - {task.fabricante}</li>
          ))}
        </ul>
      </div>
    );
  }
}
