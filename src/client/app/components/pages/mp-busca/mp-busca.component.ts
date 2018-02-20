// libs
import { Component } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Input } from '@angular/core';

import { Injector } from '@angular/core';
import { RouterExtensions } from '../../../modules/core/index';

// services
import { BuscaService }   from '../../../shared/modules/m-observatorio-suas/services/busca.service';
import { IPesquisa }       from '../../../shared/modules/m-observatorio-suas/services/IPesquisa';

@Component({
  moduleId: module.id,
  selector: 'mp-busca',
  templateUrl: 'mp-busca.component.html',
  styleUrls: ['mp-busca.component.css']
})
export class MPBuscaComponent {

  @Input() selectedRedirection: string   = '';
  @Input()  pesquisa :string = '';
  @Input() categoria: string = '';

  private documentosProcurados: IPesquisa[] = [];
  private resultadosEncontrados: number = 0;

  private documentos: IPesquisa[] = [];
  private errorMessage: string = null;

  constructor(private buscaService: BuscaService,private injector: Injector, public routerext: RouterExtensions, private route: ActivatedRoute,
              private router: Router,) {
    this.documentos = [];
  }

  ngOnInit() {
    this.buscaService.fetchPesquisa().subscribe(response => {
      this.documentos = response;
      this.route.params.subscribe(params => {
      this.pesquisa = params['pesquisa'];
      this.categoria = params['categoria'];
      this.pesquisar(this.categoria, this.pesquisa);
    });
    }, error => this.errorMessage = < any > error);

  }

  public pesquisar(categoria: string, value: string): void {
    this.documentosProcurados = [];
    if(value === '0') {
      if(categoria === '0') {
        this.documentosProcurados = this.documentos;
        this.resultadosEncontrados = this.documentos.length;
      }else {
        for (let i: number = 0; i<this.documentos.length; i++) {
          if (this.documentos[i].categoria.toUpperCase().indexOf(categoria.toUpperCase()) !== -1) {
            this.documentosProcurados.push(this.documentos[i]);
            this.resultadosEncontrados++;
          }else if(categoria.toUpperCase().indexOf('ORCAMENTO') !== -1 && ((this.documentos[i].categoria.toUpperCase().indexOf('REPASSE')) !== -1 )) {
            this.documentosProcurados.push(this.documentos[i]);
            this.resultadosEncontrados++;
          }
        }
      }

    }else {
      if(categoria === '0') {
        for (let i: number = 0; i<this.documentos.length; i++) {
          if (this.documentos[i].nome.toUpperCase().indexOf(value.toUpperCase()) !== -1) {
            this.documentosProcurados.push(this.documentos[i]);
            this.resultadosEncontrados++;
          } else {
            if (this.documentos[i].arquivo.toUpperCase().indexOf(value.toUpperCase()) !== -1) {
              this.documentosProcurados.push(this.documentos[i]);
              this.resultadosEncontrados++;
            }
          }
        }
      }else {
        for (let i: number = 0; i<this.documentos.length; i++) {
          if (this.documentos[i].nome.toUpperCase().indexOf(value.toUpperCase()) !== -1 && (( this.documentos[i].categoria.toUpperCase().indexOf(categoria.toUpperCase()) !== -1) || (categoria.toUpperCase().indexOf('ORCAMENTO') !== -1) && ((this.documentos[i].categoria.toUpperCase().indexOf('REPASSE')) !== -1 ) )) {
            this.documentosProcurados.push(this.documentos[i]);
            this.resultadosEncontrados++;
          } else {
            if (this.documentos[i].arquivo.toUpperCase().indexOf(value.toUpperCase()) !== -1 && ((this.documentos[i].categoria.toUpperCase().indexOf(categoria.toUpperCase()) !== -1) || (categoria.toUpperCase().indexOf('ORCAMENTO') !== -1) && ((this.documentos[i].categoria.toUpperCase().indexOf('REPASSE')) !== -1 ) )) {
              this.documentosProcurados.push(this.documentos[i]);
              this.resultadosEncontrados++;
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.resultadosEncontrados = 0;
    let campoPesquisa = document.getElementById('_mprjbusca_WAR_mprjbuscaportlet_keywords_param2') as HTMLInputElement;
    let campoCategoria = document.getElementsByName('categoria')[0] as HTMLInputElement;
    this.pesquisar(campoCategoria.value, campoPesquisa.value);
  }

}
