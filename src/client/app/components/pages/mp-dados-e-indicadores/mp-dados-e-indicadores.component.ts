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

  data: any;
  data2: any;
  data3:any;
  options: any;

  constructor(private injector: Injector, public routerext: RouterExtensions) {
    this.data = {

      labels: ['Verba Utilizada', 'Verba não utilizada'],
      datasets: [
        {
          data: [38.334, 108.501],
          backgroundColor: [
            "#117011",
            "#660000"
          ],
          hoverBackgroundColor: [
            "#117011",
            "#660000"
          ],
        }
      ],
    };
    this.data2 = {

      labels: ['Verba Utilizada', 'Verba não utilizada'],
      datasets: [

        {
          data: [24.000, 247.200],
          backgroundColor: [
            "#117011",
            "#660000"
          ],
          hoverBackgroundColor: [
            "#117011",
            "#660000"
          ]
        }
      ]
    }
    this.data3 = {

      labels: ['Verba Utilizada', 'Verba não utilizada'],
      datasets: [

        {
          data: [300, 0],
          backgroundColor: [
            "#117011",
            "#660000",
          ],
          hoverBackgroundColor: [
            "#117011",
            "#660000"
          ]
        }
      ]
    }

    this.options = {
      legend: {
        display: false
      }
    }
  }

}
