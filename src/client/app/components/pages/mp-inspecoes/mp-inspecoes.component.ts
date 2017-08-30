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

  dataInicio : Date;

  dataFim : Date;

  // Tipos Selecionados
  tipo1 : boolean = false; //CRAS
  tipo2 : boolean = false; //CREAS
  tipo3 : boolean = false; //CENTRO POP
  // Tipos Selecionados

  eixos: SelectItem[];
  municipios: SelectItem[];
  equipamentos: SelectItem[];
  selectedEixos: string[];
  selectedMunicipios: string[] ;
  selectedEquipamentos: string[];

  constructor(private injector: Injector, public routerext: RouterExtensions) {



      this.eixos = [];
      this.eixos.push({label: 'EQUIPE TÉCNICA', value: 'EQUIPE TÉCNICA'});
      this.eixos.push({label: 'INFRAESTRUTURA', value: 'INFRAESTRUTURA'});
      this.eixos.push({
        label: 'PROGRAMAS, PROJETOS, SERVIÇOS E BENEFÍCIOS',
        value: 'PROGRAMAS, PROJETOS, SERVIÇOS E BENEFÍCIOS'
      });


      this.municipios = [];
      this.municipios.push({label: 'ANGRA DOS REIS', value: 'ANGRA DOS REIS'});
      this.municipios.push({label: 'BARRA DO PIRAÍ', value: 'BARRA DO PIRAÍ'});
      this.municipios.push({label: 'NITERÓI', value: 'NITERÓI'});
      this.municipios.push({label: 'SÃO GONÇALO', value: 'SÃO GONÇALO'});
      this.municipios.push({label: 'NOVA IGUAÇU', value: 'NOVA IGUAÇU'});


      this.equipamentos = [];
      this.equipamentos.push({label: 'CRAS', value: 'CRAS'});
      this.equipamentos.push({label: 'CRAS BARRA', value: 'CRAS BARRA'});
      this.equipamentos.push({label: 'CRAS SÃO GONÇALO', value: 'CRAS SÃO GONÇALO'});
      this.equipamentos.push({label: 'CRAS RIO', value: 'CRAS RIO'});


  }

  selectTipo(i: number) {
    if (i === 1) {
      this.tipo1 = !this.tipo1;
      return ;
    } else if (i === 2) {
      this.tipo2 = !this.tipo2;
      return ;
    }else {
      this.tipo3 = !this.tipo3;
      return ;
    }
  }

}
