import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ovl-timer',
  imports: [],
  templateUrl: './ovl-timer.component.html',
  styleUrl: './ovl-timer.component.scss',
})
export class OvlTimerComponent implements OnInit {
  ngOnInit(): void {
    this.setTitle();
    let horas = 0; //getUrlParam("horas", 0);
    let minutos = 10; //getUrlParam("minutos", 10);
    let segundos = 0; //getUrlParam("segundos", 0);
    this.updateTimer(horas, minutos, segundos);
    setInterval(() => {
      if (segundos > 0) {
        segundos--;
      } else if (minutos > 0) {
        minutos--;
        segundos = 59;
      } else if (horas > 0) {
        horas--;
        minutos = 59;
        segundos = 59;
      }
      this.updateTimer(horas, minutos, segundos);
    }, 1000);
    console.log(minutos);
  }

  // obtener parametros de la url
  // public getUrlVars() {
  //   let vars = {};
  //   let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
  //     vars[key] = value;
  //   });
  //   return vars;
  // }

  // si el parametro no existe devolver un valor por defecto
  // public getUrlParam(parameter, defaultvalue) {
  //   let urlparameter = defaultvalue;
  //   if (window.location.href.indexOf(parameter) > -1) {
  //     urlparameter = getUrlVars()[parameter];
  //   }
  //   return urlparameter !== undefined ? urlparameter : defaultvalue;
  // }

  // actualizar el temporizador
  public updateTimer(_horas: number, _minutos: number, _segundos: number) {
    const horas = document.getElementById('horas');
    const minutos = document.getElementById('minutos');
    const segundos = document.getElementById('segundos');
    if (horas != null)
      horas.innerHTML = _horas < 10 ? '0' + _horas : '' + _horas;
    if (minutos != null)
      minutos.innerHTML = _minutos < 10 ? '0' + _minutos : '' + _minutos;
    if (segundos != null)
      segundos.innerHTML = _segundos < 10 ? '0' + _segundos : '' + _segundos;
  }

  // actualizar el titulo
  public setTitle() {
    //let title = getUrlParam('titulo', null);
    //if (title !== null) {
    //const h1 = document.createElement('h1');
    //title = title.replaceAll('+', ' ');
    //h1.innerHTML = title;
    //document.getElementById('title').appendChild(h1);
    //console.log('Titulo: ' + title + ' creado');
  }
}
