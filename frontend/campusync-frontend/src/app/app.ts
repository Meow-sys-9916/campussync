import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <--- This is critical

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <--- This allows the tag to work
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'campusync-frontend';
}