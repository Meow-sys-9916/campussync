import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    // 🛑 THIS WILL SHOW THE ERROR ON YOUR SCREEN
    console.error(err);
    alert('APP CRASHED:\n' + err);
    document.body.innerHTML = `<h1 style="color:red; padding:20px;">APP CRASHED</h1><pre style="padding:20px;">${err}</pre>`;
  });