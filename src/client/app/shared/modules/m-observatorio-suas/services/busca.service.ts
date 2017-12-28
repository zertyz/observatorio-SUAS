/** <pre>
 * busca.service.ts
 * ====================
 * (created by coppolaop on Tue, dec, 26, 2017)
 *
 * Consulta serviço externo e carrega dados da tela de Busca.
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
import { IPesquisa } from './IPesquisa';

@Injectable()
export class BuscaService {

  private JsonFileURL: string = `${Config.IS_MOBILE_NATIVE() ? '/' : ''}assets/dados/busca/`;//Caminho para a pasta de JSONs de Ajuda

  constructor(private http: Http) {}

  public fetchPesquisa(): Observable < IPesquisa[] > {
    return this.http.get(this.JsonFileURL + 'busca.json')
                    .map((response: Response) => {
                      return < IPesquisa[] > response.json();
                    }).catch((error:any) => Observable.throw(String(error) + '. Erro no servidor ao resgatar Lista de Arquivos'));
  }

}
