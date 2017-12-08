/** <pre>
 * observatorioSUAS/IIndicadoresOrcamentarios.ts
 * ============
 * (created by coppolaop on Sex, Dec, 08, 2017)
 *
 * Representa um registro de Indicadores Orçamentários do Município
 *
 * @see RelatedClass(es)
 * @author coppolaop
 */

export interface IIndicadoresOrcamentarios {
  anoOrcamento:                               number;
  municipio:                                  string;
  programasTotal:                             number;
  programasNaoUtilizado:                      number;
  programasUtilizado:                         number;
  pseMediaComplexidadeTotal:                  number;
  pseMediaComplexidadeNaoUtilizado:           number;
  pseMediaComplexidadeUtilizado:              number;
  pseAltaComplexidadeTotal:                   number;
  pseAltaComplexidadeNaoUtilizado:            number;
  pseAltaComplexidadeUtilizado:               number;
  psbTotal:                                   number;
  psbNaoUtilizado:                            number;
  psbUtilizado:                               number;
  gestaoSuasTotal:                            number;
  gestaoSuasNaoUtilizado:                     number;
  gestaoSuasUtilizado:                        number;
  gestaoBolsaFamiliaTotal:                    number;
  gestaoBolsaFamiliaNaoUtilizado:             number;
  gestaoBolsaFamiliaUtilizado:                number;
  pisoBasicoFixoTotal:                        number;
  pisoBasicoFixoNaoUtilizado:                 number;
  pisoBasicoFixoUtilizado:                    number;
  pisoBasicoVariavelTotal:                    number;
  pisoBasicoVariavelNaoUtilizado:             number;
  pisoBasicoVariavelUtilizado:                number;
  pisoAltaComplexidade1Total:                 number;
  pisoAltaComplexidade1NaoUtilizado:          number;
  pisoAltaComplexidade1Utilizado:             number;
  pisoAltaComplexidade2Total:                 number;
  pisoAltaComplexidade2NaoUtilizado:          number;
  pisoAltaComplexidade2Utilizado:             number;
  pisoTransicaoMediaComplexidadeTotal:        number;
  pisoTransicaoMediaComplexidadeNaoUtilizado: number;
  pisoTransicaoMediaComplexidadeUtilizado:    number;
  totalPago:                                  number;
  totalBloqueado:                             number;
  totalUtilizado:                             number;
  pBloqueio:                                  number;
}
