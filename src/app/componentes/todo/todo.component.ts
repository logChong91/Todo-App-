import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { todo, filterType } from './../../models/models';
import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit{

  todoList = signal<todo[]>([])

  filter = signal<filterType>('all');

  todoListingFiltered = computed( () => {
    if (this.filter() === 'all') {
      return this.todoList();
    } else if (this.filter() === 'active') {
      return this.todoList().filter((todo) => !todo.completed);
    } else if (this.filter() === 'completed') {
      return this.todoList().filter((todo) => todo.completed);
    }
    return
  })

  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  changeFilter(filterType: filterType) {
    this.filter.set(filterType);
  }

  constructor() { 
    console.log('constructor here');
    effect(() => {
      console.log('effect here');
      localStorage.setItem('todoList', JSON.stringify(this.todoList()));
    })
  }

  ngOnInit(): void {
    console.log('onInit here');
    const storage = localStorage.getItem('todoList');
    if (storage) {
      this.todoList.set(JSON.parse(storage));
    }
  }

  addTodo() {
    const newTodoTitle = this.newTodo.value.trim();
    if (this.newTodo.value && newTodoTitle !== '') {
      this.todoList.update((prev_todos) => [
        ...prev_todos,
        {
          id: Date.now(),
          title: newTodoTitle,
          completed: false,
          editing: false
        }
      ])
      this.newTodo.reset();
    } else {
      this.newTodo.reset();
    }
  }

  toggleTodo(id: number) {
    this.todoList.update((prev_todos) => {
      return prev_todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed
          }
        }
        return todo;
      })
    })
  }

  removeTodo(id: number) {
    this.todoList.update((prev_todos) => {
      return prev_todos.filter((todo) => todo.id !== id)
    })
  }

  updateTodoEditing(id: number) {
    this.todoList.update((prev_todos) => {
      return prev_todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            editing: true
          }
        }
        return todo;
      })
    })
  }

  saveTitleTodo(id: number, event: Event) {
    const newTitle = (event.target as HTMLInputElement).value;
    return this.todoList.update((prev_todos) => {
      return prev_todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title: newTitle,
            editing: false
          }
        }
        return todo;
      })
    })
  }
}
