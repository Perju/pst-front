import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonService } from 'src/app/modules/obs/services/common.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-controller-layout',
  templateUrl: './controller-layout.component.html',
  styleUrl: './controller-layout.component.scss',
  standalone: false,
})
export class ControllerLayoutComponent implements OnInit {
  public isOpened = false;

  constructor(private commonService: CommonService, public router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        console.log(url);
        if (url.includes('obs')) {
          this.router.navigate([
            'obs',
            {
              outlets: {
                menu: ['menu'],
              },
            },
          ]);
        } else if (url.includes('twitch')) {
          this.router.navigate([
            'twitch',
            {
              outlets: {
                menu: ['menu'],
              },
            },
          ]);
        }
      });
  }

  public navigateTo(route: string) {
    this.router.navigate([route]);
  }

  public closeProperties() {
    this.commonService.setIsPropVisible(false);
  }
}
