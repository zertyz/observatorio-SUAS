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
import { IDadosGerais }       from './IDadosGerais';
// import { IDadosMunicipio } from './IDadosMunicipio';

@Injectable()
export class DadosEIndicadoresService {

  private DadosGeraisJsonFileURL: string = `${Config.IS_MOBILE_NATIVE() ? '/' : ''}assets/dados/20171025/Dados_Gerais.json`;
  // private dadosMunicipiosJsonFileURL: string = `${Config.IS_MOBILE_NATIVE() ? '/' : ''}assets/dados/dados_municipios_20170614.json`;

  constructor(private http: Http) {}

  public fetchDadosGerais(): Observable < IDadosGerais[] > {
    return this.http.get(this.DadosGeraisJsonFileURL)
                    .map((response: Response) => {
                      return < IDadosGerais[] > response.json();
                    }).catch((error:any) => Observable.throw(error.json().error || 'Erro no servidor ao resgatar Dados Gerais'));
  }

  /*public fetchDadosMunicipios(): Observable < IDadosMunicipio[] > {
    return this.http.get(this.dadosMunicipiosJsonFileURL)
      .map((response: Response) => {
        return < IDadosMunicipio[] > response.json();
      }).catch((error:any) => Observable.throw(error.json().error || 'Erro no servidor ao resgatar dados dos municípios'));
  }*/

}
