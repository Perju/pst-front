import { Injectable } from '@angular/core';
import { WebSocketConnection, WSMessage } from './websocket.interface';
import { webSocket } from 'rxjs/webSocket';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private connections = new Map<string, WebSocketConnection>();

  public connect<T>(channelId: string): WebSocketConnection<WSMessage<T>> {
    if (this.connections.has(channelId)) {
      return this.connections.get(channelId) as WebSocketConnection<WSMessage<T>>;
    }
    // this.socket = new WebSocket(`ws://${window.location.hostname}:9001`);

    const socket$ = webSocket<WSMessage<T>>({
      url: `ws://${window.location.hostname}:9001`,
      openObserver: {
        next: () => {
          console.log(`WS Conectado: ${channelId}`)
        }
      },
      closeObserver: {
        next: () =>
          console.log(`Conexion cerrándose para el canal. ${channelId}`),
      },
    });

    const stream$ = socket$.pipe(
      // shareReplay({ bufferSize: 1, refCount: true })
      shareReplay(1)
    );
    const connection$: WebSocketConnection<WSMessage<T>> = { socket$, stream$ };

    this.connections.set(channelId, connection$);

    return connection$;
  }

  public getConnection<T>(channelId: string): WebSocketConnection<T> | undefined {
    return this.connections.get(channelId) as WebSocketConnection<T> | undefined;
  }

  public sendMessage<T>(channelId: string, message: any): void {
    const connection = this.connections.get(channelId);
    if (connection) {
      console.log("La conexión: ", connection.socket$);
      connection.socket$.next(message);
    } else {
      console.warn(`No se encontró conoexión activa para el canal: ${channelId}`);
    }
  }

  public disconnect(channelId: string): void {
    const connection = this.connections.get(channelId);
    if (connection) {
      connection.socket$.complete();
      this.connections.delete(channelId);
      console.log(`Canal ${channelId} removido`);
    }
  }

  public disconnectAll(): void {
    this.connections.forEach((_, channelId) => this.disconnect(channelId));
  }
}
