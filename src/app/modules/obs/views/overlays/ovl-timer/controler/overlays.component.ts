import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WSMessage } from 'src/app/services/websocket.interface';
import { WebsocketService } from 'src/app/services/websocket.service';

interface TimerData {
  text: string;
}

@Component({
  selector: 'twitch-overlays',
  templateUrl: './overlays.component.html',
  styleUrl: './overlays.component.scss',
  standalone: false,
})
export class OverlaysComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private channel = 'timer-controler';
  private target = 'timer';
  public app_host: Location;

  public timerForm = new FormGroup({
    horas: new FormControl(0, Validators.required),
    minutos: new FormControl(10),
    segundos: new FormControl(0),
    titulo: new FormControl('Temporizador'),
  });

  constructor(private webSocketService: WebsocketService) {
    this.app_host = document.location;
  }

  ngOnInit(): void {
    const connection = this.webSocketService.connect<WSMessage<TimerData>>(this.channel);

    this.subscription = connection.stream$.subscribe({
      next: mensaje => console.log('Mensaje recibido.', mensaje.data),
      error: err => console.error('Error en WS:', err),
      complete: () => console.log('El flujo terminó.'),
    });
  }

  public sendMessage(): void {
    const content = this.timerForm.value;
    console.log('Formulario: ', content);
    this.webSocketService.sendMessage(this.channel, {
      sender: this.channel,
      data: content,
      target: this.target,
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
