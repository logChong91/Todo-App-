import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { TodoComponent } from './componentes/todo/todo.component';

export const routes: Routes = [
    {path: 'Todo', component: TodoComponent},
    {path: '', redirectTo: 'Todo', pathMatch: 'full'}
];
