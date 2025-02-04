import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Login/login.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './Register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { EmailListComponent } from './components/email-list/email-list.component';
import { EmailComposerComponent } from './components/email-composer/email-composer.component';
import { GmailComponent } from './gmail/gmail.component';
import { ContactComposerComponent } from './components/contact-composer/contact-composer.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContactComposerComponent,
    RegisterComponent,
    HeaderComponent,
    SidebarComponent,
    EmailListComponent,
    EmailComposerComponent,
    GmailComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  exports: [HeaderComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
