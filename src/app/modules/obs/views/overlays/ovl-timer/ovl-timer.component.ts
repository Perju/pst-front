import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WSMessage } from 'src/app/services/websocket.interface';
import { WebsocketService } from 'src/app/services/websocket.service';

interface TimerData {
  text: string;
}

@Component({
  selector: 'app-ovl-timer',
  imports: [],
  templateUrl: './ovl-timer.component.html',
  styleUrl: './ovl-timer.component.scss',
})
export class OvlTimerComponent implements OnInit {
  private subscription!: Subscription;
  private channel = 'timer';
  private target = 'timer-controler';
  private titulo = '';
  private horas = 0;
  private minutos = 10;
  private segundos = 0;

  constructor(private webSocketService: WebsocketService) {}
  ngOnInit(): void {
    const connection = this.webSocketService.connect<WSMessage<TimerData>>(this.channel);

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

    this.subscription = connection.stream$.subscribe({
      next: mensaje => console.log('Mensaje recibido.', mensaje.data),
      error: err => console.error('Error en WS:', err),
      complete: () => console.log('El flujo terminó.'),
    });

    this.enviar({ text: '¡Hola a todos!' });
  }

  public enviar(data: TimerData): void {
    const mensaje: WSMessage<TimerData> = {
        sender: this.channel,
        target: this.target,
        data: data
    };

    this.webSocketService.sendMessage(this.channel, mensaje);
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
    if (this.subscription) this.subscription.unsubscribe();
  }
}
