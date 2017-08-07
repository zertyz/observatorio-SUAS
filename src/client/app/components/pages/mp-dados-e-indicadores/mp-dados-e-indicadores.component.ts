// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

@Component({
  moduleId: module.id,
  selector: 'mp-dados-e-indicadores',
  templateUrl: 'mp-dados-e-indicadores.component.html',
  styleUrls: ['mp-dados-e-indicadores.component.css']
})
export class MPDadosEIndicadoresComponent {

  constructor(private injector: Injector, public routerext: RouterExtensions) {}

}
