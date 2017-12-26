/** <pre>
 * ajuda.state.ts
 * =================
 * (created by coppolaop on Fri, dec, 22, 2017)
 *
 * Funções de acesso a dados vindas do serviço 'AjudaService'
 *
 * @see RelatedClass(es)
 * @author coppolaop
 */

import { Observable } from 'rxjs/Observable';

export interface IAjudaState {
  names: Array<string>;
}

export const initialState: IAjudaState = {
  names: <Array<string>>[]
};
