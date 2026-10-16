import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WSMessage } from 'src/app/services/websocket.interface';
import { WebsocketService } from 'src/app/services/websocket.service';

interface ClipData {
  text: string;
}

@Component({
  selector: 'clip-viewer-controller',
  templateUrl: './clip-viewer-controller.component.html',
  styleUrl: './clip-viewer-controller.component.scss',
  standalone: false,
})
export class ClipViewerControllerComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private channel = 'clip-viewer-controler';
  private target = 'clip-viewer';
  public app_host: Location;

  public clipForm = new FormGroup({
    userId: new FormControl('perju_gatar')
  });

  constructor(private webSocketService: WebsocketService) {
    this.app_host = document.location;
  }

  ngOnInit(): void {
    const connection = this.webSocketService.connect<WSMessage<ClipData>>(this.channel);
    this.subscription = connection.stream$.subscribe({
      next: mensaje => console.log('Mensaje recibido.', mensaje.data),
      error: err => console.error('Error en WS:', err),
      complete: () => console.log('El flujo terminó.'),
    });
  }

  public sendMessage(): void {
    // this.webSocketService.sendMessage(message);
    const text = this.clipForm.value.userId;
    const textData = text !== null && text !== undefined ? text : 'UserId';

    const mensaje: WSMessage<ClipData> = {
        sender: this.channel,
        target: this.target,
        data: {text: textData},
    };

    this.webSocketService.sendMessage(this.channel, mensaje);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    // this.webSocketService.disconnect();
  }
}
