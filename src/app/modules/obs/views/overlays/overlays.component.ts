import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'twitch-overlays',
  templateUrl: './overlays.component.html',
  styleUrl: './overlays.component.scss',
  standalone: false,
})
export class OverlaysComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
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
    console.log(this.app_host);
    this.webSocketService.connect();
    this.subscription = this.webSocketService
      .getMessage()
      .subscribe(message => {
        console.log(message);
      });
  }

  public sendMessage(): void {
    const content = JSON.stringify(this.timerForm.value);
    console.log('Formulario: ', content, this.timerForm.value);
    const message = {
      sender: 'overlays-component',
      content: content,
      target: 'obs/timer',
    };
    this.webSocketService.sendMessage(message);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.webSocketService.disconnect();
  }
}
