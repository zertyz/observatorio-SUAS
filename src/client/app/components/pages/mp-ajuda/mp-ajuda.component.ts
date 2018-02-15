//Criado com base no componente mp-subscribe

// libs
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {AccordionModule} from 'primeng/primeng';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

// services
import { AjudaService }   from '../../../shared/modules/m-observatorio-suas/services/ajuda.service';
import { IPerguntas }       from '../../../shared/modules/m-observatorio-suas/services/IPerguntas';

interface SubscriptionHttpPostObject {
  nome:     string;
  email:    string;
  mensagem: string;
}

@Component({
  moduleId: module.id,
  selector: 'mp-ajuda',
  templateUrl: 'mp-ajuda.component.html',
  styleUrls: ['mp-ajuda.component.css']
})
export class MPAjudaComponent {

  /* http */
  private httpPostOptions: any             = {headers: {'Content-Type': 'application/json'}};
  //private httpPostUrl: string              = 'http://apps.mprj.mp.br/eci/api/Aux/mailHLP';
  private httpPostUrl: string              = '/eci/api/Aux/mailHLP';  // depende do proxy configurado em 'project.config.ts'
  private subscriptionErrorMessage: string = null;

  /*public isPosting:  boolean = false;
  public subscribed: boolean = false;
  public nome:      string  = '';
  public email:      string  = '';
  public mensagem:      string  = '';*/

  // private equipamentoSelecionado :   string;
  private perguntasExibidas : IPerguntas[] = [];

  // dados direto do JSON
  private perguntasFrequentes : IPerguntas[] = [];

  private errorMessage: string = null;

  constructor(private ajudaService: AjudaService,
              private injector: Injector,
              public routerext: RouterExtensions) {
  }

  ngOnInit() {
    this.ajudaService.fetchPerguntas().subscribe(response => {
      this.perguntasFrequentes = response;
    }, error => this.errorMessage = < any > error);
    this.computaAjuda();
    document.getElementById('check1').click();
  }

  /*subscribe() {
    this.isPosting  = true;
    let postData: SubscriptionHttpPostObject = {
      nome:     this.nome,
      email:    this.email,
      mensagem: this.mensagem,
    }
    let p: Observable<SubscriptionHttpPostObject> = this.http.post(this.httpPostUrl, postData, this.httpPostOptions)
      .map(this.handleHttpPost)
      .catch(this.handleHttpError);
    p.subscribe(
      postResult => {                                                         this.isPosting = false; this.subscribed = true;},
      error      => {this.subscriptionErrorMessage = <any>error;              this.isPosting = false; this.subscribed = false;}
    );
  }

  public handleHttpPost(res: Response) {
    this.isPosting  = false;
    this.subscribed = true;
    let body = res.json();
    // return body.data || {};
  }

  public handleHttpError(error: Response | any) {
    this.isPosting                = false;
    this.subscribed               = false;
    this.subscriptionErrorMessage = (error.message || error);
    return Observable.throw(error.message || error);
  }*/

  computaAjuda(){
    this.ajudaService.fetchPerguntas().subscribe(response => {
      this.perguntasFrequentes = response;

      this.perguntasExibidas = this.perguntasFrequentes
      .filter(cras => cras.equipamento.toLocaleLowerCase() == 'cras')
      .map(cras => {
        return {
          equipamento: cras.equipamento,
          eixo:        cras.eixo,
          pergunta:    cras.pergunta,
          resposta:    cras.resposta
        };
      })}, error => this.errorMessage = < any > error);
  }
  selectTipo(i: string) {
     if (i === 'cras') {
      // this.equipamentoSelecionado = 'CRAS';
      this.perguntasExibidas = this.perguntasFrequentes
      .filter(cras => cras.equipamento.toLocaleLowerCase() == 'cras')
      .map(cras => {
        return {
          equipamento: cras.equipamento,
          eixo:        cras.eixo,
          pergunta:    cras.pergunta,
          resposta:    cras.resposta
        };
      });

    } else if (i === 'creas') {
      // this.equipamentoSelecionado = 'CREAS';
      this.perguntasExibidas = this.perguntasFrequentes
      .filter(creas => creas.equipamento.toLocaleLowerCase() == 'creas')
      .map(creas => {
        return {
          equipamento: creas.equipamento,
          eixo:        creas.eixo,
          pergunta:    creas.pergunta,
          resposta:    creas.resposta
        };
      });

    } else {
      // this.equipamentoSelecionado = 'Centro Pop';
      this.perguntasExibidas = this.perguntasFrequentes
      .filter(centroPop => centroPop.equipamento.toLocaleLowerCase() == 'centro pop')
      .map(centroPop => {
        return {
          equipamento: centroPop.equipamento,
          eixo:        centroPop.eixo,
          pergunta:    centroPop.pergunta,
          resposta:    centroPop.resposta
        };
      });

    }
  }

}
