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

  private documentosProcurados: IPesquisa[] = [];
  private resultadosEncontrados: number = 0;
  private pesquisa :string;
  private categoria: string = '';

  private documentos: IPesquisa[] = [
    {
      'nome':'Lei Federal de Orçamento',
      'arquivo':'leideorcamentof.pdf',
      'palavraschave': ['lei', 'orcamento','federal', '2017' ],
      'categoria': 'legislacao'
    },
    {
      'nome':'Lei Estadual de Orçamento',
      'arquivo':'leideorcamentoe.pdf',
      'palavraschave': ['lei', 'orcamento','estadual', '2017' ],
      'categoria': 'legislacao',
    },
    {
      'nome':'Orçamento Federal de 2017',
      'arquivo':'orcamentof2017.pdf',
      'palavraschave': ['federal', 'orcamento', '2017' ],
      'categoria': 'orcamentos',
    },
    {
      'nome':'Orçamento Federal de 2017',
      'arquivo':'leideorcamentof2016.pdf',
      'palavraschave': ['lei', 'federal', 'orcamento', '2016' ],
      'categoria': 'orcamentos',
    },
    {
      'nome':'Peça de Atuação sobre Assistencia Social',
      'arquivo':'pecaSuas.pdf',
      'palavraschave': ['peça', 'suas', '1998' ],
      'categoria': 'pecasdeatuacao',
    },
    {
      'nome':'Cartilha do SUAS',
      'arquivo':'cartilha.pdf',
      'palavraschave': ['suas', 'cartilha', '1998' ],
      'categoria': 'pecasdeatuacao',
    },
    {
      'nome':'Inspeção CRAS Bangu',
      'arquivo':'inspecaoBangu.pdf',
      'palavraschave': ['inspecao', 'CRAS', '2017', 'Bangu' ],
      'categoria': 'inspecoes',
    },
    {
      'nome':'Inspeção CREAS Chatuba',
      'arquivo':'inspecaoChatuba.pdf',
      'palavraschave': ['Inspeção', 'CREAS', '2017', 'Chatuba' ],
      'categoria': 'inspecoes',
    },
  ];

  constructor(private injector: Injector, public routerext: RouterExtensions, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pesquisa = params['pesquisa'];
      this.categoria = params['categoria'];
      this.pesquisar(this.categoria, this.pesquisa);
    });

  }

  public pesquisar(categoria: string, value: string): void {
    if(value === '0') {
      if(categoria === '0'){
        this.documentosProcurados = this.documentos;
        this.resultadosEncontrados = this.documentos.length;
      }else {
        for (let i: number = 0; i<this.documentos.length; i++) {
            if (this.documentos[i].categoria.toUpperCase().indexOf(categoria.toUpperCase()) !== -1) {
              this.documentosProcurados.push(this.documentos[i]);
              this.resultadosEncontrados++;
            }
        }
      }
      
    }else {
      if(categoria === '0'){
        for (let i: number = 0; i<this.documentos.length; i++) {
          if (this.documentos[i].nome.toUpperCase().indexOf(value.toUpperCase()) !== -1) {
            this.documentosProcurados.push(this.documentos[i]);
            this.resultadosEncontrados++;
          } else {
            for(let j: number = 0; j<this.documentos[i].palavraschave.length;j++) {
              if (this.documentos[i].palavraschave[j].toUpperCase().indexOf(value.toUpperCase()) !== -1) {
                this.documentosProcurados.push(this.documentos[i]);
                this.resultadosEncontrados++;
              }
            }
          }
        }
      }else {
        for (let i: number = 0; i<this.documentos.length; i++) {
          if (this.documentos[i].nome.toUpperCase().indexOf(value.toUpperCase()) !== -1 && this.documentos[i].categoria.toUpperCase().indexOf(categoria.toUpperCase()) !== -1) {
            this.documentosProcurados.push(this.documentos[i]);
            this.resultadosEncontrados++;
          } else {
            for(let j: number = 0; j<this.documentos[i].palavraschave.length;j++) {
              if (this.documentos[i].palavraschave[j].toUpperCase().indexOf(value.toUpperCase()) !== -1 && this.documentos[i].categoria.toUpperCase().indexOf(categoria.toUpperCase()) !== -1) {
                this.documentosProcurados.push(this.documentos[i]);
                this.resultadosEncontrados++;
              }
            }
          }
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

// TODO refatorar como serviço
interface IPesquisa {
  nome:         string;
  arquivo:      string;
  palavraschave: string[];
  categoria:    string;
}
