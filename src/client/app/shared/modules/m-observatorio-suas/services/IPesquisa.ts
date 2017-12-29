/** <pre>
 * observatorioSUAS/IPesquisa.ts
 * ============
 * (created by coppolaop on Sex, Dec, 08, 2017)
 *
 * Para execução do download de um documento, foi criado um JSON listando os dados de cada arquivo
 * esta interface representa o registro de cada um desses arquivos
 *
 * @see RelatedClass(es)
 * @author coppolaop
 */

export interface IPesquisa {
  arquivo:       string; //Nome do arquivo salvo
  palavrasChave: string; //String com todas as palavras chave do arquivo sem necessidade de separador
  categoria:     string; //Categoria do Arquivo para buscador
  nome:          string; //Nome de Exibição do Arquivo
}
