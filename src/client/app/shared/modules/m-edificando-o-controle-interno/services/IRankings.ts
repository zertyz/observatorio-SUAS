/** <pre>
 * edificandoOControleInterno/IRankings.ts
 * ============
 * (created by luiz on Ter, jun, 06, 2017)
 * (adapted by coppolaop on Sex, Nov, 10, 2017)
 *
 * Representa um registro de 'rankings_20171110.json', a saber:
 *  {municipio:, financiamento:, controleSocial:, gestao:, numeroEquipamentos:, coberturaBolsaFamilia:, coberturaCadastroUnico:, beneficiosEventuais:, geral:}
 *
 * @see RelatedClass(es)
 * @author luiz
 */

export interface IRankings {
  municipio: string;
  // dimensões
  financiamento: number;
  controleSocial: number;
  gestao: number;
  numeroEquipamentos: number;
  coberturaBolsaFamilia: number;
  coberturaCadastroUnico: number;
  beneficiosEventuais: number;
  geral: number;
}
