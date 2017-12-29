/** <pre>
 * observatorioSUAS/IDadosGerais.ts
 * ============
 * (created by coppolaop on Sex, Dec, 08, 2017)
 *
 * Representa um registro de Dados Gerais do Municipio
 *
 * @see RelatedClass(es)
 * @author coppolaop
 */

export interface IDadosGerais {
  municipio: string;
  prefeito: string;
  secretarioAssistenciaSocial: string;
  populacao: number;
  idh: number; //Indice de Desenvolvimento Humano
  idc: number; //Indice do Cidadão Gestor
}
