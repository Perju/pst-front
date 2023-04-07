import { Component } from '@angular/core'
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms'

/* Validator */
/* Mover a una clase para los validadores */
function onlyNumbersAllowed(control: AbstractControl) {
  if (isNaN(control.value)) {
    return { onlyNumbers: true }
  }
  return null
}
@Component({
  selector: 'twitch-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.sass']
})
export class CommandsComponent {
  public formGroupCommands = new FormGroup({
    comando: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    colddown: new FormControl('', [
      Validators.required,
      onlyNumbersAllowed
    ]),
    mensaje: new FormControl('', [Validators.required]),
    activo: new FormControl(false)
  })

  getErrorMessage(controlName: string) {
    if (this.formGroupCommands.get(controlName)?.hasError('onlyNumbers')) {
      return 'Solo numeros'
    } else if (this.formGroupCommands.get(controlName)?.hasError('required')) {
      return `Introduce un ${controlName}`
    }
    return ''
  }

  onFormSubmit() {
    if (this.formGroupCommands.invalid) {
      console.log('Formulario invalido')
      return
    }
    console.log('onFormSubmit', this.formGroupCommands.value)
  }
}
