// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

@Component({
  moduleId: module.id,
  selector: 'mp-busca',
  templateUrl: 'mp-busca.component.html',
  styleUrls: ['mp-busca.component.css']
})
export class MPBuscaComponent {

  constructor(private injector: Injector, public routerext: RouterExtensions) {}

}
