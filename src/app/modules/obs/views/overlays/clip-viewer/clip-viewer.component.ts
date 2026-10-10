import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-clip-viewer',
  templateUrl: './clip-viewer.component.html',
  styleUrls: ['./clip-viewer.component.scss'],
})
export class ClipViewerComponent implements OnInit {
  clip: any;
  safeEmbedUrl: SafeResourceUrl | undefined;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      // this.http.get(`http://localhost:5000/api/twitch/${userId}/randomClip`).subscribe((data: any) => {
      this.http
        .get(`http://localhost:5000/api/twitch/37113434/randomClip`)
        .subscribe((data: any) => {
          this.clip = data;
          // if (this.clip && this.clip.embed_url) {
          if (this.clip && this.clip.url) {
            let url = this.clip.url
            url += "&parent=localhost&autoplay=true"
            this.safeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          }
        });
    });
  }
}
