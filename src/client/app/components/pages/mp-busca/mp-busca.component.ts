// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ActivatedRoute } from '@angular/router';
import { Input } from '@angular/core';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

@Component({
  moduleId: module.id,
  selector: 'mp-busca',
  templateUrl: 'mp-busca.component.html',
  styleUrls: ['mp-busca.component.css']
})
export class MPBuscaComponent {

  @Input() selectedRedirection: string   = '';

  private documentos: string[] = ['lei da batata', 'lei da cenoura', ' orcamento do aipim', 'inspecao do tomate'];
  private documentosProcurados: string[] = [];
  private resultadosEncontrados: number = 0;
  private pesquisa :string;
  private categoria: string = '';
  private campoPesquisa: string = '';

  constructor(private injector: Injector, public routerext: RouterExtensions, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pesquisa = params['pesquisa'];
      this.searchIt(this.pesquisa);
    });

  }

  public searchIt(value: string): void {
    if(value === '0') {
      this.documentosProcurados = this.documentos;
      this.resultadosEncontrados = this.documentos.length;
    }else {
      for (let i: number = 0; i<this.documentos.length; i++) {
        if (this.documentos[i].indexOf(value) !== -1) {
          this.documentosProcurados.push(this.documentos[i]);
          this.resultadosEncontrados++;
        }
      }
    }
  }

  onSubmit() {
    let pesquisa = document.getElementsByName('pesquisa')[0].value;
    let categoria = document.getElementsByName('categoria')[0].value;
    let url : string = window.location.href.split('busca')[0] + 'busca/'+ categoria +'/' + pesquisa;
    window.location.replace(url);
  }

}
