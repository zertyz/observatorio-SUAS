// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {MultiSelectModule} from 'primeng/primeng';
import {SelectItem} from 'primeng/primeng';


import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

@Component({
  moduleId: module.id,
  selector: 'mp-inspecoes',
  templateUrl: 'mp-inspecoes.component.html',
  styleUrls: ['mp-inspecoes.component.css']
})
export class MPInspecoesComponent {

  eixos: SelectItem[];
  selectedEixos: string[];

  constructor(private injector: Injector, public routerext: RouterExtensions) {
    this.eixos = [];
    this.eixos.push({label:'EQUIPE TÉCNICA', value:'EQUIPE TÉCNICA'});
    this.eixos.push({label:'INFRAESTRUTURA', value:'INFRAESTRUTURA'});
    this.eixos.push({label:'PROGRAMAS, PROJETOS, SERVIÇOS E BENEFÍCIOS', value:'PROGRAMAS, PROJETOS, SERVIÇOS E BENEFÍCIOS'});
  }

}
