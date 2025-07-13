import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-ovl-timer',
  imports: [],
  templateUrl: './ovl-timer.component.html',
  styleUrl: './ovl-timer.component.scss',
})
export class OvlTimerComponent implements OnInit {
  private subscription!: Subscription;
  private titulo = '';
  private horas = 0;
  private minutos = 10;
  private segundos = 0;

  constructor(private webSocketService: WebsocketService) {
    this.webSocketService.connect();
  }

  ngOnInit(): void {
    this.updateTimer(this.horas, this.minutos, this.segundos);
    setInterval(() => {
      if (this.segundos > 0) {
        this.segundos--;
      } else if (this.minutos > 0) {
        this.minutos--;
        this.segundos = 59;
      } else if (this.horas > 0) {
        this.horas--;
        this.minutos = 59;
        this.segundos = 59;
      }
      this.updateTimer(this.horas, this.minutos, this.segundos);
    }, 1000);
    console.log(this.minutos);

    this.setTitle();
    this.subscription = this.webSocketService
      .getMessage()
      .subscribe(message => {
        const timeData = JSON.parse(message.content);
        console.log('Timedata: ', timeData);
        this.horas = timeData.horas || 0;
        this.minutos = timeData.minutos || 10;
        this.segundos = timeData.segundos || 0;
        this.titulo = timeData.titulo || '';
        this.setTitle();
        console.log(message);
      });
    console.log('mamahuevo');
    setTimeout(() => {
      this.webSocketService.sendMessage({
        sender: 'obs/timer',
        content: 'hola server, registrame en tu lista',
        target: 'None',
      });
    }, 1000);
  }

  // actualizar el temporizador
  public updateTimer(_horas: number, _minutos: number, _segundos: number) {
    const horas = document.getElementById('horas');
    const minutos = document.getElementById('minutos');
    const segundos = document.getElementById('segundos');
    if (horas != null)
      horas.innerHTML = _horas < 10 ? '0' + _horas : '' + _horas;
    if (minutos != null)
      minutos.innerHTML = _minutos < 10 ? '0' + _minutos : '' + _minutos;
    if (segundos != null)
      segundos.innerHTML = _segundos < 10 ? '0' + _segundos : '' + _segundos;
  }

  private setTitle() {
    const titleElement = document.getElementById('title');
    if (titleElement != null) titleElement.innerHTML = this.titulo;
  }
  onDestroy() {
    this.subscription.unsubscribe();
  }
}
