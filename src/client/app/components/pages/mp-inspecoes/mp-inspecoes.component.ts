// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

@Component({
  moduleId: module.id,
  selector: 'mp-inspecoes',
  templateUrl: 'mp-inspecoes.component.html',
  styleUrls: ['mp-inspecoes.component.css']
})
export class MPInspecoesComponent {

  constructor(private injector: Injector, public routerext: RouterExtensions) {}

}
