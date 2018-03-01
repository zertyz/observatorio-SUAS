// libs
import { Component, ElementRef, ViewChild , OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

@Component({
  moduleId: module.id,
  selector: 'mp-metodologia',
  templateUrl: 'mp-metodologia.component.html',
  styleUrls: ['mp-metodologia.component.css']
})
export class MPMetodologiaComponent{
 metodologia : IMetodologia;
;

  constructor(private injector: Injector, public routerext: RouterExtensions) {
  }
  
}

interface IMetodologia{
  titulo: string;
  texto:string;
}