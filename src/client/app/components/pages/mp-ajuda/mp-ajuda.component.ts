//Criado com base no componente mp-subscribe

// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {AccordionModule} from 'primeng/primeng';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

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
  public nome:      string  = "";
  public email:      string  = "";
  public mensagem:      string  = "";*/

  constructor(private injector: Injector, public routerext: RouterExtensions) {}

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

}
