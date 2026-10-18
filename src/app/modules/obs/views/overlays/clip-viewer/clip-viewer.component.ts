import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
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
  isVisible: boolean = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
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
                this.isVisible = true;
                this.safeEmbedUrl = undefined;

                this.cdr.detectChanges();

                setTimeout(() => {
                this.safeEmbedUrl =
                  this.sanitizer.bypassSecurityTrustResourceUrl(url);
                  this.cdr.detectChanges();
                }, 50);

                // Ocultar el clip después de que termine
                const duration = this.clip.duration ? this.clip.duration * 1000 : 30000;
                setTimeout(() => {
                    this.isVisible = false;
                    this.safeEmbedUrl = undefined;
                    this.clip = undefined;
                }, duration + 50);
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
