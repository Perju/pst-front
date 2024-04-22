import { Component, OnInit } from '@angular/core';
import { CommonService } from './modules/obs/services/common.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'Perju Stream Toolbox';
  public isOpened = true;
  public obsweb = false;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.commonService.isPropVisible().subscribe({
      next: (data: boolean) => {
        this.isOpened = data;
      }
    });
    if (environment.obsweb) {
      this.obsweb = true;
    }
  }

  public closeProperties() {
    this.commonService.setIsPropVisible(false);
  }
}
