/** <pre>
 * observatorioSUAS/IPerguntas.ts
 * ============
 * (created by coppolaop on Sex, Dec, 08, 2017)
 *
 * Representa um registro de perguntas e respostas de acordo com cada tipo de equipamento
 *
 * @see RelatedClass(es)
 * @author coppolaop
 */

export interface IPerguntas {
  equipamento:   string; //Tipo de equipamento a qual a pergunta pertence
  eixo:          string;
  pergunta:      string;
  resposta:      string;
}
