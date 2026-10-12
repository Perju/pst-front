import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs'

export interface WebSocketConnection<T = any> {
  socket$: WebSocketSubject<T>;
  stream$: Observable<T>;
}

export interface WSMessage<T = any> {
  sender: string;
  data: T;
  target: string;
}
