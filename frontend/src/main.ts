import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter,Routes } from '@angular/router';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { jwtInterceptor } from './app/jwt.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';





bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    withInterceptors([jwtInterceptor])
  ),
  provideRouter(routes), // Add route configuration here
  ...appConfig.providers, provideAnimationsAsync(), // Ensure appConfig providers are included
]})
  .catch((err) => console.error(err));
