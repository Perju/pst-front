import { Component } from '@angular/core';

@Component({
  selector: 'obs-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss'],
  standalone: false,
})
export class ObsLeftSideBarComponent {
  public obsLinks: { label: string; href: string; class?: string }[] = [
    { label: 'Conectar', href: '/obs' },
    { label: 'Controlador', href: '/obs/controller' },
    { label: 'Ayuda', href: '/obs/help' },
  ];
}
