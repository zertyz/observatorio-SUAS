// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

@Component({
  moduleId: module.id,
  selector: 'mp-ranking',
  templateUrl: 'mp-ranking.component.html',
  styleUrls: ['mp-ranking.component.css']
})
export class MPRankingComponent {

  constructor(private injector: Injector, public routerext: RouterExtensions) {}

}
