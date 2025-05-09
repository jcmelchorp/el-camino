import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PWAService } from './services/pwa.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'El Camino';
  
  constructor(private pwa: PWAService) { }
  ngOnInit(): void {
    this.pwa.titleInit();
    this.pwa.generateTags({
      title: this.title,
      description:
        'El Camino es un juego de rompecabezas interactivo que desafía a los jugadores a resolver niveles mediante la rotación y colocación correcta de piezas en un tablero. Cada nivel presenta un conjunto de bloques con diferentes formas y orientaciones, como curvas, líneas y extremos, que deben ser alineados correctamente para completar el camino.',
      image: 'screenshot01.png',
    });
  }
  reload() {
    window.location.reload();
  }  
  
}
