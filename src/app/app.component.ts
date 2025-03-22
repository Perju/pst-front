import { Component, OnInit } from '@angular/core';
import { CommonService } from './modules/obs/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public title = 'Perju Stream Toolbox';
  public isOpened = false;

  constructor(private commonService: CommonService, public router: Router) {}

  ngOnInit(): void {
    this.commonService.isPropVisible().subscribe({
      next: (data: boolean) => {
        this.isOpened = data;
      },
    });
  }
  public navigateTo(route: string) {
    this.router.navigate([route]);
  }

  public closeProperties() {
    this.commonService.setIsPropVisible(false);
  }
}
