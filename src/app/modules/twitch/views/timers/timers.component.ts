import { Component, OnInit } from '@angular/core'
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms'

/* Validator */
function onlyNumbersAllowed(control: AbstractControl) {
  if (isNaN(control.value)) {
    return { onlyNumbers: true }
  }
  return null
}

@Component({
  selector: 'twitch-timers',
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.sass']
})
export class TimersComponent implements OnInit {
  public formGroupTimers = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    intervalo: new FormControl('', [
      Validators.required,
      onlyNumbersAllowed
    ]),
    mensaje: new FormControl('', [Validators.required]),
    activo: new FormControl(false)
  })

  constructor() {}

  ngOnInit(): void {}

  getErrorMessage(controlName: string) {
    if (this.formGroupTimers.get(controlName)?.hasError('onlyNumbers')) {
      return 'Solo numeros'
    } else if (this.formGroupTimers.get(controlName)?.hasError('required')) {
      return `Introduce un ${controlName}`
    }
    return ''
  }

  onFormSubmit() {
    if(this.formGroupTimers.invalid){
      console.log("Formulario invalido")
      return;
    }
    console.log('onFormSubmit', this.formGroupTimers.value)
  }
}
