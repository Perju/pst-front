import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CommonService {

  private isPropVisible$: ReplaySubject<any> = new ReplaySubject<boolean>(1);
  private rightSidebarData$: ReplaySubject<unknown> = new ReplaySubject<unknown>(1);

  getRightSidebarData(): Observable<any> {
    return this.rightSidebarData$.asObservable();
  }

  isPropVisible(): Observable<boolean> {
    return this.isPropVisible$.asObservable();
  }

  setRightSidebarData(data: unknown){
    this.rightSidebarData$.next(data);
    this.setIsPropVisible(true);
  }

  setIsPropVisible(data: boolean): void {
    this.isPropVisible$.next(data)
  }
}
