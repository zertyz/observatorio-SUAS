/** <pre>
 * busca.state.ts
 * =================
 * (created by coppolaop on Tue, dec, 26, 2017)
 *
 * Funções de acesso a dados vindas do serviço 'BuscaService'
 *
 * @see RelatedClass(es)
 * @author coppolaop
 */

import { Observable } from 'rxjs/Observable';

export interface IBuscaState {
  names: Array<string>;
}

export const initialState: IBuscaState = {
  names: <Array<string>>[]
};
