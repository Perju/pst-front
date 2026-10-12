import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Subscription } from 'rxjs';
import { WSMessage } from 'src/app/services/websocket.interface';

interface ClipData {
  text: string;
}

@Component({
  selector: 'app-clip-viewer',
  templateUrl: './clip-viewer.component.html',
  styleUrls: ['./clip-viewer.component.scss'],
})
export class ClipViewerComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private channel = 'clip-viewer';
  private target = 'clip-viewer-controler';
  clip: any;
  safeEmbedUrl: SafeResourceUrl | undefined;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    const connection =  this.webSocketService.connect<ClipData>(this.channel);

    this.subscription = connection.stream$.subscribe({
      next: (mensaje) => {
        console.log('Mensaje recibido.', mensaje)
        const userId = mensaje.data.text;
        const currentDomain = window.location.hostname;
          this.http
            .get(
              `http://${currentDomain}:5000/api/twitch/${userId}/randomClip`
            )
            .subscribe((data: any) => {
              this.clip = data;
              // if (this.clip && this.clip.embed_url) {
              if (this.clip && this.clip.embed_url) {
                let url = this.clip.embed_url;
                url += `&autoplay=true&parent=${currentDomain}`;
                this.safeEmbedUrl =
                  this.sanitizer.bypassSecurityTrustResourceUrl(url);
              }
            });
      },
      error: err => console.error('Error en WS:', err),
      complete: () => console.log('El flujo terminó.'),
    });
    this.sendMessage();
  }
  public sendMessage(): void {
    const mensaje: WSMessage<ClipData> = {
        sender: this.channel,
        target: this.target,
        data: { "text": "Hola desde clip-viewer"}
    };
    this.webSocketService.sendMessage(this.channel, mensaje);
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe();
  }
}
