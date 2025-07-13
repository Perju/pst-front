import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: WebSocket;
  private subject$ = new Subject<any>();

  public connect(): void {
    this.socket = new WebSocket('ws://localhost:9001');

    this.socket.onopen = event => {
      console.log('Websocket connected: ', event);
    };

    this.socket.onmessage = event => {
      const message = JSON.parse(event.data);
      this.subject$.next(message);
    };

    this.socket.onerror = error => {
      console.log('Websocket error: ', error);
    };

    this.socket.onclose = event => {
      console.log('Websocket closed: ', event);
    };
  }

  public sendMessage(message: any): void {
    if (this.socket.readyState !== WebSocket.OPEN) {
      return console.log('Websocket is not open');
    }

    this.socket.send(JSON.stringify(message));
  }

  public getMessage(): Observable<any> {
    return this.subject$.asObservable();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
