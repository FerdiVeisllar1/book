import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,
    HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'book';
}
