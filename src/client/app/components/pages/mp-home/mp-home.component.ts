// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

// services
import { RankingsService } from '../../../shared/modules/m-edificando-o-controle-interno/services/rankings.service';
import { IRankings }       from '../../../shared/modules/m-edificando-o-controle-interno/services/IRankings';

// module libs
import { GradacoesDeCores } from '../../../shared/modules/m-edificando-o-controle-interno/GradacoesDeCores';

@Component({
  moduleId: module.id,
  selector: 'mp-home',
  templateUrl: 'mp-home.component.html',
  styleUrls: ['mp-home.component.css']
})
export class MPHomeComponent {

  public top10Cidades: string[] = ['§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§'];
  public top10Notas:   number[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  public errorMessage: string = null;

  // constroi a estrutura 'top10Cidades'
  constructor(private rankingsService: RankingsService,
              private gradacoes: GradacoesDeCores) {
    rankingsService.fetchRankings().subscribe(response => {
      let rankings: IRankings[] = response.sort( (e1, e2) => e2.geral - e1.geral);
      for (let i = 0; i < this.top10Cidades.length; i++) {
        this.top10Cidades[i] = rankings[i].municipio;
        this.top10Notas[i]   = rankings[i].geral;
      }
    }, error => this.errorMessage = < any > error);
  }

}
