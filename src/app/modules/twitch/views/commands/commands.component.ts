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
      next: data => (this.commands = JSON.parse(data)),
      error: err => console.log(err),
      complete: () => console.log('getCommands() complete'),
    });
  }

  public formGroupCommands = new FormGroup({
    name: new FormControl('', [Validators.required]),
    colddown: new FormControl('', [Validators.required, onlyNumbersAllowed]),
    message: new FormControl('', [Validators.required]),
    active: new FormControl(false),
    usr_lvl: new FormControl(5)
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
    const { name, message, colddown, usr_lvl } = this.formGroupCommands.value;
    if (
      name !== null &&
      name !== undefined &&
      message !== null &&
      message !== undefined &&
      colddown !== null &&
      colddown !== undefined
    ) {
      this.twitchPstService.addCommand({
        name: name,
        response: message,
        colddown: Number.parseInt(colddown),
        active: true,
        usr_lvl: usr_lvl || 1,
      });
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
