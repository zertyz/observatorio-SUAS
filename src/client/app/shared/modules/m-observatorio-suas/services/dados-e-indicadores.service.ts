/** <pre>
 * dados-e-indicadores.service.ts
 * ====================
 * (created by coppolaop on Mon, dec, 11, 2017)
 *
 * Consulta serviço externo e carrega dados da tela de Dados e Indicadores.
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
import { IDadosGerais }               from './IDadosGerais';
import { IIndicadoresSociais }  from './IIndicadoresSociais';
import { IIndicadoresOrcamentarios }  from './IIndicadoresOrcamentarios';

@Injectable()
export class DadosEIndicadoresService {

  private JsonFileURL: string = `${Config.IS_MOBILE_NATIVE() ? '/' : ''}assets/dados/dados-e-indicadores/`;//Caminho para a pasta de JSONs de Dados e Indicadores

  constructor(private http: Http) {}

  public fetchDadosGerais(): Observable < IDadosGerais[] > {
    return this.http.get(this.JsonFileURL + 'Dados_Gerais.json')
                    .map((response: Response) => {
                      return < IDadosGerais[] > response.json();
                    }).catch((error:any) => Observable.throw(error.json().error || 'Erro no servidor ao resgatar Dados Gerais'));
  }

  public fetchIndicadoresSociais(): Observable < IIndicadoresSociais[] > {
    return this.http.get(this.JsonFileURL + 'Indicadores_Sociais.json')
                    .map((response: Response) => {
                      return < IIndicadoresSociais[] > response.json();
                    }).catch((error:any) => Observable.throw(error.json().error || 'Erro no servidor ao resgatar Indicadores Sociais'));
  }

  public fetchIndicadoresOrcamentarios(): Observable < IIndicadoresOrcamentarios[] > {
    return this.http.get(this.JsonFileURL + 'Indicadores_Orcamentarios.json')
                    .map((response: Response) => {
                      return < IIndicadoresOrcamentarios[] > response.json();
                    }).catch((error:any) => Observable.throw(error.json().error || 'Erro no servidor ao resgatar Indicadores Orcamentarios'));
  }

}
