import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// ✅ 1. Import the Header Component
import { HeaderComponent } from './core/layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // ✅ 2. Add 'HeaderComponent' to this list
  imports: [
    RouterOutlet, 
    HeaderComponent 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'campusync-frontend';
}