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
  municipio: SelectItem[];
  equipamento: SelectItem[];
  selectedMunicipios: string[] ;
  selectedEquipamento: string[];
  selectedEixos: string[];

  constructor(private injector: Injector, public routerext: RouterExtensions) {



      this.eixos = [];
      this.eixos.push({label: 'EQUIPE TÉCNICA', value: 'EQUIPE TÉCNICA'});
      this.eixos.push({label: 'INFRAESTRUTURA', value: 'INFRAESTRUTURA'});
      this.eixos.push({
        label: 'PROGRAMAS, PROJETOS, SERVIÇOS E BENEFÍCIOS',
        value: 'PROGRAMAS, PROJETOS, SERVIÇOS E BENEFÍCIOS'
      });


      this.municipio = [];
      this.municipio.push({label: 'ANGRA DOS REIS', value: 'ANGRA DOS REIS'});
      this.municipio.push({label: 'BARRA DO PIRAÍ', value: 'BARRA DO PIRAÍ'});
      this.municipio.push({label: 'NITERÓI', value: 'NITERÓI'});
      this.municipio.push({label: 'SÃO GONÇALO', value: 'SÃO GONÇALO'});
      this.municipio.push({label: 'NOVA IGUAÇU', value: 'NOVA IGUAÇU'});


      this.equipamento = [];
      this.equipamento.push({label: 'CRAS', value: 'CRAS'});
      this.equipamento.push({label: 'CRAS BARRA', value: 'CRAS BARRA'});
      this.equipamento.push({label: 'CRAS SÃO GONÇALO', value: 'CRAS SÃO GONÇALO'});
      this.equipamento.push({label: 'CRAS RIO', value: 'CRAS RIO'});


  }
}
