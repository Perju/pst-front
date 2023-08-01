import { Component, OnInit } from '@angular/core'
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms'
import { TwitchCommand } from '../../models/twitch.models';
import { HttpClient } from '@angular/common/http';

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
export class CommandsComponent implements OnInit {
  public commands: TwitchCommand[] = [];

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    const body = { service: 'PST_TWITCH_READ_COMMANDS' };
    this.http.post<any>('http://localhost:5000/api/twitch/read', body).subscribe({
      next: data => {this.commands = data; console.log(data); }, 
      error: (err) => {console.log(err)},
      complete: () => {}
  });
  }

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
