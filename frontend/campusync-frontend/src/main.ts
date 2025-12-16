import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // <--- Importing the config
import { AppComponent } from './app/app';
bootstrapApplication(AppComponent, appConfig) // <--- Using the config
  .catch((err) => console.error(err));