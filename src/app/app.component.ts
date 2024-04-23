import { Component, OnInit } from '@angular/core';
import { CommonService } from './modules/obs/services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'Perju Stream Toolbox';
  public isOpened = true;

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.isPropVisible().subscribe({
      next: (data: boolean) => {
        this.isOpened = data;
      }
    });
  }

  public closeProperties() {
    this.commonService.setIsPropVisible(false);
  }
}
