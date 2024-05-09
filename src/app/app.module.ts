import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from "angular-datatables";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { NopageFoundComponent } from './nopage-found/nopage-found.component';
import { PagesModule } from './pages/pages.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { loggerInterceptor } from './interceptors/logger.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    NopageFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    PagesModule,
    AuthModule,
    HttpClientModule
  ],
  exports: [],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: loggerInterceptor,
      multi   : true,
    }, provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
