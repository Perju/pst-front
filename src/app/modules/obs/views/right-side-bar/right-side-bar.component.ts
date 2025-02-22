import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'obs-right-side-bar',
    templateUrl: './right-side-bar.component.html',
    styleUrls: ['./right-side-bar.component.scss'],
    standalone: false
})
export class ObsRightSideBarComponent implements OnInit {
  public sideElems: any;

  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.commonService.getRightSidebarData().subscribe({
      next: (data: any) => {
        this.sideElems = {
          name: data.sourceName,
          transform: data.transformData.sceneItemTransform
        };
        console.log('RightSidebarData', data);
      }
    });
  }
}
