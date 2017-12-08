/** <pre>
 * observatorioSUAS/IIndicadoresSociais.ts
 * ============
 * (created by coppolaop on Sex, Dec, 08, 2017)
 *
 * Representa um registro de Indicadores Sociais do Município
 *
 * @see RelatedClass(es)
 * @author coppolaop
 */

export interface IIndicadoresSociais {
  municipio:                          string;
  contagemCRAS:                       string;
  contagemCREAS:                      string;
  contagemCentrosPOP:                 string;
  totalEquipamentosEstado:            string;
  pEquipamentosEstado:                string;
  nFamiliasVulneraveis:               string;
  pFamiliasVulneraveisMunicipio:      string;
  pFamiliasVulneraveisEstado:         string;
  nFamiliasBolsaFamilia:              string;
  pFamiliasBolsaFamiliaMunicipio:     string;
  pFamiliasBolsaFamiliaEstado:        string;
  pFamiliasBolsaFamiliaCobertura:     string;
  pFamiliasCadastroUnicoCobertura:    string;
  bolsaFamiliaValorTotalRepassado:    string;
  nFamiliasCadastroUnico:             string;
  pCadastroUnicoMunicipio:            string;
  pCadastroUnicoEstado:               string;
  cadUnicoBeneficiosEventuais:        boolean;
  cadUnicoPAIF:                       boolean;
  cadUnicoPAEFI:                      boolean;
  nBeneficiariosPrestacaoContinuada:  string;
  bpcValorTotalRepassado:             string;
  nivelGestao:                        string;
}
