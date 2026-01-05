import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
// ✅ Import 'withInterceptors'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // ✅ FIX: Combine 'withFetch' AND 'withInterceptors'
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) 
    ),

    provideAnimations()
  ]
};