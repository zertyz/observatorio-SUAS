/** <pre>
 * dados-e-indicadores.state.ts
 * =================
 * (created by coppolaop on Mon, dec, 11, 2017)
 *
 * Funções de acesso a dados vindas do serviço 'DadosEIndicadoresService'
 *
 * @see RelatedClass(es)
 * @author coppolaop
 */

import { Observable } from 'rxjs/Observable';

export interface IDadosEIndicadoresState {
  names: Array<string>;
}

export const initialState: IDadosEIndicadoresState = {
  names: <Array<string>>[]
};

export function getCidades(state$: Observable<IDadosEIndicadoresState>) {
  return state$.select(state => state.names);
}
