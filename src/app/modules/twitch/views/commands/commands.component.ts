import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
import { TwitchCommand } from '../../models/twitch.models';
import { TwitchPstService } from '../../services/twitch-pst.service';
// import { TwitchPstService } from '../../services/twitch-pst.service';

/* Validator */
/* Mover a una clase para los validadores */
function onlyNumbersAllowed(control: AbstractControl) {
  if (isNaN(control.value)) {
    return { onlyNumbers: true };
  }
  return null;
}

@Component({
  selector: 'twitch-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss']
})
export class CommandsComponent implements OnInit {
  public commands: TwitchCommand[] = [];

  constructor(private twitchPstService: TwitchPstService) {}

  ngOnInit(): void {
    this.twitchPstService.getCommands().subscribe({
      next: (data) => (this.commands = data),
      error: (err) => console.log(err),
      complete: () => console.log('getCommands() complete')
    });
  }

  public formGroupCommands = new FormGroup({
    comando: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    colddown: new FormControl('', [Validators.required, onlyNumbersAllowed]),
    mensaje: new FormControl('', [Validators.required]),
    activo: new FormControl(false)
  });

  getErrorMessage(controlName: string) {
    if (this.formGroupCommands.get(controlName)?.hasError('onlyNumbers')) {
      return 'Solo numeros';
    } else if (this.formGroupCommands.get(controlName)?.hasError('required')) {
      return `Introduce un ${controlName}`;
    }
    return '';
  }

  onFormSubmit() {
    if (this.formGroupCommands.invalid) {
      console.log('Formulario invalido');
      return;
    }
    console.log('onFormSubmit', this.formGroupCommands.value);
  }

  getActiveIcon(isActive: boolean) {
    if (isActive) {
      return 'check_circle';
    } else {
      return 'cancel';
    }
  }
  getUserLevel(level: number) {
    const userLevels = ['Viewer', 'Follower', 'Sub', 'Vip', 'Mod', 'Streamer'];
    return userLevels[level];
  }
}
