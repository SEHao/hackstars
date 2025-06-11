import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from './components/footer/footer';
import { MainNav } from './components/main-nav/main-nav';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MainNav, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
