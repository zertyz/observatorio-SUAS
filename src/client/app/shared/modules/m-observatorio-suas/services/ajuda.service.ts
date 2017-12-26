/** <pre>
 * ajuda.service.ts
 * ====================
 * (created by coppolaop on Fri, dec, 22, 2017)
 *
 * Consulta serviço externo e carrega dados da tela de Ajuda.
 *
 * @see RelatedClass(es)
 * @author coppolaop
 */

// angular
import { Injectable } from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions,
  Response
} from '@angular/http';

// libs
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

// app
import { Config } from '../../../../modules/core/index';
import { Analytics, AnalyticsService } from '../../../../modules/analytics/index';

// module
import { IPerguntas } from './IPerguntas';

@Injectable()
export class AjudaService {

  private JsonFileURL: string = `${Config.IS_MOBILE_NATIVE() ? '/' : ''}assets/dados/ajuda/`;//Caminho para a pasta de JSONs de Ajuda

  constructor(private http: Http) {}

  public fetchPerguntas(): Observable < IPerguntas[] > {
    return this.http.get(this.JsonFileURL + 'Perguntas_Frequentes.json')
                    .map((response: Response) => {
                      return < IPerguntas[] > response.json();
                    }).catch((error:any) => Observable.throw(String(error) + '. Erro no servidor ao resgatar Dados Gerais'));
  }

}
