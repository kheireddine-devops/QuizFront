import { ApplicationConfig } from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {tokenInterceptor} from "./core/interceptors/token.interceptor";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";

export const appConfig: ApplicationConfig = {
  providers: [
    provideNativeDateAdapter(),
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: "top",
      })
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
  ]
};
