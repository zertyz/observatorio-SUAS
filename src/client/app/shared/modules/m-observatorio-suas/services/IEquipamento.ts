/** <pre>
 * observatorioSUAS/IEquipamento.ts
 * ============
 * (created by coppolaop on Sex, Dec, 08, 2017)
 *
 * Representa um registro de Equipamentos de acordo com a lista de equipamentos de cada Municipio
 *
 * @see RelatedClass(es)
 * @author coppolaop
 */

export interface IEquipamento {
  tipo:      string;
  municipio: string;
  porte:     string;
  nome:      string;
  endereco:  string;
  cep:       string;
  telefone:  string;
}
