import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { TwitchPstService } from '../../services/twitch-pst.service';
import { TwitchTimer } from '../../models/twitch.models';

/* Validator */
function onlyNumbersAllowed(control: AbstractControl) {
  if (isNaN(control.value)) {
    return { onlyNumbers: true };
  }
  return null;
}

@Component({
  selector: 'twitch-timers',
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss']
})
export class TimersComponent implements OnInit {
  public timers: TwitchTimer[] = [];

  public formGroupTimers = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    intervalo: new FormControl('', [Validators.required, onlyNumbersAllowed]),
    mensaje: new FormControl('', [Validators.required]),
    activo: new FormControl(false)
  });

  constructor(private twitchPstService: TwitchPstService) {}

  ngOnInit(): void {
    this.twitchPstService.getTimers().subscribe({
      next: (data) => (this.timers = data),
      error: (err) => console.log(err),
      complete: () => console.log('getTimers() complete')
    });
  }

  getErrorMessage(controlName: string) {
    if (this.formGroupTimers.get(controlName)?.hasError('onlyNumbers')) {
      return 'Solo numeros';
    } else if (this.formGroupTimers.get(controlName)?.hasError('required')) {
      return `Introduce un ${controlName}`;
    }
    return '';
  }

  addTimer() {
    if (this.formGroupTimers.invalid) {
      console.log('Formulario invalido');
      return;
    }

    const { nombre, mensaje, intervalo } = this.formGroupTimers.value;
    if (
      nombre !== null &&
      nombre !== undefined &&
      mensaje !== null &&
      mensaje !== undefined &&
      intervalo !== null &&
      intervalo !== undefined
    ) {
      this.twitchPstService.addTimer({
        name: nombre,
        message: mensaje,
        period: Number.parseInt(intervalo),
        active: true
      });
    }
    console.log('onFormSubmit', this.formGroupTimers.value);
  }

  getActiveIcon(isActive: boolean) {
    if (isActive) {
      return 'check_circle';
    } else {
      return 'cancel';
    }
  }
}
