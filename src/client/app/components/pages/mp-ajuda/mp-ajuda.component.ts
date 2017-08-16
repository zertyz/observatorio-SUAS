// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

@Component({
  moduleId: module.id,
  selector: 'mp-ajuda',
  templateUrl: 'mp-ajuda.component.html',
  styleUrls: ['mp-ajuda.component.css']
})
export class MPAjudaComponent {

  constructor(private injector: Injector, public routerext: RouterExtensions) {}

}
