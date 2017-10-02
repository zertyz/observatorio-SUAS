// libs
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {DataGridModule} from 'primeng/primeng';

import { ActivatedRoute } from '@angular/router';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';


@Component({
  moduleId: module.id,
  selector: 'mp-dados-e-indicadores',
  templateUrl: 'mp-dados-e-indicadores.component.html',
  styleUrls: ['mp-dados-e-indicadores.component.css']
})

export class MPDadosEIndicadoresComponent implements OnInit {

  // parâmetros
  municipio:      string;
  estado:         string = 'Rio de Janeiro';
  estadoSelected: boolean = true;

  //Campo selecionado nos botões no menu de equipamentos
  equipamentoSelecionado: string = 'equipamento';

  // campos computados
  indicadoresOrcamentariosDoMunicipio: IIndicadoresOrcamentarios;
  indicadoresSociaisDoMunicipio:       IIndicadoresSociais;
  idh: IIDH;
  populacao: IPopulacao;
  equipamentos: IEquipamento[];
  contagemCentrosPOP:      number;
  contagemCRAS:            number;
  contagemCREAS:           number;
  contagemEquipamentos:    number;
  totalEquipamentosEstado: number;
  graficoPSE: any;
  graficoPSB: any;
  graficoProgramas: any;

  opcoesGraficos: any = {
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    }
  };

  constructor(private injector: Injector,
              public routerext: RouterExtensions,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.municipio = params['municipio'] || 'Estado do Rio de Janeiro';
      if(this.municipio === 'Estado do Rio de Janeiro') {
        this.estadoSelected = true;
        this.computaCampos();
      }else {
        this.estadoSelected = false;
        this.computaCampos();
      }
      document.getElementById('check1').click();//Equipamento Total
    });

  }

  // computa campos assim que for resolvido o parâmetro "municipio"
  computaCampos() {

    // encontra indicadores orçamentários do município
    this.indicadoresOrcamentariosDoMunicipio = this.indicadoresOrcamentarios.find(indicadores => indicadores.municipio == this.municipio);
    if (this.indicadoresOrcamentariosDoMunicipio == null) {
      this.indicadoresOrcamentariosDoMunicipio = {
        "municipio": "§ não encontrado §",
        "pseUtilizado": -2,
        "pseNaoUtilizado": -2,
        "pseTotal": -2,
        "psbUtilizado": -2,
        "psbNaoUtilizado": -2,
        "psbTotal": -2,
        "programasUtilizado": -2,
        "programasNaoUtilizado": -2,
        "programasTotal": -2
      };
    }

    // pequena regra para "descagar" os dados não preenchidos
    let descagacoes: string[] = ['pse', 'psb', 'programas'];
    for (let descagando of descagacoes) {

      // tenta descagar '*Utilizado'
      if (this.indicadoresOrcamentariosDoMunicipio[`${descagando}Utilizado`] < 0) {
        if ((this.indicadoresOrcamentariosDoMunicipio[`${descagando}Total`] >= 0) && (this.indicadoresOrcamentariosDoMunicipio[`${descagando}NaoUtilizado`] >= 0)) {
          this.indicadoresOrcamentariosDoMunicipio[`${descagando}Utilizado`] = this.indicadoresOrcamentariosDoMunicipio[`${descagando}Total`] - this.indicadoresOrcamentariosDoMunicipio[`${descagando}NaoUtilizado`];
        }
      }

      // tenta descagar '*NaoUtilizado'
      if (this.indicadoresOrcamentariosDoMunicipio[`${descagando}NaoUtilizado`] < 0) {
        if ((this.indicadoresOrcamentariosDoMunicipio[`${descagando}Total`] >= 0) && (this.indicadoresOrcamentariosDoMunicipio[`${descagando}Utilizado`] >= 0)) {
          this.indicadoresOrcamentariosDoMunicipio[`${descagando}NaoUtilizado`] = this.indicadoresOrcamentariosDoMunicipio[`${descagando}Total`] - this.indicadoresOrcamentariosDoMunicipio[`${descagando}Utilizado`];
        }
      }

      // tenta descagar '*Total'
      if (this.indicadoresOrcamentariosDoMunicipio[`${descagando}Total`] < 0) {
        if ((this.indicadoresOrcamentariosDoMunicipio[`${descagando}Utilizado`] >= 0) && (this.indicadoresOrcamentariosDoMunicipio[`${descagando}NaoUtilizado`] >= 0)) {
          this.indicadoresOrcamentariosDoMunicipio[`${descagando}Total`] = this.indicadoresOrcamentariosDoMunicipio[`${descagando}Utilizado`] + this.indicadoresOrcamentariosDoMunicipio[`${descagando}NaoUtilizado`];
        }
      }

    }

    // encontra IDH do município
    this.idh = this.idhs.find(idh => idh.municipio == this.municipio);
    if (this.idh == null) {
      this.idh = {
        "municipio": "§ não encontrado §",
        "idh": -1,
      };
    }

    // encontra população do município
    this.populacao = this.populacoes.find(populacao => populacao.municipio == this.municipio);
    if (this.populacao == null) {
      this.populacao = {
        "municipio": "§ não encontrado §",
        "populacao": -1,
      };
    }

    // computa equipamentos
    this.contagemCentrosPOP   = 0;
    this.contagemCRAS         = 0;
    this.contagemCREAS        = 0;
    this.contagemEquipamentos = 0;
    this.equipamentos         = [];

    if(this.estadoSelected) {
      // computa Centros POP
      this.equipamentos = this.equipamentos.concat(this.centrosPOP
        .map(centroPOP => {
          this.contagemCentrosPOP++;
          this.contagemEquipamentos++;
          return {
            tipo:      'CENTRO POP',
            municipio: centroPOP[0],
            porte:     centroPOP[1],
            nome:      centroPOP[2].toLocaleUpperCase(),
            endereco:  `${centroPOP[3]} ${centroPOP[4]}, ${centroPOP[5]} - ${centroPOP[7]} - ${centroPOP[0]}`,
            cep:       centroPOP[8],
            telefone:  centroPOP[9],
          };
        }));

      this.equipamentos.reverse();
      this.equipamentos.pop();
      this.contagemCentrosPOP--;
      this.contagemEquipamentos--;
      this.equipamentos.reverse();

      // computa CREASes
      this.equipamentos = this.equipamentos.concat(this.creases
        .map(creas => {
          this.contagemCREAS++;
          this.contagemEquipamentos++;
          return {
            tipo:      'CREAS',
            municipio: creas[0],
            porte:     creas[1],
            nome:      creas[2].toLocaleUpperCase(),
            endereco:  `${creas[3]} ${creas[4]}, ${creas[5]} - ${creas[7]} - ${creas[0]}`,
            cep:       creas[8],
            telefone:  creas[9],
          };
        }));

      this.equipamentos.reverse();
      this.equipamentos.pop();
      this.contagemCREAS--;
      this.contagemEquipamentos--;
      this.equipamentos.reverse();

      // computa CRASes
      this.equipamentos = this.equipamentos.concat(this.crases
        .map(cras => {
          this.contagemCRAS++;
          this.contagemEquipamentos++;
          return {
            tipo:      'CRAS',
            municipio: cras[0],
            porte:     cras[1],
            nome:      cras[2].toLocaleUpperCase(),
            endereco:  `${cras[3]} ${cras[4]}, ${cras[5]} - ${cras[7]} - ${cras[0]}`,
            cep:       cras[8],
            telefone:  cras[9],
          };
        }));

      this.equipamentos.reverse();
      this.equipamentos.pop();
      this.contagemCRAS--;
      this.contagemEquipamentos--;
      this.equipamentos.reverse();

      // computa total de equipamentos no estado
      this.totalEquipamentosEstado = (this.centrosPOP.length-1) + (this.crases.length-1) + (this.creases.length-1);

      // computa indicadores sociais
      this.indicadoresSociaisDoMunicipio = this.indicadoresSociais
        .filter(indicadoresSociais => indicadoresSociais[0].toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
        .map(indicadoresSociais => {
          return {
            municipio:                         indicadoresSociais[0],
            prefeito:                          indicadoresSociais[1],
            secretarioAssistenciaSocial:       indicadoresSociais[2],
            nFamiliasVulneraveis:              indicadoresSociais[10],
            pFamiliasVulneraveisMunicipio:     indicadoresSociais[11],
            pFamiliasVulneraveisEstado:        indicadoresSociais[12],
            nFamiliasBolsaFamilia:             indicadoresSociais[13],
            pFamiliasBolsaFamiliaMunicipio:    indicadoresSociais[14],
            pFamiliasBolsaFamiliaCobertura:    indicadoresSociais[15],
            nFamiliasCadastroUnico:            indicadoresSociais[18],
            nBeneficiariosPrestacaoContinuada: indicadoresSociais[22],
            cadUnicoBeneficiosEventuais:       true,
            cadUnicoPAIF:                      true,
            cadUnicoPAEF:                      true,
          };
        })[0];

      // preenche estrutura de dados dos gráfico PSE
      this.graficoPSE = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentariosDoMunicipio.pseUtilizado, this.indicadoresOrcamentariosDoMunicipio.pseNaoUtilizado],
            backgroundColor: [
              "#117011",
              "#660000"
            ],
            hoverBackgroundColor: [
              "#117011",
              "#660000"
            ],
          }
        ],
      };

      // preenche estrutura de dados do gráfico PSB
      this.graficoPSB = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentariosDoMunicipio.psbUtilizado, this.indicadoresOrcamentariosDoMunicipio.psbNaoUtilizado],
            backgroundColor: [
              "#117011",
              "#660000"
            ],
            hoverBackgroundColor: [
              "#117011",
              "#660000"
            ]
          }
        ]
      };

      // preenche estrutura de dados do gráfico Programas
      this.graficoProgramas = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentariosDoMunicipio.programasUtilizado, this.indicadoresOrcamentariosDoMunicipio.programasNaoUtilizado],
            backgroundColor: [
              "#117011",
              "#660000",
            ],
            hoverBackgroundColor: [
              "#117011",
              "#660000"
            ]
          }
        ]
      };

    }else {

      // computa Centros POP
      this.equipamentos = this.equipamentos.concat(this.centrosPOP
        .filter(centroPOP => centroPOP[0].toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
        .map(centroPOP => {
          this.contagemCentrosPOP++;
          this.contagemEquipamentos++;
          return {
            tipo:      'CENTRO POP',
            municipio: centroPOP[0],
            porte:     centroPOP[1],
            nome:      centroPOP[2].toLocaleUpperCase(),
            endereco:  `${centroPOP[3]} ${centroPOP[4]}, ${centroPOP[5]} - ${centroPOP[7]} - ${centroPOP[0]}`,
            cep:       centroPOP[8],
            telefone:  centroPOP[9],
          };
        }));

      // computa CREASes
      this.equipamentos = this.equipamentos.concat(this.creases
        .filter(creas => creas[0].toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
        .map(creas => {
          this.contagemCREAS++;
          this.contagemEquipamentos++;
          return {
            tipo:      'CREAS',
            municipio: creas[0],
            porte:     creas[1],
            nome:      creas[2].toLocaleUpperCase(),
            endereco:  `${creas[3]} ${creas[4]}, ${creas[5]} - ${creas[7]} - ${creas[0]}`,
            cep:       creas[8],
            telefone:  creas[9],
          };
        }));

      // computa CRASes
      this.equipamentos = this.equipamentos.concat(this.crases
        .filter(cras => cras[0].toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
        .map(cras => {
          this.contagemCRAS++;
          this.contagemEquipamentos++;
          return {
            tipo:      'CRAS',
            municipio: cras[0],
            porte:     cras[1],
            nome:      cras[2].toLocaleUpperCase(),
            endereco:  `${cras[3]} ${cras[4]}, ${cras[5]} - ${cras[7]} - ${cras[0]}`,
            cep:       cras[8],
            telefone:  cras[9],
          };
        }));

      // computa total de equipamentos no estado
      this.totalEquipamentosEstado = (this.centrosPOP.length-1) + (this.crases.length-1) + (this.creases.length-1);

      // computa indicadores sociais
      this.indicadoresSociaisDoMunicipio = this.indicadoresSociais
        .filter(indicadoresSociais => indicadoresSociais[0].toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
        .map(indicadoresSociais => {
          return {
            municipio:                         indicadoresSociais[0],
            prefeito:                          indicadoresSociais[1],
            secretarioAssistenciaSocial:       indicadoresSociais[2],
            nFamiliasVulneraveis:              indicadoresSociais[10],
            pFamiliasVulneraveisMunicipio:     indicadoresSociais[11],
            pFamiliasVulneraveisEstado:        indicadoresSociais[12],
            nFamiliasBolsaFamilia:             indicadoresSociais[13],
            pFamiliasBolsaFamiliaMunicipio:    indicadoresSociais[14],
            pFamiliasBolsaFamiliaCobertura:    indicadoresSociais[15],
            nFamiliasCadastroUnico:            indicadoresSociais[18],
            nBeneficiariosPrestacaoContinuada: indicadoresSociais[22],
            cadUnicoBeneficiosEventuais:       indicadoresSociais[19] == "SIM" ? true : false,
            cadUnicoPAIF:                      indicadoresSociais[20] == "SIM" ? true : false,
            cadUnicoPAEF:                      indicadoresSociais[21] == "SIM" ? true : false,
        };
        })[0];

      // preenche estrutura de dados dos gráfico PSE
      this.graficoPSE = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentariosDoMunicipio.pseUtilizado, this.indicadoresOrcamentariosDoMunicipio.pseNaoUtilizado],
            backgroundColor: [
              "#117011",
              "#660000"
            ],
            hoverBackgroundColor: [
              "#117011",
              "#660000"
            ],
          }
        ],
      };

      // preenche estrutura de dados do gráfico PSB
      this.graficoPSB = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentariosDoMunicipio.psbUtilizado, this.indicadoresOrcamentariosDoMunicipio.psbNaoUtilizado],
            backgroundColor: [
              "#117011",
              "#660000"
            ],
            hoverBackgroundColor: [
              "#117011",
              "#660000"
            ]
          }
        ]
      };

      // preenche estrutura de dados do gráfico Programas
      this.graficoProgramas = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentariosDoMunicipio.programasUtilizado, this.indicadoresOrcamentariosDoMunicipio.programasNaoUtilizado],
            backgroundColor: [
              "#117011",
              "#660000",
            ],
            hoverBackgroundColor: [
              "#117011",
              "#660000"
            ]
          }
        ]
      };
    }

  }

  formataMoeda(value: number): string {
    let currencySign: string = 'R$ ';
    let decimalLength: number = 2;
    let chunkDelimiter: string = '.';
    let decimalDelimiter: string = ',';
    let chunkLength: number = 3;

    if (value == -1) {
      return '--';
    } else if (value == -2) {
      return '---';
    }

    let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
    let num = value.toFixed(Math.max(0, ~~decimalLength));

    return currencySign + (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);
  }

  formataPercent(total: number, part: number): string {
    let percentSign: string = '%';
    let decimalLength: number = 2;
    let chunkDelimiter: string = '.';
    let decimalDelimiter: string = ',';
    let chunkLength: number = 3;

    if ((total == -1) || (part == -1)) {
      return '--';
    } else if ((total == -2) || (part == -2)) {
      return '---';
    }

    let value = (part / total) * 100;

    let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
    let num = value.toFixed(Math.max(0, ~~decimalLength));

    return (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter) + percentSign;
  }

  formataFracao(value: number): string {
    let decimalLength: number = 3;
    let chunkDelimiter: string = '.';
    let decimalDelimiter: string = ',';
    let chunkLength: number = 3;

    if (value == -1) {
      return '--';
    } else if (value == -2) {
      return '---';
    }

    let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
    let num = value.toFixed(Math.max(0, ~~decimalLength));

    return (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);
  }

  formataInteiro(value: number): string {
    let decimalLength: number = 0;
    let chunkDelimiter: string = '.';
    let decimalDelimiter: string = ',';
    let chunkLength: number = 3;

    if (value == -1) {
      return '--';
    } else if (value == -2) {
      return '---';
    }

    let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
    let num = value.toFixed(Math.max(0, ~~decimalLength));

    return (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);
  }

  selectTipo(i: string) {
    //preenche os equipamentos apenas com os CRASes do municipio
    if (i === 'cras') {
      this.equipamentoSelecionado = 'CRAS';
      if(!this.estadoSelected) {
        this.equipamentos = this.crases
          .filter(cras => cras[0].toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
          .map(cras => {
            return {
              tipo: 'CRAS',
              municipio: cras[0],
              porte: cras[1],
              nome: cras[2].toLocaleUpperCase(),
              endereco: `${cras[3]} ${cras[4]}, ${cras[5]} - ${cras[7]} - ${cras[0]}`,
              cep: cras[8],
              telefone: cras[9],
            };
          });
      }else {
        this.equipamentos = this.crases
          .map(cras => {
            return {
              tipo: 'CRAS',
              municipio: cras[0],
              porte: cras[1],
              nome: cras[2].toLocaleUpperCase(),
              endereco: `${cras[3]} ${cras[4]}, ${cras[5]} - ${cras[7]} - ${cras[0]}`,
              cep: cras[8],
              telefone: cras[9],
            };
          });
        this.equipamentos.reverse();
        this.equipamentos.pop();
        this.equipamentos.reverse();
      }

    }else if (i === 'creas') {
      this.equipamentoSelecionado = 'CREAS';
      if(!this.estadoSelected) {
        //preenche os equipamentos apenas com os CREASes do municipio
        this.equipamentos = this.creases
          .filter(creas => creas[0].toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
          .map(creas => {
            return {
              tipo: 'CREAS',
              municipio: creas[0],
              porte: creas[1],
              nome: creas[2].toLocaleUpperCase(),
              endereco: `${creas[3]} ${creas[4]}, ${creas[5]} - ${creas[7]} - ${creas[0]}`,
              cep: creas[8],
              telefone: creas[9],
            };
          });
      }else {
        this.equipamentos = this.creases
          .map(creas => {
            return {
              tipo: 'CREAS',
              municipio: creas[0],
              porte: creas[1],
              nome: creas[2].toLocaleUpperCase(),
              endereco: `${creas[3]} ${creas[4]}, ${creas[5]} - ${creas[7]} - ${creas[0]}`,
              cep: creas[8],
              telefone: creas[9],
            };
          });
        this.equipamentos.reverse();
        this.equipamentos.pop();
        this.equipamentos.reverse();
      }

    }else if (i === 'centroPop') {
      this.equipamentoSelecionado = 'Centro Pop';
      if(!this.estadoSelected) {
        //preenche os equipamentos apenas com os Centros Pop do municipio
        this.equipamentos = this.centrosPOP
          .filter(centroPOP => centroPOP[0].toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
          .map(centroPOP => {
            return {
              tipo: 'CENTRO POP',
              municipio: centroPOP[0],
              porte: centroPOP[1],
              nome: centroPOP[2].toLocaleUpperCase(),
              endereco: `${centroPOP[3]} ${centroPOP[4]}, ${centroPOP[5]} - ${centroPOP[7]} - ${centroPOP[0]}`,
              cep: centroPOP[8],
              telefone: centroPOP[9],
            };
          });
      }else {
        this.equipamentos = this.centrosPOP
          .map(centroPOP => {
            return {
              tipo: 'CENTRO POP',
              municipio: centroPOP[0],
              porte: centroPOP[1],
              nome: centroPOP[2].toLocaleUpperCase(),
              endereco: `${centroPOP[3]} ${centroPOP[4]}, ${centroPOP[5]} - ${centroPOP[7]} - ${centroPOP[0]}`,
              cep: centroPOP[8],
              telefone: centroPOP[9],
            };
          });
        this.equipamentos.reverse();
        this.equipamentos.pop();
        this.equipamentos.reverse();
      }

    } else {
      this.equipamentoSelecionado = 'equipamento';
      if(!this.estadoSelected) {
        //preenche os equipamentos com todos os equipamentos, CRASes, CREASes e Centros Pop
        this.equipamentos = this.crases
          .filter(cras => cras[0].toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
          .map(cras => {
            return {
              tipo: 'CRAS',
              municipio: cras[0],
              porte: cras[1],
              nome: cras[2].toLocaleUpperCase(),
              endereco: `${cras[3]} ${cras[4]}, ${cras[5]} - ${cras[7]} - ${cras[0]}`,
              cep: cras[8],
              telefone: cras[9],
            };
          });

        this.equipamentos = this.equipamentos.concat(this.creases
          .filter(creas => creas[0].toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
          .map(creas => {
            return {
              tipo:      'CREAS',
              municipio: creas[0],
              porte:     creas[1],
              nome:      creas[2].toLocaleUpperCase(),
              endereco:  `${creas[3]} ${creas[4]}, ${creas[5]} - ${creas[7]} - ${creas[0]}`,
              cep:       creas[8],
              telefone:  creas[9],
            };
          }));

        this.equipamentos = this.equipamentos.concat(this.centrosPOP
          .filter(centroPOP => centroPOP[0].toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
          .map(centroPOP => {
            return {
              tipo:      'CENTRO POP',
              municipio: centroPOP[0],
              porte:     centroPOP[1],
              nome:      centroPOP[2].toLocaleUpperCase(),
              endereco:  `${centroPOP[3]} ${centroPOP[4]}, ${centroPOP[5]} - ${centroPOP[7]} - ${centroPOP[0]}`,
              cep:       centroPOP[8],
              telefone:  centroPOP[9],
            };
          }));
      }else {
        let auxEq: IEquipamento[];

        this.equipamentos = this.crases
          .map(cras => {
            return {
              tipo: 'CRAS',
              municipio: cras[0],
              porte: cras[1],
              nome: cras[2].toLocaleUpperCase(),
              endereco: `${cras[3]} ${cras[4]}, ${cras[5]} - ${cras[7]} - ${cras[0]}`,
              cep: cras[8],
              telefone: cras[9],
            };
          });

        this.equipamentos.reverse();
        this.equipamentos.pop();
        this.equipamentos.reverse();

        auxEq = this.creases
          .map(creas => {
            return {
              tipo:      'CREAS',
              municipio: creas[0],
              porte:     creas[1],
              nome:      creas[2].toLocaleUpperCase(),
              endereco:  `${creas[3]} ${creas[4]}, ${creas[5]} - ${creas[7]} - ${creas[0]}`,
              cep:       creas[8],
              telefone:  creas[9],
            };
          });

        auxEq.reverse();
        auxEq.pop();
        auxEq.reverse();

        this.equipamentos = this.equipamentos.concat(auxEq);

        auxEq = this.centrosPOP
          .map(centroPOP => {
            return {
              tipo:      'CENTRO POP',
              municipio: centroPOP[0],
              porte:     centroPOP[1],
              nome:      centroPOP[2].toLocaleUpperCase(),
              endereco:  `${centroPOP[3]} ${centroPOP[4]}, ${centroPOP[5]} - ${centroPOP[7]} - ${centroPOP[0]}`,
              cep:       centroPOP[8],
              telefone:  centroPOP[9],
            };
          });

        auxEq.reverse();
        auxEq.pop();
        auxEq.reverse();

        this.equipamentos = this.equipamentos.concat(auxEq);
      }
    }
  }

  // TODO cópia de indicadores_orcamentarios_20170810.json até que se implemente como serviço
  indicadoresOrcamentarios: IIndicadoresOrcamentarios[] = [
    {
      "municipio": "Estado do Rio de Janeiro",
      "pseUtilizado": 0.00,
      "pseNaoUtilizado": 0.00,
      "pseTotal": 0.00,
      "psbUtilizado": 0.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 0.00,
      "programasUtilizado": 0.00,
      "programasNaoUtilizado": -1,
      "programasTotal": 0.00
    },
    {
      "municipio": "Angra Dos Reis",
      "pseUtilizado": 67500.00,
      "pseNaoUtilizado": 544740.00,
      "pseTotal": 612240.00,
      "psbUtilizado": 159975.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 159975.00,
      "programasUtilizado": 348101.23,
      "programasNaoUtilizado": -1,
      "programasTotal": 348101.23
    },
    {
      "municipio": "Aperibé",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": 209861.67,
      "psbNaoUtilizado": -1,
      "psbTotal": 209861.67,
      "programasUtilizado": 25536.24,
      "programasNaoUtilizado": -1,
      "programasTotal": 25536.24
    },
    {
      "municipio": "Araruama",
      "pseUtilizado": 335950.60,
      "pseNaoUtilizado": 292230.84,
      "pseTotal": 628181.44,
      "psbUtilizado": 806025.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 806025.00,
      "programasUtilizado": 328374.96,
      "programasNaoUtilizado": -1,
      "programasTotal": 328374.96
    },
    {
      "municipio": "Areal",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": 7800.00,
      "psbNaoUtilizado": 30000.00,
      "psbTotal": 37800.00,
      "programasUtilizado": 27778.15,
      "programasNaoUtilizado": -1,
      "programasTotal": 27778.15
    },
    {
      "municipio": "Armação dos Búzios",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 244800.00,
      "psbTotal": 244800.00,
      "programasUtilizado": 27741.77,
      "programasNaoUtilizado": -1,
      "programasTotal": 27741.77
    },
    {
      "municipio": "Arraial do Cabo",
      "pseUtilizado": 18859.44,
      "pseNaoUtilizado": 89056.64,
      "pseTotal": 107916.08,
      "psbUtilizado": 58800.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 58800.00,
      "programasUtilizado": -1,
      "programasNaoUtilizado": -1,
      "programasTotal": -1
    },
    {
      "municipio": "Barra do Piraí",
      "pseUtilizado": 245003.18,
      "pseNaoUtilizado": 176502.12,
      "pseTotal": 421505.30,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 175200.00,
      "psbTotal": 175200.00,
      "programasUtilizado": 143495.84,
      "programasNaoUtilizado": -1,
      "programasTotal": 143495.84
    },
    {
      "municipio": "Barra Mansa",
      "pseUtilizado": 607618.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 607618.00,
      "psbUtilizado": 629951.12,
      "psbNaoUtilizado": -1,
      "psbTotal": 629951.12,
      "programasUtilizado": 198506.82,
      "programasNaoUtilizado": -1,
      "programasTotal": 198506.82
    },
    {
      "municipio": "Belford Roxo",
      "pseUtilizado": 906906.00,
      "pseNaoUtilizado": 481723.60,
      "pseTotal": 1388629.60,
      "psbUtilizado": 1702000.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 1702000.00,
      "programasUtilizado": 838495.23,
      "programasNaoUtilizado": -1,
      "programasTotal": 838495.23
    },
    {
      "municipio": "Bom Jardim",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 198060.00,
      "pseTotal": 198060.00,
      "psbUtilizado": 73586.74,
      "psbNaoUtilizado": -1,
      "psbTotal": 73586.74,
      "programasUtilizado": 35826.41,
      "programasNaoUtilizado": -1,
      "programasTotal": 35826.41
    },
    {
      "municipio": "Bom Jesus do Itabapoana",
      "pseUtilizado": 227355.70,
      "pseNaoUtilizado": -1,
      "pseTotal": 227355.70,
      "psbUtilizado": 358125.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 358125.00,
      "programasUtilizado": 97193.17,
      "programasNaoUtilizado": -1,
      "programasTotal": 97193.17
    },
    {
      "municipio": "Cabo Frio",
      "pseUtilizado": 165863.20,
      "pseNaoUtilizado": 282117.20,
      "pseTotal": 447980.40,
      "psbUtilizado": 140000.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 140000.00,
      "programasUtilizado": 303455.93,
      "programasNaoUtilizado": -1,
      "programasTotal": 303455.93
    },
    {
      "municipio": "Cachoeiras de Macacu",
      "pseUtilizado": 87500.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 87500.00,
      "psbUtilizado": 319400.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 319400.00,
      "programasUtilizado": 121226.61,
      "programasNaoUtilizado": -1,
      "programasTotal": 121226.61
    },
    {
      "municipio": "Cambuci",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 266550.00,
      "psbTotal": 266550.00,
      "programasUtilizado": 40162.69,
      "programasNaoUtilizado": -1,
      "programasTotal": 40162.69
    },
    {
      "municipio": "Campos Dos Goytacazes",
      "pseUtilizado": 748427.30,
      "pseNaoUtilizado": -1,
      "pseTotal": 748427.30,
      "psbUtilizado": 2186034.23,
      "psbNaoUtilizado": -1,
      "psbTotal": 2186034.23,
      "programasUtilizado": 941255.56,
      "programasNaoUtilizado": -1,
      "programasTotal": 941255.56
    },
    {
      "municipio": "Cantagalo",
      "pseUtilizado": 101999.60,
      "pseNaoUtilizado": -1,
      "pseTotal": 101999.60,
      "psbUtilizado": -1,
      "psbNaoUtilizado": -1,
      "psbTotal": -1,
      "programasUtilizado": 33287.01,
      "programasNaoUtilizado": -1,
      "programasTotal": 33287.01
    },
    {
      "municipio": "Carapebus",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": -1,
      "psbNaoUtilizado": -1,
      "psbTotal": -1,
      "programasUtilizado": 28168.15,
      "programasNaoUtilizado": -1,
      "programasTotal": 28168.15
    },
    {
      "municipio": "Cardoso Moreira",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": 168000.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 168000.00,
      "programasUtilizado": 31916.55,
      "programasNaoUtilizado": -1,
      "programasTotal": 31916.55
    },
    {
      "municipio": "Carmo",
      "pseUtilizado": 40200.30,
      "pseNaoUtilizado": 16275.00,
      "pseTotal": 56475.30,
      "psbUtilizado": 185222.10,
      "psbNaoUtilizado": -1,
      "psbTotal": 185222.10,
      "programasUtilizado": 49207.99,
      "programasNaoUtilizado": -1,
      "programasTotal": 49207.99
    },
    {
      "municipio": "Casimiro de Abreu",
      "pseUtilizado": 43760.00,
      "pseNaoUtilizado": 125680.00,
      "pseTotal": 169440.00,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 62625.00,
      "psbTotal": 62625.00,
      "programasUtilizado": 47366.39,
      "programasNaoUtilizado": -1,
      "programasTotal": 47366.39
    },
    {
      "municipio": "Comendador Levy Gasparian",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 186252.49,
      "psbTotal": 186252.49,
      "programasUtilizado": 20131.98,
      "programasNaoUtilizado": -1,
      "programasTotal": 20131.98
    },
    {
      "municipio": "Conceição de Macabu",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 191461.20,
      "pseTotal": 191461.20,
      "psbUtilizado": 112313.00,
      "psbNaoUtilizado": 16800.00,
      "psbTotal": 129113.00,
      "programasUtilizado": 58444.53,
      "programasNaoUtilizado": -1,
      "programasTotal": 58444.53
    },
    {
      "municipio": "Cordeiro",
      "pseUtilizado": 36493.80,
      "pseNaoUtilizado": 91944.20,
      "pseTotal": 128438.00,
      "psbUtilizado": 251592.85,
      "psbNaoUtilizado": -1,
      "psbTotal": 251592.85,
      "programasUtilizado": 27307.68,
      "programasNaoUtilizado": -1,
      "programasTotal": 27307.68
    },
    {
      "municipio": "Duas Barras",
      "pseUtilizado": 6203.70,
      "pseNaoUtilizado": 6203.70,
      "pseTotal": 12407.40,
      "psbUtilizado": 29226.66,
      "psbNaoUtilizado": 47850.00,
      "psbTotal": 77076.66,
      "programasUtilizado": 19354.98,
      "programasNaoUtilizado": -1,
      "programasTotal": 19354.98
    },
    {
      "municipio": "Duque de Caxias",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 3267897.35,
      "pseTotal": 3267897.35,
      "psbUtilizado": 456000.00,
      "psbNaoUtilizado": 216000.00,
      "psbTotal": 672000.00,
      "programasUtilizado": 1341525.75,
      "programasNaoUtilizado": -1,
      "programasTotal": 1341525.75
    },
    {
      "municipio": "Engenheiro Paulo de Frontin",
      "pseUtilizado": 9400.00,
      "pseNaoUtilizado": 36700.00,
      "pseTotal": 46100.00,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 113111.67,
      "psbTotal": 113111.67,
      "programasUtilizado": 34083.91,
      "programasNaoUtilizado": -1,
      "programasTotal": 34083.91
    },
    {
      "municipio": "Guapimirim",
      "pseUtilizado": 40600.00,
      "pseNaoUtilizado": 75000.00,
      "pseTotal": 115600.00,
      "psbUtilizado": 224208.64,
      "psbNaoUtilizado": -1,
      "psbTotal": 224208.64,
      "programasUtilizado": 126847.05,
      "programasNaoUtilizado": -1,
      "programasTotal": 126847.05
    },
    {
      "municipio": "Iguaba Grande",
      "pseUtilizado": 65000.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 65000.00,
      "psbUtilizado": 241266.24,
      "psbNaoUtilizado": -1,
      "psbTotal": 241266.24,
      "programasUtilizado": 63795.45,
      "programasNaoUtilizado": -1,
      "programasTotal": 63795.45
    },
    {
      "municipio": "Itaboraí",
      "pseUtilizado": 189953.20,
      "pseNaoUtilizado": -1,
      "pseTotal": 189953.20,
      "psbUtilizado": 864525.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 864525.00,
      "programasUtilizado": 385379.66,
      "programasNaoUtilizado": -1,
      "programasTotal": 385379.66
    },
    {
      "municipio": "Itaguaí",
      "pseUtilizado": 77132.60,
      "pseNaoUtilizado": 532394.50,
      "pseTotal": 609527.10,
      "psbUtilizado": 213213.22,
      "psbNaoUtilizado": 179550.00,
      "psbTotal": 392763.22,
      "programasUtilizado": 227045.23,
      "programasNaoUtilizado": -1,
      "programasTotal": 227045.23
    },
    {
      "municipio": "Italva",
      "pseUtilizado": 2230.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 2230.00,
      "psbUtilizado": -1,
      "psbNaoUtilizado": -1,
      "psbTotal": -1,
      "programasUtilizado": 30006.18,
      "programasNaoUtilizado": -1,
      "programasTotal": 30006.18
    },
    {
      "municipio": "Itaocara",
      "pseUtilizado": 52704.80,
      "pseNaoUtilizado": 83728.80,
      "pseTotal": 136433.60,
      "psbUtilizado": 235880.70,
      "psbNaoUtilizado": -1,
      "psbTotal": 235880.70,
      "programasUtilizado": 84070.92,
      "programasNaoUtilizado": -1,
      "programasTotal": 84070.92
    },
    {
      "municipio": "Itaperuna",
      "pseUtilizado": 179902.30,
      "pseNaoUtilizado": 193502.30,
      "pseTotal": 373404.60,
      "psbUtilizado": 621000.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 621000.00,
      "programasUtilizado": 151945.29,
      "programasNaoUtilizado": -1,
      "programasTotal": 151945.29
    },
    {
      "municipio": "Itatiaia",
      "pseUtilizado": 76200.00,
      "pseNaoUtilizado": 36000.00,
      "pseTotal": 112200.00,
      "psbUtilizado": 75192.50,
      "psbNaoUtilizado": -1,
      "psbTotal": 75192.50,
      "programasUtilizado": -1,
      "programasNaoUtilizado": 66220.18,
      "programasTotal": 66220.18
    },
    {
      "municipio": "Japeri",
      "pseUtilizado": 156600.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 156600.00,
      "psbUtilizado": 439125.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 439125.00,
      "programasUtilizado": 197565.72,
      "programasNaoUtilizado": -1,
      "programasTotal": 197565.72
    },
    {
      "municipio": "Laje do Muriaé",
      "pseUtilizado": 7949.20,
      "pseNaoUtilizado": -1,
      "pseTotal": 7949.20,
      "psbUtilizado": 165150.00,
      "psbNaoUtilizado": 12000.00,
      "psbTotal": 177150.00,
      "programasUtilizado": 23238.17,
      "programasNaoUtilizado": -1,
      "programasTotal": 23238.17
    },
    {
      "municipio": "Macaé",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 1526008.30,
      "pseTotal": 1526008.30,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 1042286.61,
      "psbTotal": 1042286.61,
      "programasUtilizado": 218689.52,
      "programasNaoUtilizado": -1,
      "programasTotal": 218689.52
    },
    {
      "municipio": "Macuco",
      "pseUtilizado": 3162.12,
      "pseNaoUtilizado": -1,
      "pseTotal": 3162.12,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 148015.01,
      "psbTotal": 148015.01,
      "programasUtilizado": 18227.39,
      "programasNaoUtilizado": -1,
      "programasTotal": 18227.39
    },
    {
      "municipio": "Magé",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 1055163.92,
      "pseTotal": 1055163.92,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 1644300.00,
      "psbTotal": 1644300.00,
      "programasUtilizado": 552617.17,
      "programasNaoUtilizado": -1,
      "programasTotal": 552617.17
    },
    {
      "municipio": "Mangaratiba",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": 8400.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 8400.00,
      "programasUtilizado": 63042.02,
      "programasNaoUtilizado": -1,
      "programasTotal": 63042.02
    },
    {
      "municipio": "Maricá",
      "pseUtilizado": 171669.92,
      "pseNaoUtilizado": -1,
      "pseTotal": 171669.92,
      "psbUtilizado": 438000.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 438000.00,
      "programasUtilizado": 195147.69,
      "programasNaoUtilizado": -1,
      "programasTotal": 195147.69
    },
    {
      "municipio": "Mendes",
      "pseUtilizado": 140456.60,
      "pseNaoUtilizado": 78962.80,
      "pseTotal": 219419.40,
      "psbUtilizado": 120000.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 120000.00,
      "programasUtilizado": 54680.46,
      "programasNaoUtilizado": -1,
      "programasTotal": 54680.46
    },
    {
      "municipio": "Mesquita",
      "pseUtilizado": 191678.48,
      "pseNaoUtilizado": 95133.86,
      "pseTotal": 286812.34,
      "psbUtilizado": 228000.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 228000.00,
      "programasUtilizado": 287656.64,
      "programasNaoUtilizado": -1,
      "programasTotal": 287656.64
    },
    {
      "municipio": "Miguel Pereira",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 133567.05,
      "pseTotal": 133567.05,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 189900.00,
      "psbTotal": 189900.00,
      "programasUtilizado": 48112.92,
      "programasNaoUtilizado": -1,
      "programasTotal": 48112.92
    },
    {
      "municipio": "Miracema",
      "pseUtilizado": 111124.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 111124.00,
      "psbUtilizado": 249487.24,
      "psbNaoUtilizado": -1,
      "psbTotal": 249487.24,
      "programasUtilizado": 58159.92,
      "programasNaoUtilizado": -1,
      "programasTotal": 58159.92
    },
    {
      "municipio": "Natividade",
      "pseUtilizado": 29000.00,
      "pseNaoUtilizado": 223978.50,
      "pseTotal": 252978.50,
      "psbUtilizado": 104200.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 104200.00,
      "programasUtilizado": 44725.13,
      "programasNaoUtilizado": -1,
      "programasTotal": 44725.13
    },
    {
      "municipio": "Nilópolis",
      "pseUtilizado": 184392.50,
      "pseNaoUtilizado": -1,
      "pseTotal": 184392.50,
      "psbUtilizado": 566859.84,
      "psbNaoUtilizado": -1,
      "psbTotal": 566859.84,
      "programasUtilizado": 212985.95,
      "programasNaoUtilizado": -1,
      "programasTotal": 212985.95
    },
    {
      "municipio": "Niterói",
      "pseUtilizado": 1445872.21,
      "pseNaoUtilizado": -1,
      "pseTotal": 1445872.21,
      "psbUtilizado": 1003500.00,
      "psbNaoUtilizado": 250500.00,
      "psbTotal": 1254000.00,
      "programasUtilizado": 383504.00,
      "programasNaoUtilizado": -1,
      "programasTotal": 383504.00
    },
    {
      "municipio": "Nova Friburgo",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 1183990.24,
      "pseTotal": 1183990.24,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 705430.32,
      "psbTotal": 705430.32,
      "programasUtilizado": 259773.22,
      "programasNaoUtilizado": -1,
      "programasTotal": 259773.22
    },
    {
      "municipio": "Nova Iguaçu",
      "pseUtilizado": 1698944.60,
      "pseNaoUtilizado": -1,
      "pseTotal": 1698944.60,
      "psbUtilizado": 2677950.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 2677950.00,
      "programasUtilizado": 1398688.48,
      "programasNaoUtilizado": -1,
      "programasTotal": 1398688.48
    },
    {
      "municipio": "Paracambi",
      "pseUtilizado": 113780.40,
      "pseNaoUtilizado": 5000.00,
      "pseTotal": 118780.40,
      "psbUtilizado": 118875.00,
      "psbNaoUtilizado": 46837.50,
      "psbTotal": 165712.50,
      "programasUtilizado": 149735.99,
      "programasNaoUtilizado": -1,
      "programasTotal": 149735.99
    },
    {
      "municipio": "Paraíba do Sul",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 177864.00,
      "pseTotal": 177864.00,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 235452.48,
      "psbTotal": 235452.48,
      "programasUtilizado": 70009.05,
      "programasNaoUtilizado": -1,
      "programasTotal": 70009.05
    },
    {
      "municipio": "Paraty",
      "pseUtilizado": 25840.00,
      "pseNaoUtilizado": 170751.80,
      "pseTotal": 196591.80,
      "psbUtilizado": 42800.00,
      "psbNaoUtilizado": 184200.00,
      "psbTotal": 227000.00,
      "programasUtilizado": 61573.39,
      "programasNaoUtilizado": -1,
      "programasTotal": 61573.39
    },
    {
      "municipio": "Paty do Alferes",
      "pseUtilizado": 18000.00,
      "pseNaoUtilizado": 78680.00,
      "pseTotal": 96680.00,
      "psbUtilizado": -1,
      "psbNaoUtilizado": -1,
      "psbTotal": -1,
      "programasUtilizado": 76844.91,
      "programasNaoUtilizado": -1,
      "programasTotal": 76844.91
    },
    {
      "municipio": "Petrópolis",
      "pseUtilizado": 597818.18,
      "pseNaoUtilizado": -1,
      "pseTotal": 597818.18,
      "psbUtilizado": 108637.50,
      "psbNaoUtilizado": -1,
      "psbTotal": 108637.50,
      "programasUtilizado": 355683.39,
      "programasNaoUtilizado": -1,
      "programasTotal": 355683.39
    },
    {
      "municipio": "Pinheiral",
      "pseUtilizado": 21250.40,
      "pseNaoUtilizado": 46502.40,
      "pseTotal": 67752.80,
      "psbUtilizado": 19175.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 19175.00,
      "programasUtilizado": 59074.75,
      "programasNaoUtilizado": -1,
      "programasTotal": 59074.75
    },
    {
      "municipio": "Piraí",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 162888.40,
      "pseTotal": 162888.40,
      "psbUtilizado": 25200.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 25200.00,
      "programasUtilizado": 39862.84,
      "programasNaoUtilizado": -1,
      "programasTotal": 39862.84
    },
    {
      "municipio": "Porciúncula",
      "pseUtilizado": 6460.00,
      "pseNaoUtilizado": 227633.60,
      "pseTotal": 234093.60,
      "psbUtilizado": -1,
      "psbNaoUtilizado": -1,
      "psbTotal": -1,
      "programasUtilizado": 43631.10,
      "programasNaoUtilizado": -1,
      "programasTotal": 43631.10
    },
    {
      "municipio": "Porto Real",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 136000.00,
      "pseTotal": 136000.00,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 33980.01,
      "psbTotal": 33980.01,
      "programasUtilizado": 35118.12,
      "programasNaoUtilizado": -1,
      "programasTotal": 35118.12
    },
    {
      "municipio": "Quatis",
      "pseUtilizado": 729.72,
      "pseNaoUtilizado": 4378.32,
      "pseTotal": 5108.04,
      "psbUtilizado": 34142.78,
      "psbNaoUtilizado": -1,
      "psbTotal": 34142.78,
      "programasUtilizado": 11470.70,
      "programasNaoUtilizado": -1,
      "programasTotal": 11470.70
    },
    {
      "municipio": "Queimados",
      "pseUtilizado": 97800.00,
      "pseNaoUtilizado": 167700.00,
      "pseTotal": 265500.00,
      "psbUtilizado": -1,
      "psbNaoUtilizado": -1,
      "psbTotal": -1,
      "programasUtilizado": 384921.40,
      "programasNaoUtilizado": -1,
      "programasTotal": 384921.40
    },
    {
      "municipio": "Quissamã",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 110500.00,
      "pseTotal": 110500.00,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 321567.00,
      "psbTotal": 321567.00,
      "programasUtilizado": 58560.12,
      "programasNaoUtilizado": -1,
      "programasTotal": 58560.12
    },
    {
      "municipio": "Resende",
      "pseUtilizado": 462363.64,
      "pseNaoUtilizado": -1,
      "pseTotal": 462363.64,
      "psbUtilizado": 430175.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 430175.00,
      "programasUtilizado": 156425.47,
      "programasNaoUtilizado": -1,
      "programasTotal": 156425.47
    },
    {
      "municipio": "Rio Bonito",
      "pseUtilizado": 138464.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 138464.00,
      "psbUtilizado": 355979.40,
      "psbNaoUtilizado": -1,
      "psbTotal": 355979.40,
      "programasUtilizado": 128225.34,
      "programasNaoUtilizado": -1,
      "programasTotal": 128225.34
    },
    {
      "municipio": "Rio Claro",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": 158175.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 158175.00,
      "programasUtilizado": 19415.14,
      "programasNaoUtilizado": -1,
      "programasTotal": 19415.14
    },
    {
      "municipio": "Rio Das Flores",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": 45750.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 45750.00,
      "programasUtilizado": 22210.20,
      "programasNaoUtilizado": -1,
      "programasTotal": 22210.20
    },
    {
      "municipio": "Rio Das Ostras",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 308368.20,
      "pseTotal": 308368.20,
      "psbUtilizado": 243106.68,
      "psbNaoUtilizado": -1,
      "psbTotal": 243106.68,
      "programasUtilizado": 151692.12,
      "programasNaoUtilizado": -1,
      "programasTotal": 151692.12
    },
    {
      "municipio": "Rio de Janeiro",
      "pseUtilizado": 13583112.30,
      "pseNaoUtilizado": -1,
      "pseTotal": 13583112.30,
      "psbUtilizado": 9702874.23,
      "psbNaoUtilizado": -1,
      "psbTotal": 9702874.23,
      "programasUtilizado": 6421872.46,
      "programasNaoUtilizado": -1,
      "programasTotal": 6421872.46
    },
    {
      "municipio": "Santa Maria Madalena",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 89700.00,
      "psbTotal": 89700.00,
      "programasUtilizado": 21406.11,
      "programasNaoUtilizado": -1,
      "programasTotal": 21406.11
    },
    {
      "municipio": "Santo Antônio de Pádua",
      "pseUtilizado": 15000.00,
      "pseNaoUtilizado": 195078.36,
      "pseTotal": 210078.36,
      "psbUtilizado": 16100.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 16100.00,
      "programasUtilizado": 74126.38,
      "programasNaoUtilizado": -1,
      "programasTotal": 74126.38
    },
    {
      "municipio": "São Fidélis",
      "pseUtilizado": 73368.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 73368.00,
      "psbUtilizado": 233800.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 233800.00,
      "programasUtilizado": 106772.56,
      "programasNaoUtilizado": -1,
      "programasTotal": 106772.56
    },
    {
      "municipio": "São Francisco de Itabapoana",
      "pseUtilizado": 53429.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 53429.00,
      "psbUtilizado": 322400.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 322400.00,
      "programasUtilizado": 122335.41,
      "programasNaoUtilizado": -1,
      "programasTotal": 122335.41
    },
    {
      "municipio": "São Gonçalo",
      "pseUtilizado": 3016753.30,
      "pseNaoUtilizado": -1,
      "pseTotal": 3016753.30,
      "psbUtilizado": 2346635.35,
      "psbNaoUtilizado": -1,
      "psbTotal": 2346635.35,
      "programasUtilizado": 1650770.07,
      "programasNaoUtilizado": -1,
      "programasTotal": 1650770.07
    },
    {
      "municipio": "São João da Barra",
      "pseUtilizado": 19380.00,
      "pseNaoUtilizado": 215966.40,
      "pseTotal": 235346.40,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 415174.46,
      "psbTotal": 415174.46,
      "programasUtilizado": 90706.78,
      "programasNaoUtilizado": -1,
      "programasTotal": 90706.78
    },
    {
      "municipio": "São João de Meriti",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 1075479.80,
      "pseTotal": 1075479.80,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 672000.00,
      "psbTotal": 672000.00,
      "programasUtilizado": 476188.68,
      "programasNaoUtilizado": -1,
      "programasTotal": 476188.68
    },
    {
      "municipio": "São José de Ubá",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": 120284.99,
      "psbNaoUtilizado": -1,
      "psbTotal": 120284.99,
      "programasUtilizado": 7826.49,
      "programasNaoUtilizado": -1,
      "programasTotal": 7826.49
    },
    {
      "municipio": "São José do Vale do Rio Preto",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 39000.00,
      "pseTotal": 39000.00,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 41700.00,
      "psbTotal": 41700.00,
      "programasUtilizado": 55140.10,
      "programasNaoUtilizado": -1,
      "programasTotal": 55140.10
    },
    {
      "municipio": "São Pedro da Aldeia",
      "pseUtilizado": 97702.68,
      "pseNaoUtilizado": 76459.44,
      "pseTotal": 174162.12,
      "psbUtilizado": 457350.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 457350.00,
      "programasUtilizado": 159046.16,
      "programasNaoUtilizado": -1,
      "programasTotal": 159046.16
    },
    {
      "municipio": "São Sebastião do Alto",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": 276150.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 276150.00,
      "programasUtilizado": 26972.73,
      "programasNaoUtilizado": -1,
      "programasTotal": 26972.73
    },
    {
      "municipio": "Sapucaia",
      "pseUtilizado": 64600.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 64600.00,
      "psbUtilizado": 248000.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 248000.00,
      "programasUtilizado": 44410.90,
      "programasNaoUtilizado": -1,
      "programasTotal": 44410.90
    },
    {
      "municipio": "Saquarema",
      "pseUtilizado": 135067.50,
      "pseNaoUtilizado": -1,
      "pseTotal": 135067.50,
      "psbUtilizado": -1,
      "psbNaoUtilizado": -1,
      "psbTotal": -1,
      "programasUtilizado": 124024.14,
      "programasNaoUtilizado": -1,
      "programasTotal": 124024.14
    },
    {
      "municipio": "Seropédica",
      "pseUtilizado": 150000.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 150000.00,
      "psbUtilizado": 354597.99,
      "psbNaoUtilizado": -1,
      "psbTotal": 354597.99,
      "programasUtilizado": 145398.82,
      "programasNaoUtilizado": -1,
      "programasTotal": 145398.82
    },
    {
      "municipio": "Silva Jardim",
      "pseUtilizado": -1,
      "pseNaoUtilizado": 39511.26,
      "pseTotal": 39511.26,
      "psbUtilizado": 31500.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 31500.00,
      "programasUtilizado": 86696.53,
      "programasNaoUtilizado": -1,
      "programasTotal": 86696.53
    },
    {
      "municipio": "Sumidouro",
      "pseUtilizado": 1216.20,
      "pseNaoUtilizado": 7297.20,
      "pseTotal": 8513.40,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 182069.29,
      "psbTotal": 182069.29,
      "programasUtilizado": 55254.96,
      "programasNaoUtilizado": -1,
      "programasTotal": 55254.96
    },
    {
      "municipio": "Tanguá",
      "pseUtilizado": 69600.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 69600.00,
      "psbUtilizado": -1,
      "psbNaoUtilizado": -1,
      "psbTotal": -1,
      "programasUtilizado": 67478.73,
      "programasNaoUtilizado": -1,
      "programasTotal": 67478.73
    },
    {
      "municipio": "Teresópolis",
      "pseUtilizado": 154856.70,
      "pseNaoUtilizado": -1,
      "pseTotal": 154856.70,
      "psbUtilizado": -1,
      "psbNaoUtilizado": -1,
      "psbTotal": -1,
      "programasUtilizado": 154546.08,
      "programasNaoUtilizado": -1,
      "programasTotal": 154546.08
    },
    {
      "municipio": "Trajano de Moraes",
      "pseUtilizado": -1,
      "pseNaoUtilizado": -1,
      "pseTotal": -1,
      "psbUtilizado": 150250.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 150250.00,
      "programasUtilizado": 27821.09,
      "programasNaoUtilizado": -1,
      "programasTotal": 27821.09
    },
    {
      "municipio": "Três Rios",
      "pseUtilizado": 89212.00,
      "pseNaoUtilizado": -1,
      "pseTotal": 89212.00,
      "psbUtilizado": 259375.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 259375.00,
      "programasUtilizado": 192505.64,
      "programasNaoUtilizado": -1,
      "programasTotal": 192505.64
    },
    {
      "municipio": "Valença",
      "pseUtilizado": 108855.20,
      "pseNaoUtilizado": 113655.20,
      "pseTotal": 222510.40,
      "psbUtilizado": 351860.61,
      "psbNaoUtilizado": -1,
      "psbTotal": 351860.61,
      "programasUtilizado": 173740.36,
      "programasNaoUtilizado": -1,
      "programasTotal": 173740.36
    },
    {
      "municipio": "Varre-sai",
      "pseUtilizado": 5191.20,
      "pseNaoUtilizado": -1,
      "pseTotal": 5191.20,
      "psbUtilizado": 17255.56,
      "psbNaoUtilizado": -1,
      "psbTotal": 17255.56,
      "programasUtilizado": 28269.57,
      "programasNaoUtilizado": -1,
      "programasTotal": 28269.57
    },
    {
      "municipio": "Vassouras",
      "pseUtilizado": 20000.00,
      "pseNaoUtilizado": 162500.00,
      "pseTotal": 182500.00,
      "psbUtilizado": -1,
      "psbNaoUtilizado": 247980.96,
      "psbTotal": 247980.96,
      "programasUtilizado": 61794.07,
      "programasNaoUtilizado": -1,
      "programasTotal": 61794.07
    },
    {
      "municipio": "Volta Redonda",
      "pseUtilizado": 951463.79,
      "pseNaoUtilizado": -1,
      "pseTotal": 951463.79,
      "psbUtilizado": 966000.00,
      "psbNaoUtilizado": -1,
      "psbTotal": 966000.00,
      "programasUtilizado": 516333.53,
      "programasNaoUtilizado": -1,
      "programasTotal": 516333.53
    },
  ];


  // TODO cópia de idh_20170810.json até que se implemente como serviço
  idhs: IIDH[] = [
    {"municipio": "Estado do Rio de Janeiro", "idh": 0.761},
    {"municipio": "Rio de Janeiro", "idh": 0.799},
    {"municipio": "Rio das Ostras", "idh": 0.773},
    {"municipio": "Volta Redonda", "idh": 0.771},
    {"municipio": "Resende", "idh": 0.768},
    {"municipio": "Maricá", "idh": 0.765},
    {"municipio": "Macaé", "idh": 0.764},
    {"municipio": "Iguaba Grande", "idh": 0.761},
    {"municipio": "Nilópolis", "idh": 0.753},
    {"municipio": "Mangaratiba", "idh": 0.753},
    {"municipio": "Petrópolis", "idh": 0.745},
    {"municipio": "Miguel Pereira", "idh": 0.745},
    {"municipio": "Nova Friburgo", "idh": 0.745},
    {"municipio": "São Gonçalo", "idh": 0.739},
    {"municipio": "Valença", "idh": 0.738},
    {"municipio": "Mesquita", "idh": 0.737},
    {"municipio": "Itatiaia", "idh": 0.737},
    {"municipio": "Mendes", "idh": 0.736},
    {"municipio": "Cabo Frio", "idh": 0.735},
    {"municipio": "Arraial do Cabo", "idh": 0.733},
    {"municipio": "Barra do Piraí", "idh": 0.733},
    {"municipio": "Bom Jesus do Itabapoana", "idh": 0.732},
    {"municipio": "Itaperuna", "idh": 0.730},
    {"municipio": "Natividade", "idh": 0.730},
    {"municipio": "Teresópolis", "idh": 0.730},
    {"municipio": "Cordeiro", "idh": 0.729},
    {"municipio": "Barra Mansa", "idh": 0.729},
    {"municipio": "Armação dos Búzios", "idh": 0.728},
    {"municipio": "Casimiro de Abreu", "idh": 0.726},
    {"municipio": "Três Rios", "idh": 0.725},
    {"municipio": "Angra dos Reis", "idh": 0.742},
    {"municipio": "Engenheiro Paulo de Frontin", "idh": 0.722},
    {"municipio": "Paracambi", "idh": 0.720},
    {"municipio": "São João de Meriti", "idh": 0.719},
    {"municipio": "Araruama", "idh": 0.718},
    {"municipio": "Santo Antônio de Pádua", "idh": 0.718},
    {"municipio": "Campos dos Goytacazes", "idh": 0.716},
    {"municipio": "Pinheiral", "idh": 0.715},
    {"municipio": "Itaguaí", "idh": 0.715},
    {"municipio": "Vassouras", "idh": 0.714},
    {"municipio": "Seropédica", "idh": 0.713},
    {"municipio": "Porto Real", "idh": 0.713},
    {"municipio": "Nova Iguaçu", "idh": 0.713},
    {"municipio": "Miracema", "idh": 0.713},
    {"municipio": "Itaocara", "idh": 0.713},
    {"municipio": "Carapebus", "idh": 0.713},
    {"municipio": "São Pedro da Aldeia", "idh": 0.712},
    {"municipio": "Conceição de Macabu", "idh": 0.712},
    {"municipio": "Duque de Caxias", "idh": 0.711},
    {"municipio": "Rio Bonito", "idh": 0.710},
    {"municipio": "Magé", "idh": 0.709},
    {"municipio": "Saquarema", "idh": 0.709},
    {"municipio": "Cantagalo", "idh": 0.709},
    {"municipio": "Piraí", "idh": 0.708},
    {"municipio": "Quissamã", "idh": 0.704},
    {"municipio": "Macuco", "idh": 0.703},
    {"municipio": "Paraíba do Sul", "idh": 0.702},
    {"municipio": "Cachoeiras de Macacu", "idh": 0.700},
    {"municipio": "Guapimirim", "idh": 0.698},
    {"municipio": "Porciúncula", "idh": 0.697},
    {"municipio": "Carmo", "idh": 0.696},
    {"municipio": "Itaboraí", "idh": 0.693},
    {"municipio": "Paraty", "idh": 0.693},
    {"municipio": "Aperibé", "idh": 0.692},
    {"municipio": "Cambuci", "idh": 0.691},
    {"municipio": "São Fidélis", "idh": 0.691},
    {"municipio": "Quatis", "idh": 0.690},
    {"municipio": "Italva", "idh": 0.688},
    {"municipio": "Comendador Levy Gasparian", "idh": 0.685},
    {"municipio": "Areal", "idh": 0.684},
    {"municipio": "Belford Roxo", "idh": 0.684},
    {"municipio": "Rio Claro", "idh": 0.683},
    {"municipio": "Rio das Flores", "idh": 0.680},
    {"municipio": "Queimados", "idh": 0.680},
    {"municipio": "Sapucaia", "idh": 0.675},
    {"municipio": "Paty do Alferes", "idh": 0.671},
    {"municipio": "São João da Barra", "idh": 0.671},
    {"municipio": "Laje do Muriaé", "idh": 0.668},
    {"municipio": "Santa Maria Madalena", "idh": 0.668},
    {"municipio": "Trajano de Moraes", "idh": 0.667},
    {"municipio": "Bom Jardim", "idh": 0.660},
    {"municipio": "São José do Vale do Rio Preto", "idh": 0.660},
    {"municipio": "Duas Barras", "idh": 0.659},
    {"municipio": "Japeri", "idh": 0.659},
    {"municipio": "Varre-Sai", "idh": 0.659},
    {"municipio": "Tanguá", "idh": 0.654},
    {"municipio": "Silva Jardim", "idh": 0.654},
    {"municipio": "São José de Ubá", "idh": 0.652},
    {"municipio": "Cardoso Moreira", "idh": 0.648},
    {"municipio": "São Sebastião do Alto", "idh": 0.646},
    {"municipio": "São Francisco de Itabapoana", "idh": 0.639},
    {"municipio": "Sumidouro", "idh": 0.611},
  ];

  // TODO cópia de populacao_20170810.json até que se implemente como serviço
  populacoes: IPopulacao[] = [
    {"municipio": "Estado do Rio de Janeiro", "populacao": 16231365},
    {"municipio": "Rio de Janeiro", "populacao": 6476631},
    {"municipio": "São Gonçalo", "populacao": 1038081},
    {"municipio": "Duque de Caxias", "populacao": 882729},
    {"municipio": "Nova Iguaçu", "populacao": 807492},
    {"municipio": "Niterói", "populacao": 496696},
    {"municipio": "São João de Meriti", "populacao": 483128},
    {"municipio": "Belford Roxo", "populacao": 481127},
    {"municipio": "Campos dos Goytacazes", "populacao": 460624},
    {"municipio": "Petrópolis", "populacao": 298142},
    {"municipio": "Volta Redonda", "populacao": 262970},
    {"municipio": "Magé", "populacao": 236319},
    {"municipio": "Itaboraí", "populacao": 229007},
    {"municipio": "Nova Friburgo", "populacao": 220082},
    {"municipio": "Macaé", "populacao": 219564},
    {"municipio": "Cabo Frio", "populacao": 208451},
    {"municipio": "Angra dos Reis", "populacao": 188276},
    {"municipio": "Barra Mansa", "populacao": 179915},
    {"municipio": "Mesquita", "populacao": 176566},
    {"municipio": "Teresópolis", "populacao": 172040},
    {"municipio": "Nilópolis", "populacao": 158309},
    {"municipio": "Maricá", "populacao": 146549},
    {"municipio": "Queimados", "populacao": 143632},
    {"municipio": "Rio das Ostras", "populacao": 131976},
    {"municipio": "Resende", "populacao": 125214},
    {"municipio": "Araruama", "populacao": 122865},
    {"municipio": "Itaguaí", "populacao": 119143},
    {"municipio": "Japeri", "populacao": 99863},
    {"municipio": "Itaperuna", "populacao": 99021},
    {"municipio": "São Pedro da Aldeia", "populacao": 96920},
    {"municipio": "Barra do Piraí", "populacao": 96865},
    {"municipio": "Seropédica", "populacao": 82892},
    {"municipio": "Saquarema", "populacao": 82359},
    {"municipio": "Três Rios", "populacao": 79264},
    {"municipio": "Valença", "populacao": 73725},
    {"municipio": "Rio Bonito", "populacao": 57615},
    {"municipio": "Guapimirim", "populacao": 56515},
    {"municipio": "Cachoeiras de Macacu", "populacao": 56290},
    {"municipio": "Paracambi", "populacao": 49521},
    {"municipio": "Paraíba do Sul", "populacao": 42356},
    {"municipio": "São Francisco de Itabapoana", "populacao": 41291},
    {"municipio": "Santo Antônio de Pádua", "populacao": 41178},
    {"municipio": "Mangaratiba", "populacao": 40779},
    {"municipio": "Paraty", "populacao": 40478},
    {"municipio": "Casimiro de Abreu", "populacao": 40305},
    {"municipio": "São Fidélis", "populacao": 37703},
    {"municipio": "Bom Jesus do Itabapoana", "populacao": 35964},
    {"municipio": "Vassouras", "populacao": 35432},
    {"municipio": "São João da Barra", "populacao": 34583},
    {"municipio": "Tanguá", "populacao": 32426},
    {"municipio": "Armação dos Búzios", "populacao": 31067},
    {"municipio": "Itatiaia", "populacao": 30240},
    {"municipio": "Arraial do Cabo", "populacao": 29097},
    {"municipio": "Conceição de Macabu", "populacao": 27924},
    {"municipio": "Piraí", "populacao": 27838},
    {"municipio": "Paty do Alferes", "populacao": 26818},
    {"municipio": "Miracema", "populacao": 26665},
    {"municipio": "Bom Jardim", "populacao": 26278},
    {"municipio": "Iguaba Grande", "populacao": 25901},
    {"municipio": "Miguel Pereira", "populacao": 24842},
    {"municipio": "Pinheiral", "populacao": 23887},
    {"municipio": "Itaocara", "populacao": 22779},
    {"municipio": "Silva Jardim", "populacao": 21307},
    {"municipio": "Cordeiro", "populacao": 21063},
    {"municipio": "São José do Vale do Rio Preto", "populacao": 20916},
    {"municipio": "Quissamã", "populacao": 20700},
    {"municipio": "Cantagalo", "populacao": 19759},
    {"municipio": "Porto Real", "populacao": 18266},
    {"municipio": "Carmo", "populacao": 18200},
    {"municipio": "Mendes", "populacao": 18099},
    {"municipio": "Porciúncula", "populacao": 18059},
    {"municipio": "Rio Claro", "populacao": 17826},
    {"municipio": "Sapucaia", "populacao": 17606},
    {"municipio": "Sumidouro", "populacao": 15127},
    {"municipio": "Natividade", "populacao": 15013},
    {"municipio": "Carapebus", "populacao": 14888},
    {"municipio": "Cambuci", "populacao": 14836},
    {"municipio": "Italva", "populacao": 14442},
    {"municipio": "Engenheiro Paulo de Frontin", "populacao": 13626},
    {"municipio": "Quatis", "populacao": 13543},
    {"municipio": "Cardoso Moreira", "populacao": 12558},
    {"municipio": "Areal", "populacao": 11970},
    {"municipio": "Duas Barras", "populacao": 11121},
    {"municipio": "Aperibé", "populacao": 11023},
    {"municipio": "Varre-Sai", "populacao": 10402},
    {"municipio": "Trajano de Moraes", "populacao": 10350},
    {"municipio": "Santa Maria Madalena", "populacao": 10225},
    {"municipio": "São Sebastião do Alto", "populacao": 9054},
    {"municipio": "Rio das Flores", "populacao": 8892},
    {"municipio": "Comendador Levy Gasparian", "populacao": 8250},
    {"municipio": "Laje do Muriaé", "populacao": 7298},
    {"municipio": "São José de Ubá", "populacao": 7206},
    {"municipio": "Macuco", "populacao": 5398},
  ];

  // TODO cópia de centro_pop_20170810.json
  centrosPOP: string[][] = [
    ["Municipio_2013", "Porte_pop2010", "ident_1", "ident_2", "ident_3", "ident_4", "ident_5", "ident_6", "ident_8", "ident_12"],
    ["Araruama", "Grande", "CENTRO POP", "Rodovia", "AMARAL PEIXOTO", "1141", "", "VILA CAPRI", "28970-000", "(22) 2665-3256"],
    ["Barra Mansa", "Grande", "CENTRO POP CASA DA GENTE", "Alameda", "Alameda vanzzi", "60", "", "Ano Bom", "27360-000", "(24) 3324-1486"],
    ["Belford Roxo", "Grande", "CREAS -CENTRO DE REFERENCIA ESPECIALIZADO EM POPULAÇÃO DE RUA", "Estrada", "Estrada Dr. Plínio Casado", "3968", "loja 01", "CENTRO", "26127-780", "(21) 2761-4088"],
    ["Campos dos Goytacazes", "Grande", "CREAS - CENTRO POP- CENTRO DE REFERÊNCIA ESPECIALIZADO PARA POPULAÇÃO EM SITUAÇÃO DE RUA", "Rua", "Rua Tenente Coronel Cardoso", "565", "", "Centro", "28035-042", "(22) 2726-4041"],
    ["Duque de Caxias", "Grande", "CREAS POP FIGUEIRA", "Estrada", "Estrada Velha do Pilar", "0", "", "FIGUEIRA", "25231-610", "(21) 2771-0976"],
    ["Itaboraí", "Grande", "CENTRO POP - ESPECIALIZADO PARA PESSOAS EM SITUAÇÃO DE RUA", "Rua", "Augusto Moreira", "0", "LT 53", "Jardim Imperial", "24800-000", "(21) 3639-2080"],
    ["Itaguaí", "Grande", "CENTRO POP", "Rua", "Lea Cabral da Cunha", "161", "", "Centro", "23810-410", "(21) 2687-8208"],
    ["Macaé", "Grande", "CREAS  CENTRO POP", "Rua", "JOSE BRUNO DE AZEVEDO", "99", "", "CENTRO", "27947-090", "(22) 2796-1084"],
    ["Magé", "Grande", "CENTRO POP MAGÉ", "Rua", "Mario de Brito", "119", "", "Piabetá", "25931-746", "(21) 2659-0834"],
    ["Niterói", "Grande", "CENTRO POP", "Rua", "Rua Coronel Gomes Machado", "281", "", "Centro", "24020-111", "(21) 2620-1578"],
    ["Nova Iguaçu", "Grande", "CREAS POP - POPULAÇÃO EM SITUAÇÃO DE RUA", "Rua", "REPÚBLICA ÁRABE DA SÍRIA", "136", "", "Centro", "26215-520", "(21) 2667-5795"],
    ["Petrópolis", "Grande", "CENTRO POP MARCELINO DA CONCEIÇÃO GARCIA", "Rua", "MARECHAL FLORIANO PEIXOTO", "396", "", "CENTRO", "25610-081", "(24) 2242-4554"],
    ["Resende", "Grande", "CREAS POP", "Rua", "do Rosário", "230", "casa", "Centro", "27500-000", "(24) 3360-9739"],
    ["Rio de Janeiro", "Metrópole", "CENTRO POP BÁRBARA CALAZANS", "Praça", "PIO X", "119", "6 ANDAR", "Centro", "20040-002", "(21) 96858-7736"],
    ["Rio de Janeiro", "Metrópole", "CENTRO POP JOSÉ SARAMAGO", "Rua", "CAPITÃO ALIATAR MARTINS", "211", "TERREO", "IRAJÁ", "21235-515", "(21) 2051-4118"],
    ["São Gonçalo", "Metrópole", "CENTRO POP I", "Rua", "Maria Candida", "42", "", "Mutondo", "24450-690", "(21) 3708-7850"],
    ["São Gonçalo", "Metrópole", "CREAS CentroPop II", "Rua", "São Pedro", "2", "", "Vista Alegre", "24412-380", "(21) 3262-3603"],
    ["São João de Meriti", "Grande", "CREAS - Centro POP", "Avenida", "Doutor Celso José de Carvalho", "911", "Loja R", "Jardim Meriti", "25555-201", "(21) 2651-2696"],
    ["Volta Redonda", "Grande", "CREAS POP - Centro de Referencia Especializado para Pessoas em Situação de Rua", "Rua", "PAULO LEOPOLDO MARÇAL", "117", "", "ATERRADO", "27213-280", "(24) 3339-9588"],
  ];

  // TODO cópia de cras_20170810.json
  crases: string[][] = [
    ["Município", "Porte_pop2010", "ident_1_Nome", "ident_2_TPLog", "ident_3_Endereço", "ident_4_Núm", "ident_5_Comp", "ident_6_Bairro", "ident_8_CEP", "ident_12_Tel"],
    ["Angra Dos Reis", "Grande", "CRAS Frade", "Rua", "Julieta Conceição Reis", "142", "", "Frade", "23946020", "(24)3369655"],
    ["Angra Dos Reis", "Grande", "CRAS Belém", "Rodovia", "mario covas s/n", "0", "", "Belém", "23933005", "(24)3368463"],
    ["Angra Dos Reis", "Grande", "CRAS Monsuaba", "Rua", "Manoel de Souza Lima", "248", "", "Monsuaba", "23916075", "(24)3366109"],
    ["Angra Dos Reis", "Grande", "CRAS Bracuí", "Rua", "Três Amigos", "32", "", "Bracuhy", "23943150", "(24)3363189"],
    ["Angra Dos Reis", "Grande", "CRAS Campo Belo", "Rua", "das Margaridas", "21", "", "Campo Belo", "23900000", "(24)3377773"],
    ["Angra Dos Reis", "Grande", "CRAS Nova Angra", "Avenida", "Jose Fausto de Queiroz", "5", "", "japuiba", "23934087", "(24)3377188"],
    ["Angra Dos Reis", "Grande", "CRAS Parque Mambucaba", "Rua", "Limeira", "96", "", "Parque Mambucaba", "23900000", "(24)3362443"],
    ["Aperibé", "Pequeno I", "CRAS CENTRO", "Rua", "ANIBAL CORTES", "46", "CASA", "CENTRO", "28495000", "(22)3864160"],
    ["Aperibé", "Pequeno I", "CRAS PORTO DAS BARCAS", "Rua", "DIOMAR BAIRRAL", "1240", "CASA", "PORTO DAS BARCAS", "28495000", "(22)3861364"],
    ["Aperibé", "Pequeno I", "CRAS PONTE SECA", "Rua", "Genocy Coelho da Silva", "0", "", "PONTE SECA", "28495000", "(22)3864417"],
    ["Araruama", "Grande", "CRAS DO MUTIRÃO", "Rua", "RUA HORACIO VIEIRA", "0", "COMERCIAL", "MUTIRÃO", "28970000", "(22)2665551"],
    ["Araruama", "Grande", "CRAS  Bananeiras", "Rua", "Iguarassu", "176", "Parque Novo Horizonte", "Bananeiras", "28970000", "(22)2665564"],
    ["Araruama", "Grande", "CRAS FAZENDINHA", "Rua", "ANTÔNIO DIAS DA CUNHA", "0", "", "FAZENDINHA", "28970000", "(22)2664432"],
    ["Araruama", "Grande", "CRAS DE SÃO VICENTE", "Rua", "B", "0", "", "SÃO VICENTE DE PAULA", "28980000", "(22)2666155"],
    ["Araruama", "Grande", "CRAS DO OUTEIRO", "Rua", "Almirante Protógenes Guimarães", "679", "", "Outeiro", "28970000", "(22)2665324"],
    ["Areal", "Pequeno I", "Centro de Referencia de Assistencia Social - Cras Amazonas", "Rua", "Inglaterra", "9", "", "Amazonas", "25845000", "(24)2257202"],
    ["Areal", "Pequeno I", "Centro de Referencia da Assistencia Social - CRAS Centro", "Rua", "Manoel Cabral de Melo", "425", "", "Centro", "25845000", "(24)2257290"],
    ["Armação Dos Búzios", "Pequeno II", "CRAS José Gonçalves", "Avenida", "José Gonçalves", "44", "", "José Gonçalves", "28950000", "(22)2633073"],
    ["Armação Dos Búzios", "Pequeno II", "CRAS BAIA FORMOSA", "Estrada", "CABO FRIO BUZIOS", "1201", "", "BAIA FORMOSA", "28950000", "(22)2633076"],
    ["Armação Dos Búzios", "Pequeno II", "CRAS - RASA", "Rua", "ALVARO ELIDIO GONÇALVES", "317", "À ESQUERDA DA ESTÁTUA DO ZUMBI", "RASA", "28950000", "(22)2620895"],
    ["Arraial do Cabo", "Pequeno II", "CRAS JOSÉ HENRIQUE DA SILVA", "Rua", "SÃO GENUÁRIO", "51", "", "FIGUEIRA", "28930000", "(22)2662111"],
    ["Arraial do Cabo", "Pequeno II", "CRAS AMADO JULIÃO", "Travessa", "TOME DE SOUZA", "6", "", "MORRO DA CABOCLA", "28930000", "(22)2622178"],
    ["Barra do Piraí", "Médio", "CRAS Areal", "Rua", "Teresopolis", "52", "", "Areal", "27150090", "(24)2445154"],
    ["Barra do Piraí", "Médio", "CRAS Vargem Alegre", "Rua", "Elias Antonio", "26", "", "Santa Rosa", "27155000", "(24)2430214"],
    ["Barra do Piraí", "Médio", "CRAS California", "Rua", "32", "142", "", "Morada do Vale", "27163000", "(24)3347845"],
    ["Barra do Piraí", "Médio", "CRAS Centro", "Rua", "José Ferreira Aguiar", "128", "", "Centro", "27123150", "(24)2443108"],
    ["Barra Mansa", "Grande", "CRAS VILA NATAL", "Rua", "Manoel Anisio Rodrigues", "4", "", "Vila Natal", "27330000", "(24)3349053"],
    ["Barra Mansa", "Grande", "CRAS GETÚLIO VARGAS", "Rua", "BELO HORIZONTE", "273", "", "GETÚLIO VARGAS", "27325340", "(24)3322017"],
    ["Barra Mansa", "Grande", "CRAS PENA FORTE", "Rua", "Vereador Joaquim Boa Morte", "8", "", "VILA CORINGA", "27321370", "(24)3323043"],
    ["Barra Mansa", "Grande", "CRAS SÃO PEDRO", "Rua", "RUA RODOLPHO MARQUES", "356", "", "SÃO PEDRO", "27340040", "(24)3322652"],
    ["Barra Mansa", "Grande", "CRAS SIDERLÂNDIA", "Rua", "JOSE GONÇALVES REBOLLAS", "3330", "", "BOCAININHA", "27350390", "(24)3328395"],
    ["Barra Mansa", "Grande", "CRAS PARAÍSO DE CIMA", "Rua", "IZALINO GOMES DA SILVA", "0", "", "PARAÍSO DE CIMA", "27400000", "(24)3350715"],
    ["Belford Roxo", "Grande", "CRAS  I  -  XAVANTE", "Rua", "Felipe Antonio Lopes Pinto.", "12", "casa", "Xavante", "26125063", "(21)2762182"],
    ["Belford Roxo", "Grande", "CRAS IV - LOTE XV", "Rua", "PADRE EGÍDIO CARMELINCK", "70", "casa", "LOTE XV", "26183385", "(21)3135693"],
    ["Belford Roxo", "Grande", "CRAS  VI - JARDIM BOM PASTOR", "Avenida", "DISTINÇÃO", "0", "LT03 QD05", "JARDIM BOM PASTOR", "26150000", "(21)3752201"],
    ["Belford Roxo", "Grande", "CRAS  X - ROSANE  CUNHA", "Rua", "José da Cunha", "205", "", "Areia Branca", "26135000", "(21)2662239"],
    ["Belford Roxo", "Grande", "CRAS  IX - JARDIM DO IPÊ", "Rua", "júlia abraão", "26", "", "jardim do Ipê", "26180100", "(21)3135291"],
    ["Belford Roxo", "Grande", "CRAS II SANTA MARTA", "Rua", "DR. ARMANDO REZENDE", "88", "", "SANTA MARTA", "26173110", "(21)2662020"],
    ["Belford Roxo", "Grande", "CRAS VIII - DORITHY MAE STONG", "Estrada", "LIGAÇÃO", "40", "", "PARQUE SUECIA", "26187180", "(21)3662999"],
    ["Belford Roxo", "Grande", "CRAS III - NOVA AURORA", "Avenida", "NOVA AURORA", "36", "", "NOVA  AURORA", "26155070", "(21)2661024"],
    ["Belford Roxo", "Grande", "CRAS XII  -  WONA", "Rua", "Cromita", "0", "Qd. 01 - Lote 30", "Jardim Piedade", "26183830", "(21)3661238"],
    ["Belford Roxo", "Grande", "CRAS XIII - BABI", "Avenida", "ATLÂNTICA", "850", "", "VILA MAIA", "26160630", "(21)2779701"],
    ["Belford Roxo", "Grande", "CRAS VII ZILDA ARNS NEUMANN", "Rua", "MAJOR ÊNIO CAVALCANTE CALDAS", "16", "", "SARGENTO RONCALLE", "26178400", "(21)2762300"],
    ["Belford Roxo", "Grande", "CRAS V - SHANGRILA", "Rua", "ITAIPU BABI", "36", "", "SHANGRILA", "26127140", "(21)2761612"],
    ["Bom Jardim", "Pequeno II", "CRAS SAO MIGUEL", "Rua", "JOAO JACINTO DE CARVALHO", "1068", "CASA", "SAO MIGUEL", "28660000", "(22)2566284"],
    ["Bom Jardim", "Pequeno II", "CRAS BANQUETE", "Estrada", "Rosário", "0", "S/N", "Banquete", "28660000", "(22)2565135"],
    ["Bom Jardim", "Pequeno II", "CRAS JARDIM ORNELLAS", "Avenida", "WALTER VENDA RODRIGUES", "100", "CASA", "CAMPO BELO", "28660000", "(22)2566249"],
    ["Bom Jesus do Itabapoana", "Pequeno II", "CRAS - Nova Bom Jesus", "Rua", "Projetada F", "0", "", "Nova Bom Jesus - Usina Santa Isabel", "28600000", "(22)3835165"],
    ["Bom Jesus do Itabapoana", "Pequeno II", "CRAS - SANTA TEREZINHA", "Avenida", "TENENTE JOSÉ TEIXEIRA", "1396", "", "SANTA TEREZINHA", "28360000", "(22)3831344"],
    ["Bom Jesus do Itabapoana", "Pequeno II", "CRAS - BELA VISTA", "Rua", "OTACÍLIO DE AQUINO", "220", "", "BELA VISTA", "28360000", "(22)3831607"],
    ["Cabo Frio", "Grande", "CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL TEREZA FRANCISCONE", "Estrada", "Estrada de Botafogo", "14", "", "BOTAFOGO", "28927990", "(22)2647375"],
    ["Cabo Frio", "Grande", "CRAS - JUZETE TRINDADE CORREA", "Rua", "CANADÁ", "156", "", "JARDIM NÁUTILUS", "28909190", "(22)2644269"],
    ["Cabo Frio", "Grande", "CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL JOÃO NASCIMENTO", "Rua", "SOROROCA", "8", "2º DISTRITO - TAMOIOS", "SAMBURÁ", "28927000", "(22)2630572"],
    ["Cabo Frio", "Grande", "CRAS DOMINGOS ANTÔNIO SIQUEIRA", "Rua", "Carlos Gomes", "11", "", "JACARÉ", "28910000", "(22)2643922"],
    ["Cabo Frio", "Grande", "CRAS - CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL VIRGÍNIO CORRÊA", "Rua", "Santo Antônio de Lisboa", "29", "", "Porto do Carro", "28900000", "(22)2644019"],
    ["Cabo Frio", "Grande", "CRAS - CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL PRAIA DO SIQUEIRA", "Rua", "Guanabara", "1", "", "Jardim Olinda II", "28908050", "(22)2645485"],
    ["Cabo Frio", "Grande", "CRAS CENTRAL GRAZIELLE AZEVEDO MARQUES", "Rua", "Nossa Senhora Aparecida", "325", "", "Parque Central", "28900000", "(22)2644606"],
    ["Cabo Frio", "Grande", "CRAS JARDIM ESPERANÇA", "Rua", "Paraná", "29", "", "Jardim Esperança", "28920232", "(22)2629450"],
    ["Cachoeiras de Macacu", "Médio", "CRAS - Papucaia", "Rua", "Henrique Laje", "113", "", "Papucaia", "28680000", "(21)2745057"],
    ["Cachoeiras de Macacu", "Médio", "CRAS - Cachoeiras", "Rua", "ANTÔNIO VALLADARES", "91", "", "BOA VISTA", "28680000", "(21)2649249"],
    ["Cachoeiras de Macacu", "Médio", "CRAS - Japuíba", "Praça", "Macedo Soares", "0", "", "Japuiba", "28680000", "(21)2745534"],
    ["Cambuci", "Pequeno I", "CRAS 1", "Parque", "de Exposições - Pavilhão 1", "1", "", "Guarani", "28430000", "(22)2767208"],
    ["Cambuci", "Pequeno I", "CRAS 2", "Rua", "Muniz de Medeiros", "91", "", "CENTRO SÃO JOÃO DO PARAÍSO", "28450000", "(22)3855139"],
    ["Campos Dos Goytacazes", "Grande", "CRAS URURAÍ", "Rua", "RUA JOSÉ PEREIRA", "51", "", "URURAÍ", "28000000", "(22)2728394"],
    ["Campos Dos Goytacazes", "Grande", "CRAS Codin", "Rua", "G", "15", "", "Codin", "28090630", "(22)2739595"],
    ["Campos Dos Goytacazes", "Grande", "CRAS TRAVESSÃO", "Rua", "ANTONIO LUIZ DA SILVEIRA", "482", "", "TRAVESSÃO DE CAMPOS", "28175000", "(22)2748511"],
    ["Campos Dos Goytacazes", "Grande", "CRAS Chatuba", "Rua", "Maçaranduba", "0", "Condomínio Oswaldo Gregório", "Chatuba", "28100000", "(22)2724631"],
    ["Campos Dos Goytacazes", "Grande", "CRAS Goitacazes", "Rodovia", "RAUL SOUTO MAIOR", "49", "", "Goitacazes", "28030045", "(22)2731918"],
    ["Campos Dos Goytacazes", "Grande", "CRAS JARDIM CARIOCA", "Travessa", "SANTO ELIAS", "0", "", "JARDIM CARIOCA", "28080385", "(22)2725361"],
    ["Campos Dos Goytacazes", "Grande", "CRAS Penha", "Rua", "Rossine Quintanilha Chagas", "0", "", "Penha", "28021001", "(22)2724812"],
    ["Campos Dos Goytacazes", "Grande", "CRAS CUSTODÓPOLIS", "Rua", "POETA  MARINHO", "7", "", "CUSTODOPOLIS", "28080090", "(22)2723349"],
    ["Campos Dos Goytacazes", "Grande", "CRAS JOCKEY", "Rua", "Professor Alvaro Barcelos", "0", "", "Jockey II", "28020307", "(22)9817505"],
    ["Campos Dos Goytacazes", "Grande", "CRAS MORRO DO CÔCO", "Rua", "Nilo Peçanha", "0", "", "Morro do Coco", "28178000", "(22)9771453"],
    ["Campos Dos Goytacazes", "Grande", "CRAS Parque Guarús", "Rua", "Rio Bonito", "5", "", "Parque Guarús", "28070645", "(22)2731754"],
    ["Campos Dos Goytacazes", "Grande", "CRAS MATADOURO", "Rua", "Adão Pereira Nunes", "0", "", "MATADOURO", "28015472", "(22)2731344"],
    ["Campos Dos Goytacazes", "Grande", "CRAS ESPLANADA", "Rua", "VALTER SALES", "0", "", "PQ ESPLANADA", "28000100", "(22)2732288"],
    ["Cantagalo", "Pequeno I", "CRAS NOVO HORIZONTE", "Rua", "RUA F", "0", "PRÉDIO", "NOVO HORIZONTE", "28500000", "(22)2555200"],
    ["Cantagalo", "Pequeno I", "CRAS SANTO ANTONIO", "Rua", "PROF: MANOEL VIEIRA BAPTISTA", "237", "PRÉDIO", "SANTO ANTONIO", "28500000", "(22)2555110"],
    ["Cantagalo", "Pequeno I", "CRAS Centro", "Travessa", "Luiz Carlos Falcão", "0", "", "Centro", "28500000", "(22)2555485"],
    ["Carapebus", "Pequeno I", "CRAS Sapecado", "Rua", "João Pedro Sobrinho", "182", "", "Sapecado", "27998000", "(22)2768368"],
    ["Carapebus", "Pequeno I", "CRAS UBÁS", "Rua", "RUA JOÃO AURÉLIO ORTIZ", "207", "", "UBÁS", "27998000", "(22)2768441"],
    ["Cardoso Moreira", "Pequeno I", "CRAS DE OUTEIRO", "Rua", "PRINCIPAL", "0", "USINA DE OUTEIRO", "OUTEIRO", "28180000", "(22)2735815"],
    ["Cardoso Moreira", "Pequeno I", "CRAS DE CARDOSO MOREIRA", "Rua", "SEBASTIÃO ZAQUEU", "0", "", "centro", "28180000", "(22)2785204"],
    ["Carmo", "Pequeno I", "CRAS INFLUÊNCIA", "Rua", "Jose Ferreira Alves", "247", "", "INFLUÊNCIA", "28640000", "(22)2537423"],
    ["Carmo", "Pequeno I", "CRAS CENTRAL", "Rua", "SENADOR DANTAS", "578", "", "CENTRO", "28640000", "(22)2537141"],
    ["Casimiro de Abreu", "Pequeno II", "CRAS  - BARRA DE SÃO JOÃO", "Rua", "Corvina", "705", "Peixe Dourado II", "BARRA DE SÃO JOÃO", "28880000", "(22)2774565"],
    ["Casimiro de Abreu", "Pequeno II", "CRAS Casimiro de Abreu", "Rua", "PASTOR LUIZ LAURENTINO DA SILVA", "385", "", "MATARUNA", "28860000", "(22)2778514"],
    ["Casimiro de Abreu", "Pequeno II", "CRAS Professor Souza", "Rua", "João Soares", "468", "", "PROFESSOR SOUZA", "28860000", "(22)2778308"],
    ["Comendador Levy Gasparian", "Pequeno I", "CRAS - Afonso Arinos", "Rua", "Jaime Matos", "184", "", "Afonso Arinos", "25875000", "(24)2254162"],
    ["Comendador Levy Gasparian", "Pequeno I", "CRAS - Fonseca Almeida", "Avenida", "Fonseca Almeida", "26", "", "Fonseca Almeida", "25870000", "(24)2254134"],
    ["Conceição de Macabu", "Pequeno II", "CRAS USINA", "Vila", "LEOLINDA", "54", "", "USINA", "28740000", "(22)2779309"],
    ["Conceição de Macabu", "Pequeno II", "CRAS MACABUZINHO/CENTRAL", "Rua", "Maria Adelaide", "191", "Sede", "Vila Nova", "28740000", "(22)2779259"],
    ["Conceição de Macabu", "Pequeno II", "CRAS RHODIA", "Rua", "MARIA JULIA GOMES DE LEMOS", "41", "CASA", "RHODIA", "28740000", "(22)2779305"],
    ["Cordeiro", "Pequeno II", "CRAS CENTRO", "Rua", "Van Erven", "23", "", "Centro", "28540000", "(22)2551101"],
    ["Cordeiro", "Pequeno II", "CRAS MANANCIAL", "Rua", "Romualdo Pereira Lopes", "0", "", "Manancial", "28540000", "(22)2551318"],
    ["Cordeiro", "Pequeno II", "CRAS RODOLFO GONÇALVES", "Rua", "RUA MAESTRO JOÃO MACEDO", "76", "", "Retiro Poético", "28540000", "(22)2551387"],
    ["Duas Barras", "Pequeno I", "CRAS DUAS BARRAS", "Rua", "monnerat", "0", "", "CENTRO", "28650000", "(22)2534121"],
    ["Duas Barras", "Pequeno I", "CRAS / MONNERAT", "Rua", "Antonio Pereira da Silva", "0", "", "CENTRO", "28655000", "(22)2534507"],
    ["Duque de Caxias", "Grande", "CRAS Pilar", "Avenida", "President Kennedy", "0", "lote 10, quadra 43", "Pilar", "25071128", "(21)2672665"],
    ["Duque de Caxias", "Grande", "CRAS VILA MARIA HELENA", "Rua", "Antenor Resende", "100", "", "Vila Maria Helena", "25251750", "(21)2672556"],
    ["Duque de Caxias", "Grande", "IMBARIÊ", "Rua", "FELICIANO SODRE", "0", "", "IMBARIÊ", "25266260", "(21)2787014"],
    ["Duque de Caxias", "Grande", "CRAS LAGUNA E DOURADOS", "Rua", "MAJOR THOMAZ GONÇALVES", "0", "0", "LAGUNA E DOURADOS", "25011230", "(21)2671566"],
    ["Duque de Caxias", "Grande", "CRAS XERÉM", "Avenida", "NÓBREGA RIBEIRO", "15", "", "Ns Sra. das Graças - Xerém", "25500000", "(21)2679169"],
    ["Duque de Caxias", "Grande", "CRAS CENTENARIO", "Rua", "FRANCISCA TOME", "842", "", "Centenario", "25030150", "(21)3774278"],
    ["Duque de Caxias", "Grande", "BEIRA MAR", "Rua", "FRANCISCO ALVES", "0", "0", "PARQUE BEIRA MAR", "25000000", "(21)2671159"],
    ["Duque de Caxias", "Grande", "CRAS JARDIM GRAMACHO", "Avenida", "PISTÓIA", "0", "0", "JARDIM GRAMACHO", "25055120", "(21)2672667"],
    ["Duque de Caxias", "Grande", "CRAS de Parada Morabi", "Avenida", "Anhangá", "0", "0", "Parada Morabi", "25265000", "(21)2672665"],
    ["Duque de Caxias", "Grande", "CRAS FIGUEIRA", "Rodovia", "Washington Luis", "0", "", "FIGUEIRA", "25000000", "(21)3654040"],
    ["Duque de Caxias", "Grande", "CRAS JARDIM PRIMAVERA", "Rua", "VICENTE CELESTINO", "615", "0", "JARDIM PRIMAVERA", "25220020", "(21)2672665"],
    ["Engenheiro Paulo de Frontin", "Pequeno I", "CRAS 2", "Rua", "Joquim Mendes", "349", "", "Morro Azul", "26650000", "(24)2468221"],
    ["Engenheiro Paulo de Frontin", "Pequeno I", "CRAS 1", "Avenida", "Antônio Mauricio, S/N", "0", "", "Centro", "26650000", "(24)2463392"],
    ["Guapimirim", "Médio", "CRAS II", "Rua", "José Maria da Silva", "1443", "casa", "Vale das Pedrinhas", "25940690", "(21)2747944"],
    ["Guapimirim", "Médio", "CRAS III", "Rua", "Praianos", "845", "casa", "Jardim Guapimirim", "25940000", "(21)2632287"],
    ["Guapimirim", "Médio", "CRAS I", "Avenida", "Dedo de Deus", "342", "casa", "Centro", "25940000", "(21)2632208"],
    ["Iguaba Grande", "Pequeno II", "CRAS Apolo Belisário de Sousa", "Estrada", "Estrada do Arrastão s/nº", "0", "", "Vila Nova", "28960000", "(22)2624220"],
    ["Iguaba Grande", "Pequeno II", "CRAS ADILSON LESSA", "Estrada", "ESTRADA DA CAPIVARA", "846", "", "CIDADE NOVA", "28960000", "(22)2624397"],
    ["Itaboraí", "Grande", "CRAS - AMPLIAÇÃO", "Rua", "Miguel Ângelo Gimenez", "0", "Lote 01 - Quadra - 63", "AMPLIAÇÃO", "24808332", "(21)2635665"],
    ["Itaboraí", "Grande", "CRAS - RETA", "Rua", "Pedro Ferreira Pinto", "0", "LT 10 QD 06", "VILA PROGRESSO", "24802365", "(21)3637043"],
    ["Itaboraí", "Grande", "CRAS - ITAMBI", "Rua", "JOÃO MOREIRA", "276", "", "ITAMBI", "24800000", "(21)2736558"],
    ["Itaboraí", "Grande", "CRAS - VISCONDE", "Rua", "DRAUZIO LEMOS", "835", "", "VISCONDE DE ITABORAI", "24875120", "(21)3639685"],
    ["Itaboraí", "Grande", "CRAS - APOLO", "Rua", "ANTONIETA RODRIGUES VIANA", "0", "LT 19 QD 05", "APOLLO II", "24858564", "(21)3639539"],
    ["Itaboraí", "Grande", "CRAS - JARDIM IMPERIAL", "Rua", "EURYDICE NASCIMENTO PINHO", "0", "L 684 Q 29", "JARDIM IMPERIAL", "24800345", "(21)3637759"],
    ["Itaguaí", "Grande", "CRAS Mazomba", "Estrada", "do Mazomba", "3623", "", "Mazombinha", "23830250", "(21)3782510"],
    ["Itaguaí", "Grande", "CRAS Engenho", "Rua", "Ari Parreiras", "1560", "Lote 2/Quadra 134", "Engenho", "23820000", "(21)3782533"],
    ["Itaguaí", "Grande", "CRAS Brisamar", "Rua", "Soldado Luiz Mendonça Santos", "44", "", "Brisamar", "23825615", "(21)2687341"],
    ["Itaguaí", "Grande", "CRAS Califórnia", "Rua", "Joaquim Nabuco", "21", "Quadra 112", "Califórnia", "23811550", "(21)2688170"],
    ["Itaguaí", "Grande", "CRAS Centro", "Rua", "Thieres Teixeira Leite", "231", "Área 01/Qd 69", "Jardim Laiá", "23822730", "(21)2687421"],
    ["Itaguaí", "Grande", "CRAS Chaperó", "Estrada", "de Chaperó", "0", "Gleba A", "Chaperó", "23812260", "(21)2687735"],
    ["Italva", "Pequeno I", "CENTRO DE REFERENCIA DE ASSISTÊNCIA SOCIAL", "Rua", "JOSE LUIZ MARINHO", "13", "", "CENTRO", "28250000", "(22)2783222"],
    ["Italva", "Pequeno I", "CENTRO DE REFERENCIA DE ASSISTÊNCIA SOCIAL", "Rua", "AV. CORONEL LUIS SALLES", "92", "", "CENTRO", "28250000", "(22)2783174"],
    ["Itaocara", "Pequeno II", "CRAS BELA VISTA", "Rua", "PAULO CEZAR ERTHAL", "187", "", "CENTRO", "28570000", "(22)3861255"],
    ["Itaocara", "Pequeno II", "CRAS LARANJAIS", "Rua", "PERICLES CORREIA DA ROCHA", "1", "", "NITEROI", "28580000", "(22)3862128"],
    ["Itaocara", "Pequeno II", "CRAS - ITAOCARA", "Rua", "ALDERICO VIANA  DE BARROS", "155", "SOBRADO", "FLORESTAL", "28570000", "(22)3861261"],
    ["Itaperuna", "Médio", "CRAS BAIRRO NITERÓI", "Avenida", "SANTO ANTONIO", "157", "", "NITERÓI", "28300000", "(22)3824323"],
    ["Itaperuna", "Médio", "CRAS AEROPORTO", "Rua", "RUA PAULO DE OLIVEIRA", "685", "PROX. AO MERCADO TABAJARA", "AEROPORTO", "28300000", "(22)3823725"],
    ["Itaperuna", "Médio", "CRAS CASTELO / HORTO FLORESTAL", "Rua", "SÃO VICENTE DE PAULA", "92", "", "CASTELO", "28300000", "(22)3822605"],
    ["Itaperuna", "Médio", "CRAS VINHOSA / SÃO MATHEUS / GUARITÁ", "Rua", "BENEDITO NICOLAU", "45", "", "VINHOSA", "28300000", "(22)3824640"],
    ["Itaperuna", "Médio", "CRAS CIDADE NOVA / JARDIM SURUBI", "Avenida", "PORTO ALEGRE", "1000", "", "CIDADE NOVA/JARDIM SURUBI", "28300000", "(22)3823647"],
    ["Itatiaia", "Pequeno II", "CRAS PENEDO", "Rua", "do médico", "30", "", "Penedo", "27580000", "(24)3352504"],
    ["Itatiaia", "Pequeno II", "CRAS Maromba", "Rua", "do Pingo de Mel", "161", "", "Estrada Maringá - Maromba", "27580000", "(24)3387168"],
    ["Itatiaia", "Pequeno II", "CRAS Centro", "Rua", "SÃO JOSÉ", "126", "CASA", "CENTRO", "27580000", "(24)3352149"],
    ["Japeri", "Médio", "CRAS - Centro", "Avenida", "São João Evangelista", "1", "", "Engenheiro Pedreira", "26445970", "(21)3691006"],
    ["Japeri", "Médio", "CRAS - Alecrim", "Rua", "Roberto Bandeira", "16", "", "Alecrim", "26382290", "(21)2664642"],
    ["Japeri", "Médio", "CRAS Santa Amélia", "Estrada", "Da Saudade", "3", "Quadra 2", "Jardim Emilia", "26460400", "(21)3691909"],
    ["Japeri", "Médio", "CRAS - Guandu", "Avenida", "do Canal", "3", "lote 3 Quadra 3", "GUANDU", "26410050", "(21)2664450"],
    ["Japeri", "Médio", "CRAS - Mucajá", "Avenida", "Tancredo Neves", "10", "LT10 Q11", "Mucajá", "26372390", "(21)2664867"],
    ["Japeri", "Médio", "CRAS CANCELA", "Rua", "LENI FERREIRA", "366", "", "CENTRO", "26435210", "(21)2670369"],
    ["Japeri", "Médio", "CRAS Japeri", "Rua", "Augusto Batista de Carvalho", "72", "", "Nova Belém", "26433340", "(21)2670177"],
    ["Laje do Muriaé", "Pequeno I", "CRAS CENTRO", "Rua", "Ferreira César", "282", "CASA", "Centro", "28350000", "(22)3829132"],
    ["Laje do Muriaé", "Pequeno I", "CRAS QUERÓ", "Rua", "Garcia Pereira", "181", "CASA", "Centro", "28350000", "(22)3829132"],
    ["Macaé", "Grande", "CRAS Nova Esperança", "Rua", "Sergipe, lote 09  S/Nº", "0", "", "Nova Esperança", "27910000", "(22)2759886"],
    ["Macaé", "Grande", "CRAS Parque Aeroporto Paulo Roberto Pereira", "Estrada", "Do Caminho s/nº", "0", "", "Ajuda de Baixo", "27971973", "(22)2793037"],
    ["Macaé", "Grande", "CRAS Serra", "Avenida", "Miguel Peixoto Guimarães", "703", "", "Córrego do Ouro", "27985000", "(22)2762780"],
    ["Macaé", "Grande", "CRAS Novo Visconde Alba Corral", "Rua", "Manoel Batista de Carvalho", "0", "", "Novo Visconde", "27940520", "(22)2762511"],
    ["Macaé", "Grande", "CRAS  Aroeira", "Rua", "Luiz Alves de Lima e Silva s/nº", "0", "", "Jardim Santo Antônio", "27910300", "(22)2796111"],
    ["Macaé", "Grande", "CRAS Botafogo", "Rua", "Antônio Bichara Filho S/nº", "0", "", "Novo Botafogo", "27946130", "(22)2759085"],
    ["Macaé", "Grande", "CRAS Barra", "Rua", "Eurico Barbosa de Souza", "0", "", "Barra", "27961040", "(22)2763702"],
    ["Macuco", "Pequeno I", "CRAS MACUCO", "Rua", "DR MARIO FREIRE MARTINS", "194", "MULTIPLO-USO SALA 02", "CENTRO", "28545000", "(22)2554910"],
    ["Macuco", "Pequeno I", "PROGRAMA DE ATENDIMENTO INTEGRAL A FAMILIA", "Rua", "ANGELO BIANCHINI", "0", "", "NOVA MACUCO", "28540000", "(22)2554187"],
    ["Magé", "Grande", "CRAS MAGE II", "Rua", "CASSIMIRO DE ABREU", "230", "", "RIO DO OURO", "25920000", "(21)3632178"],
    ["Magé", "Grande", "CRAS MAGÉ I", "Travessa", "AIRTON INÁCIO DA SILVEIRA", "0", "s/nº", "VILA NOVA", "25900000", "(21)2633336"],
    ["Magé", "Grande", "CRAS SURUÍ I", "Rua", "JOSÉ ZARZUR", "142", "", "SURUÍ", "25925000", "(21)3632206"],
    ["Magé", "Grande", "CRAS VILA INHOMIRIM II", "Rua", "Francisca Gomes dos Santos", "60", "", "Fragoso", "25935000", "(21)2739635"],
    ["Magé", "Grande", "CRAS VILA INHOMIRIM III", "Rua", "SANTA CECÍLIA", "90", "", "PARQUE CAÇULA", "25936710", "(21)9995673"],
    ["Magé", "Grande", "CRAS SANTO ALEIXO I", "Rua", "OTHON LINCH B DE MELLO", "0", "", "SANTO ALEIXO", "25912206", "(21)3632100"],
    ["Magé", "Grande", "CRAS VILA INHOMIRIM I", "Avenida", "CAIOABA", "0", "s/nº", "PIABETÁ", "25915000", "(21)2650966"],
    ["Magé", "Grande", "CRAS GUIA DE PACOBAÍBA I", "Rua", "59", "0", "MAUÁ", "JARDIM DA PAZ", "25930000", "(21)2631861"],
    ["Mangaratiba", "Pequeno II", "CRAS Ismael Orestino da Silva", "Rua", "JOSE ALVES DEE SOUZA E SILVA", "80", "LT 80", "CENTRO", "23860000", "(21)2789601"],
    ["Mangaratiba", "Pequeno II", "CRAS PRAIA DO SACO", "Avenida", "FREI AFONSO JORGE BRAGA", "0", "QD 4  LT20", "PRAIA DO SACO", "23860000", "(21)3789309"],
    ["Mangaratiba", "Pequeno II", "CRAS SERRA DO PILOTO", "Estrada", "SÃO JOÃO MARCOS", "0", "S/N", "SERRA DO PILOTO", "23860000", "(21)3789368"],
    ["Mangaratiba", "Pequeno II", "CRAS Antonio Canella da Costa", "Rua", "JOAO BONDIM", "0", "MORRO SÃO SEBASTIÃO", "MURIQUI", "23860000", "(21)2780430"],
    ["Mangaratiba", "Pequeno II", "CRAS Alziro Gibram Simões", "Rua", "Ceci", "143", "", "ITACURUCA", "23860000", "(21)2680724"],
    ["Mangaratiba", "Pequeno II", "CRAS CONCEICAO DE JACAREI", "Rua", "Jose Batista Maia", "25", "", "CONCEICAO DE JACAREI", "23860000", "(21)3789301"],
    ["Maricá", "Grande", "CRAS  SANTA PAULA", "Rua", "05 LOTE 01 A2 QUADRA 19", "0", "S/N", "INOÃ", "24900000", "(21)2637364"],
    ["Maricá", "Grande", "CRAS JARDIM ATLÂNTICO", "Rua", "DARCY ROQUE DA SILVEIRA QUADRA 485 LOTE 06", "0", "", "JARDIM ATLÂNTICO", "24900000", "(21)2634082"],
    ["Maricá", "Grande", "CRAS REGIÃO OCEÂNICA", "Avenida", "MAÍSA MONJARDIM Quadra 195 Lote05", "0", "", "PONTA NEGRA", "24900000", "(21)2637364"],
    ["Maricá", "Grande", "CRAS CENTRO", "Rua", "DOMICIO DA GAMA", "0", "LT.18-QD.03", "CENTRO", "24900000", "(21)3731035"],
    ["Maricá", "Grande", "CRAS CEU", "Rodovia", "AMARAL PEIXOTO KM 27", "0", "", "MUMBUCA", "24912760", "(21)2634082"],
    ["Maricá", "Grande", "CRAS ITAIPUAÇU", "Rua", "PROFESSOR CARDOSO DE MENEZES QUADRA 01 LOTE 37", "0", "", "ITAIPUAÇU", "24900000", "(21)2638652"],
    ["Maricá", "Grande", "CRAS INOÃ", "Rua", "05 Lote  01 Barra Quadra 19", "0", "", "Inoã", "24940550", "(21)2636653"],
    ["Maricá", "Grande", "CRAS SÃO JOSÉ", "Rua", "IBIAPINA LOTES 21 E 22 QUADRA 44", "0", "", "São José do Imbassaí", "24900000", "(21)2636850"],
    ["Mendes", "Pequeno I", "CRAS 4", "Rua", "Pinto da Fonseca", "1", "", "Humberto Antunes", "26700000", "(24)2465682"],
    ["Mendes", "Pequeno I", "CRAS 1", "Rua", "Estela Rudge, S/N", "0", "", "Oscar Rudge", "26700000", "(24)2465227"],
    ["Mendes", "Pequeno I", "CRAS 2", "Rua", "PREFEITO RUBENS JOSE DE MACEDO, S/N", "0", "", "MARTINS COSTA", "26700000", "(24)2465612"],
    ["Mesquita", "Grande", "CRAS SANTA TEREZINHA", "Rua", "Hélio Mendes do Amaral /Sete Anões", "220", "", "SANTA TEREZINHA", "26554420", "(21)2797032"],
    ["Mesquita", "Grande", "CRAS ROCHA SOBRINHO", "Avenida", "Coelho da Rocha", "1426", "", "Rocha Sobrinho", "26572481", "(21)3763976"],
    ["Mesquita", "Grande", "CRAS CHATUBA", "Rua", "Magno de Carvalho", "1302", "FUNDOS", "Chatuba", "26587021", "(21)3763600"],
    ["Mesquita", "Grande", "CRAS JUSCELINO", "Avenida", "São Paulo", "465", "", "Juscelino", "26580140", "(21)3763751"],
    ["Mesquita", "Grande", "CRAS BANCO DE AREIA", "Rua", "Bicuíba", "48", "", "Banco de Areia", "26570090", "(21)2697770"],
    ["Miguel Pereira", "Pequeno II", "CRAS PAIF I", "Rua", "Dr. Osório de Almeida", "550", "casa", "GOVERNADOR PORTELA", "26910000", "(24)2483831"],
    ["Miguel Pereira", "Pequeno II", "CRAS PAIF II", "Travessa", "PANTREZINA", "199", "casa", "PRACA DA PONTE", "26900000", "(24)2483047"],
    ["Miracema", "Pequeno II", "CRAS II Professora Ana Lúcia de Oliveira", "Rua", "BERNARDINO CARDOSO DIAS", "0", "", "Vila Nova", "28460000", "(22)3852742"],
    ["Miracema", "Pequeno II", "CRAS I Demétrio Damasceno", "Avenida", "CARVALHO", "1228", "", "JARDIM BEVERLY", "28460000", "(22)3852099"],
    ["Natividade", "Pequeno I", "CRAS - CANTINHO DO FIORELLO", "Rua", "Dr. ANTONIO CAMPOS CAVALCANTE", "0", "PREDIO", "CANTINHO DO FIORELLO", "28380000", "(22)3841221"],
    ["Natividade", "Pequeno I", "CRAS - QUERENDO", "Rua", "RUA:  EDUARDO LACERDA DA SILVA", "0", "Casa", "DISTRITO BOM JESUS DO QUERENDO", "28380000", "(22)3844508"],
    ["Nilópolis", "Grande", "CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL - CRAS FRANÇA LEITE", "Rua", "Antônio Félix", "721", "", "CENTRO", "26520081", "(21)2791197"],
    ["Nilópolis", "Grande", "CRAS CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL - CRAS NOVA CIDADE", "Rua", "GONÇALVES DIAS S/Nº", "0", "N° PARA LOCALIZAÇÃO NO GEORREFERENCIAMENTO", "NOVA CIDADE", "26530180", "(21)3762831"],
    ["Nilópolis", "Grande", "CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL - CRAS PAIOL", "Rua", "CARLOS DE SOUZA FERNANDES", "0", "LOTE 215 QUADRA D", "PAIOL DE PÓLVORA", "26545015", "(21)3762831"],
    ["Nilópolis", "Grande", "CRAS NOVO HORIZONTE", "Rua", "JOÃO DA MATA PEIXOTO", "596", "", "NOVO HORIZONTE", "26535340", "(21)2691177"],
    ["Nilópolis", "Grande", "CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL - CRAS SOFIA", "Rua", "SOFIA", "111", "", "NOSSA SENHORA DE FÁTIMA", "26525510", "(21)3762831"],
    ["Nilópolis", "Grande", "CRAS CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL - CRAS CABRAL", "Rua", "ROLDÃO GONÇALVES, S/Nº", "0", "N° PARA LOCALIZAÇÃO NO GEORREFERENCIAMENTO", "CABRAL", "26515041", "(21)2792895"],
    ["Niterói", "Grande", "CRAS Preventório", "Rua", "Santa Candida", "10", "", "Charitas", "24370105", "(21)0000000"],
    ["Niterói", "Grande", "CRAS Jurujuba", "Avenida", "Carlos Ermelindo Marins", "34", "", "JURUJUBA", "24370292", "(21)3602459"],
    ["Niterói", "Grande", "CRAS Badu", "Estrada", "Estrada Caetano Monteiro", "820", "", "Badu", "24320570", "(21)0000000"],
    ["Niterói", "Grande", "CRAS Centro", "Rua", "Evaristo da Veiga", "0", "0", "Centro", "24020280", "(21)2613662"],
    ["Niterói", "Grande", "CRAS Santa Bárbara - Manuel Augusto Vicente", "Avenida", "Desembargador Nestor Rodrigues Perlingeiro", "860", "", "Santa Barbara", "24141330", "(21)2717202"],
    ["Niterói", "Grande", "CRAS Vila Ipiranga", "Rua", "Tenente Osório, S/N", "0", "", "Vila Ipiranga", "24130209", "(21)2625343"],
    ["Niterói", "Grande", "CRAS BARRETO", "Rua", "Dr. Luis Palmier, S/Nº", "0", "", "Barreto", "24110000", "(21)2628161"],
    ["Niterói", "Grande", "CRAS Cafubá", "Rua", "Deputado José Luiz Erthal", "320", "", "Cafubá", "24333028", "(21)2619398"],
    ["Niterói", "Grande", "CRAS Morro do Céu", "Rua", "da Horta", "0", "", "Caramujo", "24141000", "(21)2717404"],
    ["Niterói", "Grande", "CRAS Cubango", "Rua", "Desembargador Lima Castro", "241", "", "Fonseca", "24120350", "(21)2625411"],
    ["Nova Friburgo", "Grande", "CRAS CENTRO", "Rua", "MAC NIVEN", "4", "", "Centro", "28610190", "(22)2528727"],
    ["Nova Friburgo", "Grande", "Campo do Coelho", "Rua", "Antônio Mario de Azevedo", "13256", "", "Campo do Coelho", "28630590", "(22)2543141"],
    ["Nova Friburgo", "Grande", "Cras Olaria", "Rua", "JULIO ANTONIO THURLER", "430", "", "OLARIA", "28620000", "(22)2533241"],
    ["Nova Friburgo", "Grande", "CRAS Conselheiro Paulino", "Rua", "Antenor Fernandes", "8", "", "centro conselheiro paulino", "28600000", "(22)2533124"],
    ["Nova Iguaçu", "Grande", "CRAS VILA DE CAVA", "Rua", "VICTOR HUGO", "0", "S/N", "VILA DE CAVA", "26000000", "(21)2667921"],
    ["Nova Iguaçu", "Grande", "CRAS CERÂMICA", "Rua", "DONA GISELE URIN", "25", "", "CERAMICA", "26031810", "(21)2669144"],
    ["Nova Iguaçu", "Grande", "CRAS NOVA ERA", "Rua", "INOCENCIO FERREIRA", "42", "", "JARDIM NOVA ERA", "26272160", "(21)3794836"],
    ["Nova Iguaçu", "Grande", "CRAS COMENDADOR SOARES", "Rua", "RECIFE", "530", "", "JARDIM PERNAMBUCO", "26251210", "(21)2695452"],
    ["Nova Iguaçu", "Grande", "CRAS DOM BOSCO", "Rua", "GELO", "0", "CONJUNTO DOM BOSCO", "MARAPICU", "26298027", "(21)2695452"],
    ["Nova Iguaçu", "Grande", "CRAS AUSTIN", "Rua", ": Santo Inácio", "50", "", "AUSTIN", "26087180", "(21)2763122"],
    ["Nova Iguaçu", "Grande", "CRAS VALVERDE", "Rua", "abilio augusto tavora", "0", "", "Valverde", "26000000", "(21)2695055"],
    ["Nova Iguaçu", "Grande", "CRAS JARDIM PARAÍSO", "Rua", "DAS MARGARIDAS", "0", "", "Jardim Paraíso", "26000000", "(21)3778010"],
    ["Nova Iguaçu", "Grande", "CRAS MIGUEL COUTO", "Estrada", "SANTA BÁRBARA", "2083", "", "GRAMA", "26000000", "(21)2768189"],
    ["Nova Iguaçu", "Grande", "CRAS CENTRO", "Rua", "Terezinha Pinto", "297", "", "CENTRO", "26215210", "(21)2669144"],
    ["Paracambi", "Pequeno II", "CRAS IV - SABUGO", "Rua", "Feliciano dos Anjos Teixeira", "830", "casa 2", "Sabugo", "26600000", "(21)2683362"],
    ["Paracambi", "Pequeno II", "CRAS I - LAGES - PRAÇA DO MIRO", "Rua", "Bezerra de Menezes", "611", "", "Lages", "26600000", "(21)3693622"],
    ["Paracambi", "Pequeno II", "CRAS II - PARACAMBI - CENTRO", "Rua", "Dr Soares Filho", "115", "Fundos", "Centro", "26600000", "(21)3693295"],
    ["Paracambi", "Pequeno II", "CRAS III - GUARAJUBA", "Rua", "São João", "50", "", "Guarajuba", "26600000", "(21)3693288"],
    ["Paracambi", "Pequeno II", "CRAS V - JARDIM NOVA ERA", "Rua", "dos Lírios", "285", "", "Jardim Nova Era", "26600000", "(21)3693126"],
    ["Paraíba do Sul", "Pequeno II", "CRAS - CENTRO", "Avenida", "Marechal Castelo Branco", "940", "", "Centro", "25850000", "(24)2263114"],
    ["Paraíba do Sul", "Pequeno II", "CRAS - VILA SALUTARIS", "Rua", "Heinz G Weill", "36", "Fundos", "VILA SALUTARIS", "25850000", "(24)2263386"],
    ["Paraty", "Pequeno II", "CRAS RURAL", "Avenida", "Roberto da Silveira/A", "2203", "C", "Vila Colonial", "23970000", "(24)3371861"],
    ["Paraty", "Pequeno II", "CRAS CENTRAL - 33038006703", "Avenida", "Av. Roberto da Silveira", "2302", "BR 101", "Vila Colonial", "23970000", "(24)3371861"],
    ["Paty do Alferes", "Pequeno II", "CRAS Avelar", "Rua", "Dr. Manoel Vieira Muniz", "11", "", "Avelar", "26980000", "(24)2487118"],
    ["Paty do Alferes", "Pequeno II", "CRAS CENTRO", "Rua", "DO RECANTO", "46", "", "CENTRO", "26950000", "(24)2485272"],
    ["Petrópolis", "Grande", "CRAS POSSE", "Estrada", "União e Indústria", "32965", "Praça corta Rio", "Posse", "25770470", "(24)2259136"],
    ["Petrópolis", "Grande", "CRAS VALE DO CARANGOLA", "Rua", "Waldemar Vieira Afonso", "19", "", "Vale do Carangola", "25715402", "(24)2246633"],
    ["Petrópolis", "Grande", "CRAS RETIRO", "Rua", "Henrique Dias", "221", "", "Retiro", "25680276", "(24)2246456"],
    ["Petrópolis", "Grande", "CRAS QUITANDINHA", "Rua", "ALAGOAS", "0", "", "QUITANDINHA", "25650170", "(24)2246915"],
    ["Petrópolis", "Grande", "CRAS Madame Machado", "Rua", "Geraldo Lourenço Dias", "0", "", "Madame Machado", "25745702", "(24)2249428"],
    ["Petrópolis", "Grande", "CRAS Corrêas", "Rua", "Vigário Corrêa", "443", "", "Corrêas", "25720322", "(24)2221004"],
    ["Petrópolis", "Grande", "CRAS CENTRO", "Rua", "VINTE E QUATRO DE MAIO", "0", "", "CENTRO", "25640550", "(24)2245827"],
    ["Petrópolis", "Grande", "CRAS ITAIPAVA", "Estrada", "União e Indústria", "11860", "Sala 8", "Itaipava", "25730745", "(24)2246874"],
    ["Pinheiral", "Pequeno II", "CRAS II", "Rua", "Manoel Torres", "357", "Casa", "Cruzeiro II", "27197000", "(24)3356406"],
    ["Pinheiral", "Pequeno II", "CRAS I", "Rua", "Manaus", "77", "", "Parque Mayra", "27197000", "(24)3356568"],
    ["Piraí", "Pequeno II", "CRAS ARROZAL", "Praça", "Theodora Barbosa Ribeiro", "61", "CENTRO", "ARROZAL", "27185000", "(24)3333120"],
    ["Piraí", "Pequeno II", "CRAS PIRAÍ", "Rua", "Manoel Teixeira Campos Junior", "88", "", "Centro", "27175000", "(24)2431250"],
    ["Porciúncula", "Pequeno I", "CRAS SANTA CLARA", "Rua", "EUFIZINIO G PUDDO", "1", "", "CENTRO", "28398000", "(22)3844111"],
    ["Porciúncula", "Pequeno I", "CRAS / Purilândia", "Rua", "Mauro Alves Ribeiro", "1", "2º Distrito", "Centro", "28396000", "(22)3844213"],
    ["Porciúncula", "Pequeno I", "CRAS/Porciúncula", "Rua", "Pedro Lopes de Oliveira", "637", "", "Vale do Sol", "28390000", "(22)3842121"],
    ["Porto Real", "Pequeno I", "CRAS NOVO HORIZONTE", "Rua", "Um", "0", "", "Novo Horizonte", "27570000", "(24)0000000"],
    ["Porto Real", "Pequeno I", "CRAS FÁTIMA", "Rua", "FLORIANO X PORTO REAL", "109", "", "BAIRRO N. S. DE FÁTIMA", "27570000", "(24)3353177"],
    ["Quatis", "Pequeno I", "CRAS CENTRO", "Avenida", "EUCLIDES ALVES GUIMARÃES COTIA", "78", "", "CENTRO", "27430140", "(24)3353305"],
    ["Quatis", "Pequeno I", "CRAS DONA JULIA ESPERANÇA", "Rua", "CAPITÃO APRIGIO BARBOSA LIMA", "176", "", "JARDIM INDEPENDÊNCIA", "27430010", "(24)3353227"],
    ["Queimados", "Grande", "CRAS IV - SÃO JORGE", "Rua", "Henrique", "7", "", "São Jorge", "26300000", "(21)3698067"],
    ["Queimados", "Grande", "CRAS VI - JARDIM DA FONTE", "Rua", "THOMAS PEREIRA DA SILVA", "6", "", "JARDIM DA FONTE", "26390000", "(21)3698834"],
    ["Queimados", "Grande", "CRAS II - PARQUE SANTIAGO", "Rua", "Estrada do Riachão", "2", "", "Santiago", "26330150", "(21)3699329"],
    ["Queimados", "Grande", "CRAS VII - NOVA CIDADE", "Rua", "MARIA CARLOS", "18", "", "NOVA CIDADE", "26380280", "(21)2779922"],
    ["Queimados", "Grande", "CRAS VIII - GLORIA", "Rua", "São Nicolau", "153", "", "Nossa Senhora da Glória", "26300000", "(21)3778785"],
    ["Queimados", "Grande", "CRAS III - INCONFIDENCIA", "Avenida", "TIRADENTES", "258", "LT 08 QD 12", "INCONFIDENCIA", "26320000", "(21)3778802"],
    ["Queimados", "Grande", "CRAS Vandir Dutra (CRAS V)", "Rua", "Macaé", "430", "", "São Roque", "26310040", "(21)3764944"],
    ["Queimados", "Grande", "CRAS I - NOVO ELDORADO", "Rua", "TEREZINHA SIMÃO", "7", "LT 10 QD 15", "NOVO ELDORADO", "26390380", "(21)2665832"],
    ["Quissamã", "Pequeno II", "CRAS I - SITIO QUISSAMÃ", "Rua", "GESSY BARCELOS", "0", "", "SITIO QUISSAMA", "28735000", "(22)2768659"],
    ["Quissamã", "Pequeno II", "BARRA DO FURADO", "Rua", "RUA VICENTE RIBEIRO DA SILVA", "0", "", "BARRA DO FURADO", "28735000", "(22)2768254"],
    ["Resende", "Grande", "CRAS JARDIM ESPERANÇA", "Rua", "FREI TITO", "27", "", "JARDIM ESPERANÇA", "27540660", "(24)3354467"],
    ["Resende", "Grande", "CRAS ITINERANTE", "Rua", "Simão da Cunha", "5", "", "Centro", "27501970", "(24)3360951"],
    ["Resende", "Grande", "Lavapés", "Rua", "Celestino de Paula", "29", "casa", "Lavapés", "27511040", "(24)3360988"],
    ["Resende", "Grande", "CRAS PARAÍSO", "Avenida", "Abílio Godoy", "127", "", "Paraíso", "27500000", "(24)3381207"],
    ["Resende", "Grande", "ITAPUCA", "Rua", "WILLY FAULSTICH", "64", "", "ELITE", "27522214", "(24)3381617"],
    ["Resende", "Grande", "CRAS Toyota", "Avenida", "Projetada", "0", "", "Toyota II", "27525526", "(24)3360509"],
    ["Rio Bonito", "Médio", "CRAS ESPAÇO CIDADÃO", "Rua", "CAMILO HENRINGER SERRA", "3", "CASA", "PARQUE DAS ACACIAS", "28800000", "(21)3634803"],
    ["Rio Bonito", "Médio", "CRAS ESPAÇO FAMÍLIA", "Rua", "MAJOR BEZERRA CAVALCANTE", "654", "", "CENTRO", "28800000", "(21)2734191"],
    ["Rio Bonito", "Médio", "CRAS ESPERANCA", "Rua", "2", "0", "PARQUE ANDREA", "BOA ESPERANCA", "28810000", "(21)2747842"],
    ["Rio Claro", "Pequeno I", "CRAS PASSA TRÊS", "Rua", "VICTOR KONDER", "65", "4° DISTRITO", "PASSA TRÊS", "27470000", "(24)3332171"],
    ["Rio Claro", "Pequeno I", "CRAS RIO CLARO", "Praça", "FAGUNDES VARELLA", "30", "1° DISTRITO", "CENTRO", "27460000", "(24)3332119"],
    ["Rio Das Flores", "Pequeno I", "Centro de Referência da Assistência Social do Centro", "Rua", "Coronel Ladislau Guedes", "7", "", "Centro", "27660000", "(24)2458134"],
    ["Rio Das Flores", "Pequeno I", "Centro de Referência da AssistÊncia Social de Tabôas", "Alameda", "Antonio S Avila", "18", "", "Tabôas", "27665000", "(24)2458536"],
    ["Rio Das Ostras", "Grande", "CRAS Rocha Leão", "Rua", "Isolino Almeida", "5", "Cruzamento entre a RFFSA e a Rua Isolino Almeida", "Rocha Leão", "28890000", "(22)2777143"],
    ["Rio Das Ostras", "Grande", "CRAS Região Sul", "Rua", "Serafim Bastos", "0", "s/n", "Cidade Beira Mar", "28890000", "(22)2771640"],
    ["Rio Das Ostras", "Grande", "CRAS Região Norte", "Rua", "Peperônia", "82", "Qd 56", "Âncora", "28899563", "(22)2771570"],
    ["Rio Das Ostras", "Grande", "CRAS Região Central", "Rua", "Três Marias, S/ N°", "0", "", "Nova Cidade", "28890000", "(22)2771291"],
    ["Rio de Janeiro", "Metrópole", "CRAS FRANCISCO SALES DE MESQUITA", "Avenida", "SARGENTO DE MILICIAS", "0", "", "PAVUNA", "21525660", "(21)2407229"],
    ["Rio de Janeiro", "Metrópole", "CRAS CAIO FERNANDO ABREU", "Avenida", "DOS DEMOCRATICOS", "646", "", "MANGUINHOS", "21050000", "(21)2293429"],
    ["Rio de Janeiro", "Metrópole", "CRAS DR. SOBRAL PINTO", "Rua", "DR LEAL", "706", "TERREO", "ENGENHO DE DENTRO", "20730380", "(21)3273037"],
    ["Rio de Janeiro", "Metrópole", "CRAS ADALBERTO ISMAEL DE SOUZA", "Avenida", "BARTOLOMEU GUSMÃO", "1100", "FUNDOS", "SÃO CRISTOVÃO", "20941160", "(21)3234171"],
    ["Rio de Janeiro", "Metrópole", "CRAS PROFESSORA ISMÊNIA LIMA MARTINS", "Rua", "DA ALFANDEGA", "114", "", "CENTRO", "20070004", "(21)2224806"],
    ["Rio de Janeiro", "Metrópole", "CRAS DEPUTADO LUÍS EDUARDO MAGALHÃES", "Rua", "PARAÍSO DO TUIUTÍ", "0", "", "SÃO CRISTOVÃO", "20920220", "(21)3895866"],
    ["Rio de Janeiro", "Metrópole", "CRAS RUBENS CORRÊA", "Rua", "CAPITÃO ALIATAR MARTINS", "211", "", "IRAJÁ", "21235515", "(21)3013463"],
    ["Rio de Janeiro", "Metrópole", "CRAS ACARI", "Rua", "GUAIUBA", "150", "", "ACARI", "21531060", "(21)3375801"],
    ["Rio de Janeiro", "Metrópole", "CRAS ZÓZIMO BARROSO DO AMARAL", "Rua", "OLIVA MAIA", "81", "CASA 102", "MADUREIRA", "21350180", "(21)3018372"],
    ["Rio de Janeiro", "Metrópole", "CRAS MARIA THEREZA FREIRE MOURA", "Rua", "SILVA CARDOSO", "967", "", "BANGU", "21815071", "(21)3463793"],
    ["Rio de Janeiro", "Metrópole", "CRAS CECÍLIA MEIRELES", "Rua", "VIUVA DANTAS", "695", "", "CAMPO GRANDE", "23052090", "(21)3403596"],
    ["Rio de Janeiro", "Metrópole", "CRAS PROFESSOR DARCY RIBEIRO", "Estrada", "GOVERNADOR CHAGAS FREITAS", "1900", "PARQUE ROYAL", "Portuguesa", "21932820", "(21)3393992"],
    ["Rio de Janeiro", "Metrópole", "CRAS MARIA DA LUZ DOS SANTOS", "Rua", "ANA QUINTÃO", "380", "", "PIEDADE", "20751240", "(21)3111754"],
    ["Rio de Janeiro", "Metrópole", "CRAS ROSANI CUNHA", "Rua", "VISCONDE DE SANTA ISABEL", "412", "FDS", "GRAJAÚ", "20560121", "(21)3278644"],
    ["Rio de Janeiro", "Metrópole", "CRAS ALUNO MARCELO CARDOSO TOMÉ", "Rua", "DO RADIO", "0", "", "CAMPO GRANDE", "23087060", "(21)3394446"],
    ["Rio de Janeiro", "Metrópole", "CRAS ELIS REGINA", "Rua", "EDGARD WERNECK", "1565", "FUNDOS", "CIDADE DE DEUS", "22763970", "(21)3342792"],
    ["Rio de Janeiro", "Metrópole", "CRAS GONZAGUINHA", "Praça", "BARAO DA TAQUARA", "9", "", "PRAÇA SECA", "21321010", "(21)3017285"],
    ["Rio de Janeiro", "Metrópole", "CRAS MARIA VIEIRA BAZANI", "Estrada", "DA MATRIZ", "4445", "", "GUARATIBA", "23030320", "(21)3155244"],
    ["Rio de Janeiro", "Metrópole", "CRAS BETTY FRIEDAN", "Rua", "PRAINHAS", "57", "", "SEPETIBA", "23545115", "(21)3427987"],
    ["Rio de Janeiro", "Metrópole", "CRAS HELONEIDA STUDART", "Rua", "RANGEL PESTANA", "510", "", "BANGU", "21820040", "(21)3463721"],
    ["Rio de Janeiro", "Metrópole", "CRAS IACYRA FRAZÃO SOUSA", "Rua", "ALBERI VIEIRA DOS SANTOS", "0", "", "PACIÊNCIA", "23573160", "(21)3157400"],
    ["Rio de Janeiro", "Metrópole", "CRAS MARIA CLARA MACHADO", "Rua", "EDUARDO PINTO VILAR", "0", "CONJUNTO JOÃO XXIII", "SANTA CRUZ", "23560260", "(21)3156909"],
    ["Rio de Janeiro", "Metrópole", "CRAS JORGE GONÇALVES", "Rua", "PRIMEIRA", "61", "FUNDOS", "SANTA CRUZ", "23515180", "(21)3292743"],
    ["Rio de Janeiro", "Metrópole", "CRAS PRESIDENTE ITAMAR FRANCO", "Rua", "CAÇAPAVA", "305", "", "GRAJAÚ", "20541350", "(21)2268837"],
    ["Rio de Janeiro", "Metrópole", "CRAS TIJUCA", "Rua", "GUAPIARA", "43", "", "TIJUCA", "20521180", "(21)3872351"],
    ["Rio de Janeiro", "Metrópole", "CRAS MARY RICHMOND", "Rua", "CONSELHEIRO FERRAZ", "54", "", "LINS DE VASCONCELOS", "20710350", "(21)3278629"],
    ["Rio de Janeiro", "Metrópole", "CRAS SEBASTIÃO TEODORO FILHO", "Rua", "SAINT ROMAN", "172", "", "COPACABANA", "22071060", "(21)3111248"],
    ["Rio de Janeiro", "Metrópole", "CRAS VILA MORETTI", "Rua", "ESPERANÇA", "30", "", "BANGU", "21860160", "(21)3463172"],
    ["Rio de Janeiro", "Metrópole", "CRAS JOSÉ CARLOS CAMPOS", "Rua", "GUARAMA", "0", "", "ROCHA MIRANDA", "21210530", "(21)2475510"],
    ["Rio de Janeiro", "Metrópole", "CRAS CIDADANIA RIO DAS PEDRAS", "Praça", "RUA NOVA", "20", "B", "ITANHANGÁ", "22753043", "(21)2447180"],
    ["Rio de Janeiro", "Metrópole", "CRAS RAMOS", "Avenida", "CENTRAL", "0", "Estação Alemão", "COMPLEXO DO ALEMÃO", "21061700", "(21)3886319"],
    ["Rio de Janeiro", "Metrópole", "CRAS ANILVA DUTRA MENDES", "Rua", "FRANZ LISTZ", "0", "", "JARDIM AMÉRICA", "21240430", "(21)2475510"],
    ["Rio de Janeiro", "Metrópole", "CRAS DEPUTADO JOÃO FASSARELA", "Rua", "FLORA LOBO", "0", "PARQUE ARI BARROSO", "PENHA CIRCULAR", "22210500", "(21)2573122"],
    ["Rio de Janeiro", "Metrópole", "CRAS DODO DA PORTELA", "Avenida", "MARECHAL FLORIANO", "191", "", "CENTRO", "20080005", "(21)2213253"],
    ["Rio de Janeiro", "Metrópole", "CRAS PADRE VELOSO", "Rua", "SÃO CLEMENTE", "312", "", "BOTAFOGO", "22260000", "(21)2535446"],
    ["Rio de Janeiro", "Metrópole", "CRAS OSWALDO ANTONIO FERREIRA", "Rua", "DONA OLÍMPIA", "220", "", "REALENGO", "21765020", "(21)3335054"],
    ["Rio de Janeiro", "Metrópole", "CRAS NELSON MANDELA", "Rua", "DA REGENERAÇÃO", "654", "", "BONSUCESSO", "21040170", "(21)3867485"],
    ["Rio de Janeiro", "Metrópole", "CRAS YARA AMARAL", "Rua", "NEI VIDAL", "43", "", "GUADALUPE", "21675360", "(21)3018625"],
    ["Rio de Janeiro", "Metrópole", "CRAS ZUMBI DOS PALMARES", "Estrada", "DOS BANDEIRANTES", "11227", "", "VARGEM PEQUENA", "22783116", "(21)2408022"],
    ["Rio de Janeiro", "Metrópole", "CRAS GERMINAL DOMINGUES", "Rua", "AMBIRÉ CAVALCANTI", "95", "", "RIO COMPRIDO", "20250490", "(21)2293339"],
    ["Rio de Janeiro", "Metrópole", "CRAS XV DE MAIO", "Rua", "GENERAL SAMPAIO", "74", "", "CAJU", "20931970", "(21)3895866"],
    ["Rio de Janeiro", "Metrópole", "CRAS CARLOS DRUMMOND DE ANDRADE", "Rua", "TAPEROÁ", "308", "MORRO CARACOL", "PENHA", "21070680", "(21)3884839"],
    ["Rio de Janeiro", "Metrópole", "CRAS LUIZA MAHIM", "Rua", "CAMPO GRANDE", "3058", "", "INHOAIBA", "23070000", "(21)2415410"],
    ["Rio de Janeiro", "Metrópole", "CRAS MACHADO DE ASSIS", "Estrada", "RODRIGUES CALDAS", "3400", "", "COLONIA JULIANO MOREIRA", "22713375", "(21)2446195"],
    ["Rio de Janeiro", "Metrópole", "CRAS RINALDO DE LAMARE", "Avenida", "NIEMEYER", "776", "8O. E 9O. ANDARES", "SÃO CONRADO", "22450221", "(21)3111108"],
    ["Rio de Janeiro", "Metrópole", "CRAS OLIMPIA ESTEVES", "Rua", "SANTA CECÍLIA", "984", "TÉRREO", "BANGU", "21810080", "(21)3463833"],
    ["Rio de Janeiro", "Metrópole", "CRAS PROFESSORA HELENICE NUNES JACINTHO", "Travessa", "JK", "5", "31 de Outubro", "Paciência", "23585127", "(21)3096318"],
    ["Santa Maria Madalena", "Pequeno I", "CRAS - CENTRO", "Rua", "Coronel Portugal", "16", "", "Centro", "28770000", "(22)2561329"],
    ["Santa Maria Madalena", "Pequeno I", "CRAS -Largo do Machado", "Praça", "Luiz Machado", "38", "", "Largo do Machado", "28770000", "(22)2561327"],
    ["Santa Maria Madalena", "Pequeno I", "CRAS - Triunfo", "Rua", "Cel. José Teixeira Genelhoud", "21", "", "Triunfo - 2° Distrito", "28770000", "(22)2561202"],
    ["Santo Antônio de Pádua", "Pequeno II", "CRAS José Miguel", "Rua", "Dr. Ferreira da Luz", "618", "casa 1", "Centro", "28470000", "(22)3853214"],
    ["Santo Antônio de Pádua", "Pequeno II", "CIDADE NOVA", "Rua", "Recanto da Saudade", "17", "Campo Alegre", "campo alegre", "28470000", "(22)3853417"],
    ["São Fidélis", "Pequeno II", "CRAS Filotéia Bragança", "Praça", "Filotéia Bragança", "48", "B", "São Vicente de Paula", "28400000", "(22)2758527"],
    ["São Fidélis", "Pequeno II", "CRAS Duque de Caxias", "Rua", "Frei Vitório", "621", "", "Centro", "28400000", "(22)2758646"],
    ["São Francisco de Itabapoana", "Pequeno II", "CRAS CENTRO", "Rua", "JOÃO PAES VIANA", "29", "", "CENTRO", "28230000", "(22)2789116"],
    ["São Francisco de Itabapoana", "Pequeno II", "CRAS - PRAÇA JOÃO PESSOA", "Rua", "PROJETADA D", "0", "", "PRAÇA JOÃO PESSOA", "28230000", "(22)2789116"],
    ["São Francisco de Itabapoana", "Pequeno II", "CRAS - ILHA DOS MINEIROS", "Rua", "SEIS", "0", "", "ILHA DOS MINEIROS", "28230000", "(22)2789116"],
    ["São Gonçalo", "Metrópole", "CRAS VISTA ALEGRE", "Rua", "SÃO PEDRO", "2", "", "VISTA ALEGRE", "24400000", "(21)2706360"],
    ["São Gonçalo", "Metrópole", "CRAS CENTRO", "Rua", "Dona Clara", "541", "", "CENTRO", "24425005", "(21)2604457"],
    ["São Gonçalo", "Metrópole", "CRAS PORTO DO ROSA", "Rua", "ERNESTO LAVISSE", "2424", "", "PORTO DO ROSA", "24470390", "(21)2605265"],
    ["São Gonçalo", "Metrópole", "CRAS NEVES", "Rua", "Lenor", "108", "casa 1", "Porto Velho", "24430150", "(21)2624001"],
    ["São Gonçalo", "Metrópole", "CRAS ALCÂNTARA", "Rua", "Oscar Lourenço", "632", "", "ALCANTARA", "24440440", "(21)2624644"],
    ["São Gonçalo", "Metrópole", "CRAS AMENDOEIRA", "Estrada", "DO PACHECO", "39", "", "Amendoeira", "24732570", "(21)3701644"],
    ["São Gonçalo", "Metrópole", "CRAS SALGUEIRO", "Estrada", "Estrada  das Palmeiras", "106", "", "Itauna", "24475002", "(21)3605242"],
    ["São Gonçalo", "Metrópole", "CRAS MARAMBAIA", "Rua", "Itália", "38", "B", "Marambaia", "24440440", "(21)2603579"],
    ["São Gonçalo", "Metrópole", "CRAS MARIA PAULA", "Rua", "ANTONIO ALVES BELMONT", "385", "", "MARIA PAULA", "24756320", "(21)2617606"],
    ["São Gonçalo", "Metrópole", "CRAS TRIBOBO", "Rua", "PASTOR MARTIN LUTHER KING", "500", "", "TRIBOBÓ", "24400000", "(21)3711274"],
    ["São Gonçalo", "Metrópole", "CRAS GALO BRANCO", "Rua", "ALEXANDRINO CUNHA", "114", "", "GALO BRANCO", "24422290", "(21)2617631"],
    ["São Gonçalo", "Metrópole", "CRAS Barro Vermelho", "Rua", "JOÃO PESSOA", "372", "", "BARRO VERMELHO", "24400000", "(21)3703593"],
    ["São Gonçalo", "Metrópole", "CRAS ENGENHO PEQUENO", "Rua", "MENTOR COUTO", "925", "", "ENGENHO PEQUENO", "24417000", "(21)3703188"],
    ["São Gonçalo", "Metrópole", "CRAS GUAXINDIBA", "Rua", "AQUILINO DE CARVALHO", "0", "", "GUAXINDIBA", "24722250", "(21)2614974"],
    ["São Gonçalo", "Metrópole", "CRAS SANTA IZABEL", "Estrada", "SANTA IZABEL", "95", "", "SANTA IZABEL", "24735040", "(21)3710307"],
    ["São Gonçalo", "Metrópole", "CRAS SANTA LUZIA", "Rua", "INES PEIXOTO LOTE 20", "0", "QUADRA 100", "Jardim Catarina", "24400000", "(21)3606183"],
    ["São Gonçalo", "Metrópole", "CRAS ITAOCA", "Rua", "ANTONIO LEONCIO", "33", "", "ITAOCA", "24471400", "(21)2607864"],
    ["São Gonçalo", "Metrópole", "CRAS JARDIM CATARINA", "Rua", "Leão Gambeta", "533", "", "Jardim Catarina", "24716380", "(21)2603131"],
    ["São João da Barra", "Pequeno II", "CRAS AÇU", "Rua", "MANOEL FRANCISCO DE ALMEIDA", "0", "CASA", "AÇU", "28200000", "(22)2741937"],
    ["São João da Barra", "Pequeno II", "CRAS CAZUMBÁ", "Praça", "PRAÇA DE CAZUMBÁ", "0", "", "CAZUMBÁ", "28200000", "(22)2741787"],
    ["São João da Barra", "Pequeno II", "CRAS ATAFONA", "Rua", "JOAQUIM BRITO MACHADO", "523", "casa", "ATAFONA", "28200000", "(22)2741102"],
    ["São João da Barra", "Pequeno II", "CRAS BARCELOS", "Rua", "RUA GREGÓRIO PRUDÊNCIO DE AZEVEDO S/N", "0", "PRÉDIO", "BARCELOS", "28200000", "(22)2741533"],
    ["São João da Barra", "Pequeno II", "CRAS GRUSSAI", "Rua", "MANOEL FRANÇA DA SILVA", "373", "CASA", "FIGUEIRA-GRUSSAÍ", "28200000", "(22)2741787"],
    ["São João de Meriti", "Grande", "CRAS Trio de Ouro", "Rua", "Morro das Pedras", "73", "Qd.98", "Trio de Ouro", "25515520", "(21)2651104"],
    ["São João de Meriti", "Grande", "CRAS Éden", "Rua", "Ana Brito da Silva", "2470", "", "Éden", "25525512", "(21)2756937"],
    ["São João de Meriti", "Grande", "CRAS Centro", "Rua", "SÃO JOÃO BATISTA", "742", "", "CENTRO", "25515520", "(21)2786580"],
    ["São João de Meriti", "Grande", "CRAS Jardim Íris", "Rua", "Av. Copacabana", "50", "", "Jardim Íris", "25580000", "(21)3757283"],
    ["São João de Meriti", "Grande", "CRAS Vila São José", "Rua", "Comendador Teles", "3199", "casa 2", "Vila São José", "25570457", "(21)3755222"],
    ["São João de Meriti", "Grande", "CRAS Parque Tiete", "Rua", "Castro Alves", "0", "lt 01 qd 07", "Parque Tiete", "25586157", "(21)2651104"],
    ["São José de Ubá", "Pequeno I", "CRAS RURAL", "Rua", "Orestes Siqueira", "0", "Prédio", "Loteamento Nova Ubá", "28455000", "(22)3866173"],
    ["São José de Ubá", "Pequeno I", "CRAS URBANO", "Avenida", "DAVID VIEIRA NEY", "215", "", "CENTRO", "28455000", "(22)3866105"],
    ["São José do Vale do Rio Preto", "Pequeno II", "CRAS - Centro", "Estrada", "Silveira da Motta", "25693", "Casa", "Centro", "25780000", "(24)2224160"],
    ["São Pedro da Aldeia", "Médio", "CRAS Gelson Pinheiro - RUA DO FOGO", "Rua", "Projetada C lote 11", "11", "Quadra D", "Rua do Fogo", "28940000", "(22)2625330"],
    ["São Pedro da Aldeia", "Médio", "CRAS Antonio Paulino de Souza - MORRO DO MILAGRE", "Rua", "Iracy dos Santos", "7", "", "Morro do Milagre", "28940000", "(22)2625806"],
    ["São Pedro da Aldeia", "Médio", "CRAS Catarina Machado da Silva Borges - ALECRIM", "Rua", "Alfazema", "5", "Lote 27", "Alecrim", "28940000", "(22)2648806"],
    ["São Pedro da Aldeia", "Médio", "CRAS Palmiro Gomes - PORTO DA ALDEIA", "Rua", "Saputiaba", "51", "", "Porto da Aldeia", "28940000", "(22)2627077"],
    ["São Pedro da Aldeia", "Médio", "CRAS Anibal Martins Ferreira - SAO JOAO", "Rua", "São Jorge", "465", "", "São João", "28942854", "(22)2625491"],
    ["São Pedro da Aldeia", "Médio", "CRAS Prof. Carlota Pereira dos Santos - BALNEARIO", "Rua", "Nicanor Pereira dos Santos", "0", "", "Balneario", "28940000", "(22)2621918"],
    ["São Sebastião do Alto", "Pequeno I", "CRAS VALÃO DO BARRO", "Rua", "MANOEL JOAQUIM TEIXEIRA VOGAS", "235", "", "CENTRO", "28555000", "(22)2556138"],
    ["São Sebastião do Alto", "Pequeno I", "CRAS I - SEDE", "Rua", "EURICO CERBINO", "139", "", "centro", "28555000", "(22)2559121"],
    ["Sapucaia", "Pequeno I", "CRAS ANTA - Thereza Rocha Kochem", "Rua", "Domingos Vieira", "95", "", "ANTA", "25882000", "(24)2271007"],
    ["Sapucaia", "Pequeno I", "CRAS APARECIDA", "Rua", "José Pedro Nolasco", "11", "", "Aparecida", "25886000", "(24)2271407"],
    ["Sapucaia", "Pequeno I", "CRAS PIÃO", "Rua", "José Arthur dos Santos", "180", "", "PIÃO", "25884000", "(21)3641792"],
    ["Sapucaia", "Pequeno I", "CRAS JAMAPARÁ", "Avenida", "Paulino Fernandes Silva", "409", "", "Jamapará", "25887000", "(24)2272202"],
    ["Sapucaia", "Pequeno I", "CRAS SAPUCAIA", "Rua", "Maurício de Abreu", "161", "", "Centro", "25880000", "(24)2271123"],
    ["Saquarema", "Médio", "CRAS BACAXÁ", "Rua", "Capitão Nunes", "962", "", "Barreira", "28993000", "(22)2653477"],
    ["Saquarema", "Médio", "CRAS RIO DA AREIA", "Rua", "José Ferreira, s/nº", "0", "s/nº", "Rio da Areia", "28993000", "(22)2653050"],
    ["Saquarema", "Médio", "CRAS JACONÉ", "Rua", "22 COM RUA 96", "16", "LOTE 16 QUADRA 2229", "JACONE", "28990972", "(22)2652205"],
    ["Saquarema", "Médio", "CRAS SAMPAIO CORREA", "Rua", "PRIMEIRO DE MAIO", "115", "", "SAMPAIO CORREA", "28997000", "(22)2654221"],
    ["Seropédica", "Médio", "CRAS 2 - FAZENDA CAXIAS", "Rua", "DEMETRIO DE BRITO", "136", "", "FAZENDA CAXIAS", "23890000", "(21)3787085"],
    ["Seropédica", "Médio", "CRAS 1 - CAMPO LINDO", "Rua", "Niteroi,", "27", "", "Campo lindo", "23890000", "(21)2682632"],
    ["Seropédica", "Médio", "CRAS 3 - JARDIM MARACANÃ", "Rua", "ARLIETE DA SILVA RODRIGUES", "0", "", "JD MARACANÃ", "23890000", "(21)3787884"],
    ["Seropédica", "Médio", "CRAS 4 - BOA ESPERANÇA", "Rua", "João Gonçalves da Silva", "0", "QD 24 Lt. 01", "BOA ESPERANÇA", "23890000", "(21)2682354"],
    ["Silva Jardim", "Pequeno II", "CRAS ESTADUAL RJ", "Rua", "Padre Antônio Pinto", "332", "", "Centro", "28820000", "(22)2668819"],
    ["Silva Jardim", "Pequeno II", "CRAS Renascer", "Rua", "Padre Ávila", "137", "", "Centro", "28820000", "(22)2668173"],
    ["Sumidouro", "Pequeno I", "CRAS - CENTRO", "Rua", "Dez de Junho", "331", "casa", "Centro", "28637000", "(22)2531131"],
    ["Sumidouro", "Pequeno I", "CRAS - Campinas", "Avenida", "João Faustino Lopes", "0", "", "Campinas", "28637000", "(22)2531309"],
    ["Tanguá", "Pequeno II", "CRAS Bandeirante", "Rua", "38", "0", "Lt 14, Qd 18", "Bandeirante I", "24890000", "(21)3749127"],
    ["Tanguá", "Pequeno II", "CRAS  Posse dos Coutinhos", "Praça", "Palmira Pacheco", "0", "", "Posse dos Coutinhos", "24890000", "(21)3749112"],
    ["Tanguá", "Pequeno II", "CRAS DUQUES", "Rua", "SEMPRE VIVA", "310", "", "DUQUES", "24890000", "(21)3639595"],
    ["Tanguá", "Pequeno II", "CRAS VILA CORTES", "Rua", "ODNEA CARVANLHO DE SOUZA", "9", "LT 10 QD 11", "VILA CORTES", "24890000", "(21)2747133"],
    ["Tanguá", "Pequeno II", "CRAS Centro", "Rua", "Demerval Garcia", "112", "", "Centro", "24890000", "(21)2747126"],
    ["Teresópolis", "Grande", "CRAS Meudon", "Rua", "Caramurú", "108", "", "Meudon", "25954175", "(21)3641143"],
    ["Teresópolis", "Grande", "CRAS FISCHER", "Rua", "Pedro Eleutério de Oliveira", "2738", "", "Fischer", "25976280", "(21)3641949"],
    ["Teresópolis", "Grande", "CRAS ALTO", "Rua", "Nilza Chiapeta Fadigas", "190", "", "Varzea", "25963150", "(21)3641301"],
    ["Teresópolis", "Grande", "CRAS BARROSO", "Rua", "Pará", "0", "s/n no final da rua", "Barroso", "25976065", "(21)3642105"],
    ["Teresópolis", "Grande", "CRAS SÃO PEDRO", "Rua", "Fileuterpe", "845", "casa", "São Pedro", "25956005", "(21)2743830"],
    ["Trajano de Moraes", "Pequeno I", "CRAS CENTRO", "Rua", "DOUTOR JOSE DE MORAES", "15", "", "CENTRO", "28750000", "(22)2564142"],
    ["Trajano de Moraes", "Pequeno I", "CRAS VISCONDE DE IMBÉ", "Rua", "Jugurta Tupinambá", "0", "s/n", "VISCONDE DE IMBÉ", "28755000", "(22)2564005"],
    ["Três Rios", "Médio", "CRAS BEMPOSTA", "Rua", "Werneck", "0", "", "Bemposta", "25840000", "(24)2258214"],
    ["Três Rios", "Médio", "CRAS VILA", "Praça", "Ambrosina Bastos", "32", "", "Vila Isabel", "25815430", "(24)2252407"],
    ["Três Rios", "Médio", "CRAS CENTRO", "Rua", "XV de Novembro", "566", "", "Centro", "25804000", "(24)2255138"],
    ["Três Rios", "Médio", "CRAS TRIANGULO", "Rua", "Santo Antônio", "200", "", "Triângulo", "25820185", "(24)2255475"],
    ["Valença", "Médio", "CRAS VARGINHA", "Rua", "MACIEL NASCIMENTO,", "155", "LOTE 1, QUADRA H", "CHACRINHA", "27600000", "(24)2452800"],
    ["Valença", "Médio", "CRAS BARÃO DE JUPARANÃ", "Rua", "SILVIO CAMARGO", "14", "CENTRO", "DISTRITO DE BARÃO DE JUPARANÃ", "27640000", "(24)2471586"],
    ["Valença", "Médio", "CRAS CAMBOTA", "Rua", "PEDRO PONCIANO", "164", "", "CAMBOTA", "27600000", "(24)2452431"],
    ["Varre-sai", "Pequeno I", "CRAS I", "Rua", "João Ramos Pereira", "18", "", "Centro", "28375000", "(22)3843310"],
    ["Varre-sai", "Pequeno I", "CRAS II", "Fazenda", "Cruz da Ana", "0", "", "Zona rural", "28375000", "(22)3843323"],
    ["Vassouras", "Pequeno II", "CRAS REPRESA DO GRECCO", "Rua", "TIBURCIO BARBOSA", "818", "", "GRECCO", "27700000", "(24)2491102"],
    ["Vassouras", "Pequeno II", "CRAS TOCA DOS LEÕES", "Rua", "B", "0", "", "Toca dos Leoes", "27700000", "(24)2491196"],
    ["Vassouras", "Pequeno II", "CRAS Centro", "Rua", "JOSÉ DE OLIVEIRA CURA", "7", "", "Centro", "27700000", "(24)2471357"],
    ["Volta Redonda", "Grande", "CRAS Candelária", "Rua", "TORRES", "45", "", "CANDELÁRIA", "27285660", "(24)3337201"],
    ["Volta Redonda", "Grande", "CRAS Rústico", "Praça", "7B", "142", "", "RÚSTICO", "27264290", "(24)3339427"],
    ["Volta Redonda", "Grande", "CRAS Santa Rita de Cássia", "Rua", "DA GRANJA", "40", "", "SANTA RITA DE CASSIA", "27200000", "(24)3345411"],
    ["Volta Redonda", "Grande", "CRAS JARDIM BELMONTE", "Avenida", "Almirante Adalberto Barros Nunes", "4187", "", "Jardim Belmonte", "27274200", "(24)3339928"],
    ["Volta Redonda", "Grande", "CRAS Roma II", "Rua", "5", "36", "", "ROMA II", "27180000", "(24)3320665"],
    ["Volta Redonda", "Grande", "CRAS Roma I", "Rua", "DEZENOVE DE ABRIL", "76", "", "ROMA I", "27185000", "(24)3320667"],
    ["Volta Redonda", "Grande", "CRAS Coqueiros", "Rua", "J", "50", "", "COQUEIROS", "27280470", "(24)3338559"],
    ["Volta Redonda", "Grande", "CRAS São Luiz", "Rua", "EDGAR BANDEIRA", "787", "", "SÃO LUIZ", "27286330", "(24)3338208"],
    ["Volta Redonda", "Grande", "CRAS Volta Grande", "Rua", "1054", "159", "", "VOLTA GRANDE I", "27180000", "(24)3339911"],
    ["Volta Redonda", "Grande", "CRAS Ilha Parque", "Rua", "13 B", "0", "", "Ilha Parque", "27291291", "(24)3339961"],
    ["Volta Redonda", "Grande", "CRAS Jardim Ponte Alta", "Rua", "D", "155", "", "JARDIM PONTE ALTA", "27333220", "(24)3342557"],
    ["Volta Redonda", "Grande", "CRAS São Carlos", "Rua", "FARIA DE BRITO", "669", "", "SÃO CARLOS", "27265565", "(24)3337843"],
    ["Volta Redonda", "Grande", "CRAS Açude", "Rua", "FRANCISCO ANTONIO FRANCISCO", "5", "", "AÇUDE", "27270280", "(24)3341226"],
    ["Volta Redonda", "Grande", "CRAS Verde Vale", "Rua", "sete", "0", "", "VERDE VALE", "27281020", "(24)3339974"],
    ["Volta Redonda", "Grande", "CRAS Nova Primavera", "Rua", "Ponciano Guimarães", "51", "", "Nova Primavera", "27230100", "(24)3339245"],
    ["Volta Redonda", "Grande", "CRAS Vila Mury", "Rua", "AMAZONAS", "275", "", "VILA MURY", "27281060", "(24)3339910"],
    ["Volta Redonda", "Grande", "CRAS Vila Americana", "Rua", "ESTADOS UNIDOS", "380", "", "VILA AMERICANA", "27212160", "(24)3337848"],
    ["Volta Redonda", "Grande", "CRAS Santo Agostinho", "Rua", "ITAMARACÁ", "79", "", "SANTO AGOSTINHO", "27291000", "(24)3339207"],
    ["Volta Redonda", "Grande", "CRAS Água Limpa", "Rua", "SIQUEIRA CAMPOS", "16", "", "ÁGUA LIMPA", "27550520", "(24)3339448"],
    ["Volta Redonda", "Grande", "CRAS Monte Castelo", "Rua", "SÃO SEBASTIÃO", "112", "", "MONTE CASTELO", "27255640", "(24)3342172"],
    ["Volta Redonda", "Grande", "CRAS São Sebastião", "Via", "B-10", "310", "", "São Sebastião", "27286470", "(24)3347813"],
    ["Volta Redonda", "Grande", "CRAS Dom Bosco", "Rua", "DEODORO DA FONSECA", "53", "", "DOM BOSCO", "27286070", "(24)3338530"],
    ["Volta Redonda", "Grande", "CRAS Belo Horizonte", "Rua", "NESTÓRIO", "1283", "", "BELO HORIZONTE", "27180000", "(24)3339195"],
    ["Volta Redonda", "Grande", "CRAS Vila Brasília", "Rua", "C", "2", "", "VILA BRASILIA", "27280760", "(24)3339208"],
    ["Volta Redonda", "Grande", "CRAS Padre Josimo", "Rua", "7", "101", "", "Padre Josimo", "27273750", "(24)3338369"],
    ["Volta Redonda", "Grande", "CRAS Retiro", "Rua", "GRANDES LOJAS", "107", "", "RETIRO", "27279680", "(24)3338906"],
    ["Volta Redonda", "Grande", "CRAS Caieiras", "Avenida", "IMPRENSA", "5", "", "CAIEIRAS", "27220030", "(24)3337898"],
    ["Volta Redonda", "Grande", "CRAS Brasilândia", "Rua", "K", "98", "", "BRASILÂNDIA", "27220375", "(24)3339194"],
    ["Volta Redonda", "Grande", "CRAS Vila Três Poços", "Rua", "ÉRICA BERBET", "5", "", "TRES POÇOS", "27240550", "(24)3336200"],
    ["Volta Redonda", "Grande", "CRAS Vila Rica", "Rua", "VINTE", "275", "", "VILA RICA", "27259480", "(24)3339425"],
    ["Volta Redonda", "Grande", "CRAS Mariana Torres", "Rua", "D", "143", "", "MARIANA TORRES", "27279390", "(24)3339956"],
    ["Volta Redonda", "Grande", "CRAS Siderlândia", "Rua", "10", "20", "", "SIDERLÂNDIA", "27273290", "(24)3339195"],
    ["Volta Redonda", "Grande", "CRAS Santa Cruz", "Avenida", "MAJOR ANIBAL", "232", "", "SANTA CRUZ", "27288020", "(24)3341124"],
  ];

  // TODO cópia de creas_20170810.json
  creases: string[][] = [
    ["Município", "Porte_pop2010", "ident1", "ident2", "ident3", "ident4", "ident5", "ident6", "ident8", "ident12"],
    ["Angra Dos Reis", "Grande", "CREAS Angra dos Reis", "Rua", "11 DE JUNHO", "51", "", "CENTRO", "23900-170", "(24) 3365-5167"],
    ["Aperibé", "Pequeno I", "CREAS", "Rua", "FRANCISCO HENRIQUE DE SOUZA", "535", "", "PALMEIRAS", "28495-000", "(22) 3864-1606"],
    ["Araruama", "Grande", "CREAS - Centro de Referência Especializado de Assistência Social", "Rua", "Rua República do Chile", "437", "", "Centro", "28970-000", "(22) 2664-1706"],
    ["Areal", "Pequeno I", "CREAS Amaurílio Jairo de Lima", "Rua", "Joao Pedro da Silveira", "235", "", "Centro", "25845-000", "(24) 2257-2963"],
    ["Armação Dos Búzios", "Pequeno II", "CREAS - Armação dos Búzios", "Estrada", "JOSE BENTO RIBEIRO DANTAS", "4994", "", "MANGUINHOS", "28950-000", "(22) 2623-1685"],
    ["Arraial do Cabo", "Pequeno II", "CREAS - ARRAIAL DO CABO", "Rua", "OSWALDO CRUZ", "62", "", "centro", "28930-000", "(22) 2622-2500"],
    ["Barra do Piraí", "Médio", "CREAS Centro de Referencia Especializado de Assistencia Social", "Rua", "DONA GUILHERMINA", "45", "", "CENTRO", "27120-080", "(24) 2444-4546"],
    ["Barra Mansa", "Grande", "CREAS BARRA MANSA", "Rua", "SANTOS DUMONT", "126", "", "CENTRO", "27355-080", "(24) 3322-6534"],
    ["Belford Roxo", "Grande", "CREAS - ANDRE LUIZ BONFIM DE ALENCAR", "Estrada", "DOUTOR PLÍNIO CASADO", "3968", "", "CENTRO", "26130-621", "(21) 2761-6578"],
    ["Belford Roxo", "Grande", "CREAS - IRMÃ FILOMENA", "Rua", "SILVA PEIXOTO", "10", "Lt 10   Qd.J", "PARQUE AMORIM", "26183-560", "(21) 2761-7233"],
    ["Belford Roxo", "Grande", "CREAS LEONARDO TARGINO DO CARMO", "Avenida", "JOAQUIM DA COSTA LIMA", "2723", "", "SANTA AMÉLIA", "26115-315", "(21) 3772-1812"],
    ["Bom Jardim", "Pequeno II", "CREAS", "Avenida", "LEOPOLDO SILVA", "518", "ANTIGA RUA NOVA", "CENTRO", "28660-000", "(22) 2566-1125"],
    ["Bom Jesus do Itabapoana", "Pequeno II", "CREAS Assistente Social Josy Ramos Amador", "Praça", "Governador Portela - Ed. Ferreira e Borges", "164", "sala 107/108", "centro", "28360-000", "(22) 3831-5352"],
    ["Cabo Frio", "Grande", "CREAS CENTRO DE REFERÊNCIA ESPECIALIZADO DE ASSISTÊNCIA SOCIAL", "Rua", "Alemanha", "132", "casa 01", "Jardim Caiçara", "28910-370", "(22) 2645-3106"],
    ["Cachoeiras de Macacu", "Médio", "CREAS - Cachoeiras de Macacu", "Rua", "ANICIO MONTEIRO DA SILVA", "0", "", "CENTRO", "28680-000", "(21) 2649-3076"],
    ["Cambuci", "Pequeno I", "CREAS", "Avenida", "José de Souza Faria", "220", "", "Floresta", "28430-000", "(22) 2767-3247"],
    ["Campos Dos Goytacazes", "Grande", "CREAS I", "Avenida", "Carmem Carneiro", "1050", "", "JARDIM CARIOCA", "28083-510", "(22) 2733-2992"],
    ["Campos Dos Goytacazes", "Grande", "CREAS II", "Rua", "Rua dos Goytacazes", "618", "", "TURF CLUB", "28000-100", "(22) 2728-0123"],
    ["Campos Dos Goytacazes", "Grande", "CREAS III", "Rua", "Av. José Alves de Azevedo", "216", "", "CENTRO", "28000-100", "(22) 2735-3925"],
    ["Cantagalo", "Pequeno I", "CREAS", "Rua", "Nair Jacinta", "0", "", "São José", "28500-000", "(22) 2555-1763"],
    ["Carapebus", "Pequeno I", "CREAS", "Rua", "RUA PRATA MANCEBO", "30", "", "Centro", "27998-000", "(22) 2768-3050"],
    ["Cardoso Moreira", "Pequeno I", "CREAS", "Rua", "Rua Donatila Vilela Marins.", "0", "", "centro", "28180-000", "(22) 2785-1639"],
    ["Carmo", "Pequeno I", "CREAS NELSON LOPES CORRÊA", "Rua", "ABREU MAGALHAES", "137", "", "CENTRO", "28640-000", "(22) 2537-2355"],
    ["Casimiro de Abreu", "Pequeno II", "CREAS Casimiro de Abreu", "Rua", "Armindo Julio Mozer", "0", "Fundos", "Mataruna", "28860-000", "(22) 2778-3933"],
    ["Comendador Levy Gasparian", "Pequeno I", "CREAS", "Rua", "EUCLIDES DANTAS WERNECK", "6", "", "centro", "25870-000", "(24) 2254-2867"],
    ["Conceição de Macabu", "Pequeno II", "CREAS", "Rua", "Rozendo Fontes Tavares", "100", "", "Bocaina", "28740-000", "(22) 2779-4044"],
    ["Cordeiro", "Pequeno II", "CREAS", "Rua", "Van Erven", "35", "", "Centro", "28545-000", "(22) 2551-2600"],
    ["Duas Barras", "Pequeno I", "CREAS", "Rua", "MONNERAT", "123", "", "CENTRO", "28650-000", "(22) 2534-1741"],
    ["Duque de Caxias", "Grande", "CREAS CENTENÁRIO", "Rua", "R. MANUEL VIEIRA", "0", "s/n", "Vila Meriti", "25070-350", "(21) 2771-2879"],
    ["Duque de Caxias", "Grande", "CREAS FIGUEIRA", "Rodovia", "WASHINGTON LUIS KM 109", "0", "", "FIGUEIRA", "25213-005", "(21) 2773-2342"],
    ["Duque de Caxias", "Grande", "CREAS Vila Maria Helena", "Rua", "Antenor", "100", "", "Vila Maria Helena", "25251-750", "(21) 2676-1032"],
    ["Engenheiro Paulo de Frontin", "Pequeno I", "CREAS", "Rua", "CORREA LIMA. 25", "25", "", "CENTRO", "26650-000", "(24) 2463-1173"],
    ["Guapimirim", "Médio", "CREAS Unidade Guapimirim", "Rua", "joão seixas júnior", "119", "casa", "parque freixal", "25940-000", "(21) 2632-6977"],
    ["Iguaba Grande", "Pequeno II", "CREAS OSCAR MAGALHÃES", "Rua", "RUA ANTELIN TEIXEIRA DE CARVALHO", "140", "", "ESTAÇÃO", "28960-000", "(22) 2624-8387"],
    ["Itaboraí", "Grande", "CREAS CENTRO DE REFERÊCIA ESPECIALIZADO EM ASSISTÊNCIA SOCIAL", "Rua", "JOÃO CAETANO", "94", "", "CENTRO", "24800-000", "(21) 3639-2080"],
    ["Itaguaí", "Grande", "CREAS ITAGUAÍ", "Rua", "Maria Soares da Silva", "314", "", "Parque Independência", "23812-525", "(21) 2687-4217"],
    ["Itaocara", "Pequeno II", "CREAS", "Rua", "PRAÇA TOLEDO PIZZA", "68", "CASA", "CENTRO", "28570-000", "(22) 3861-3925"],
    ["Itaperuna", "Médio", "CREAS DE ITAPERUNA", "Praça", "GETÚLIO VARGAS", "94", "1º ANDAR", "CENTRO", "28300-000", "(22) 3824-6301"],
    ["Itatiaia", "Pequeno II", "CREAS ITATIAIA", "Rua", "AV. DOS EXPEDICIONÁIOS", "539", "CASA", "CENTRO", "27580-000", "(24) 3352-3981"],
    ["Japeri", "Médio", "CREAS JAPERI", "Praça", "MANUEL MARQUES", "10", "loja 14", "CENTRO", "26375-630", "(21) 2670-4243"],
    ["Laje do Muriaé", "Pequeno I", "CREAS", "Rua", "Ferreira César", "195", "", "Centro", "28350-000", "(22) 3829-1209"],
    ["Macaé", "Grande", "CREAS MACAE", "Rua", "Rua Alfredo Backer", "640", "", "centro", "27910-190", "(22) 2796-1102"],
    ["Macaé", "Grande", "CREAS II", "Rua", "Ari de Carvalho", "0", "loteamento Bosque Azul 2", "Bosque Azul", "27971-754", "(22) 2796-1690"],
    ["Magé", "Grande", "CREAS - Magé", "Rua", "Coronel Theotônio Botelho do Rego", "29", "Magé", "CENTRO", "25900-000", "(21) 3630-7220"],
    ["Mangaratiba", "Pequeno II", "CREAS Mangaratiba", "Rua", "major Jose Caetano", "8182", "CENTRO", "MANGARATIBA", "23860-000", "(21) 2789-6014"],
    ["Maricá", "Grande", "CREAS", "Rua", "0 LOTE 10 QUADRA 03", "10", "PARQUE ELDORADO", "CENTRO", "24900-000", "(21) 2637-3769"],
    ["Mendes", "Pequeno I", "CREAS", "Rua", "Dr. Felício dos Santos", "170", "", "Centro - Fim do Ponto", "26700-000", "(24) 2465-7068"],
    ["Mesquita", "Grande", "CREAS", "Avenida", "COELHO DA ROCHA Nº 1426", "1426", "", "ROCHA SOBRINHO", "26572-481", "(21) 3765-2987"],
    ["Miguel Pereira", "Pequeno II", "CREAS", "Rua", "Luiz Pamplona", "100", "", "Centro", "26900-000", "(24) 2484-3676"],
    ["Miracema", "Pequeno II", "CREAS", "Praça", "JOÃO ANTÔNIO HASSEL", "91", "", "CENTRO", "28460-000", "(22) 3852-1890"],
    ["Natividade", "Pequeno I", "CREAS - Lucia Regina Alvarez Pinto Ribeiro", "Rua", "Santo Expedito", "204", "prédio", "Sindicato", "28380-000", "(22) 3841-1630"],
    ["Nilópolis", "Grande", "CREAS NILÓPOLIS - CENTRO DE REFERÊNCIA ESPECIALIZADO DE ASSISTÊNCIA SOCIAL", "Rua", "MANUEL RODRIGUES FONTINHA", "13", "", "NOVA CIDADE", "26535-270", "(21) 3761-5514"],
    ["Niterói", "Grande", "CREAS Centro", "Avenida", "Ernani do Amaral Peixoto", "901", "", "CENTRO", "24020-073", "(21) 2717-4201"],
    ["Niterói", "Grande", "CREAS Largo da Batalha", "Rua", "Reverendo Armando Ferreira", "19", "", "Largo da Batalha", "24310-400", "(21) 2715-7257"],
    ["Nova Friburgo", "Grande", "CREAS -NOVA FRIBURGO Centro de Referência Especializado de Assistência Social", "Rua", "PADRE MADUREIRA", "53", "", "CENTRO", "28610-005", "(22) 2543-6305"],
    ["Nova Iguaçu", "Grande", "CREAS - Centro de Referência Especializado da Assistência Social", "Rua", "MARIA LAURA S/N", "0", "", "MOQUETA", "26285-390", "(21) 2698-1461"],
    ["Nova Iguaçu", "Grande", "CREAS CAIOABA", "Rua", "Doutor SÁ REGO", "503", "", "Caioaba", "26012-480", "(21) 2668-4517"],
    ["Nova Iguaçu", "Grande", "CREAS DOM BOSCO", "Rua", "do Gelo", "59", "", "Dom Bosco", "26295-054", "(21) 3794-8365"],
    ["Nova Iguaçu", "Grande", "CREAS MIGUEL COUTO", "Estrada", "Luiz de Lemos", "2722", "", "MIGUEL COUTO", "23113-000", "(21) 2769-1897"],
    ["Paracambi", "Pequeno II", "CREAS - PARACAMBI", "Rua", "Dr. Soares Filho", "125", "", "Centro", "26600-000", "(21) 2683-3074"],
    ["Paraíba do Sul", "Pequeno II", "CREAS - Alair Pedroso", "Rua", "Visconde do Rio Novo", "149", "Casa", "Centro", "25850-000", "(24) 2263-5554"],
  ];

  // TODO cópia de indicadores_sociais_20170810.json
  indicadoresSociais: string[][] = [
    ["MUNICÍPIO", "PREFEITO", "SECRETÁRIO DE ASSISTÊNCIA SOCIAL", "POPULAÇÃO", "IDH", "CRAS", "CREAS", "CENTRO POP", "Total ", "% do Estado", "Famílias Vulneráveis", "% da População do Município", "% do Estado", " Famílias Beneficiárias", "% da População do Município", "% Cobertura - Perfil Bolsa Família", "% Cobertura - Perfil Cad.Único", "Valor Total Repassado", "  Famílias Registradas", "Benefícios Eventuais", "PAIF", "PAEFI", "Total de Beneficiários", "Valor Total Repassado"],
    ["Angra Dos Reis", "Fernando Antônio Ceciliano Jordão", "Munir Francisco", "177.101", "0,72", "7", "1", "0", "8", "1,36", "14.911", "8,42", "1,04", "10.495", "5,93", "116,66", "70,38", "R$ 22.424.211,00", "19.669", "SIM", "SIM", "SIM", "2.760", "R$ 2.574.492,98"],
    ["Aperibé", "Flávio Diniz Berriel", "Vanessa Garcia Correa", "10.545", "0,69", "3", "1", "0", "4", "0,68", "1.276", "12,10", "0,09", "686", "6,51", "93,46", "53,76", "R$ 1.362.195,00", "1.476", "SIM", "SIM", "SIM", "155", "R$ 144.298,14"],
    ["Araruama", "Livia Soares Bello Da Silva", "João Baptista De Araujo Filho", "116.418", "0,72", "5", "1", "1", "7", "1,19", "12.712", "10,92", "0,89", "9.494", "8,16", "115,7", "74,69", "R$ 21.452.175,00", "17.227", "NÃO", "SIM", "SIM", "3.370", "R$ 3.151.888,96"],
    ["Areal", "Flávio Magdalena Bravo", "Marcos Antonio Ribeiro", "11.654", "0,68", "2", "1", "0", "3", "0,51", "1.291", "11,08", "0,09", "929", "7,97", "115,98", "71,96", "R$ 1.838.362,00", "1.850", "SIM", "SIM", "SIM", "203", "R$ 189.275,00"],
    ["Armação Dos Búzios", "Andre Granado ", "João De Melo Carrilho", "28.973", "0,73", "3", "1", "0", "4", "0,68", "2.354", "8,12", "0,16", "1.269", "4,38", "95,2", "53,91", "R$ 2.290.627,00", "3.082", "NÃO", "SIM", "SIM", "491", "R$ 458.896,40"],
    ["Arraial do Cabo", "Renato Martins Vianna", "Sergio Lopes De Oliveira Carvalho", "28.295", "0,73", "2", "1", "0", "3", "0,51", "2.300", "8,13", "0,16", "1.593", "5,63", "115,69", "69,26", "R$ 3.490.276,00", "4.495", "SIM", "SIM", "SIM", "511", "R$ 478.525,90"],
    ["Barra do Piraí", "Mario Reis Esteves", "Paloma Blunk Dos Reis", "95.726", "0,73", "4", "1", "0", "5", "0,85", "9.014", "9,42", "0,63", "4.457", "4,66", "83,23", "49,45", "R$ 9.116.182,00", "8.045", "SIM", "SIM", "SIM", "1.773", "R$ 1.651.046,79"],
    ["Barra Mansa", "Rodrigo Drable", "Ruth Cristina Coutinho Henriques De Lima Rebello", "178.880", "0,73", "6", "1", "1", "8", "1,36", "15.802", "8,83", "1,10", "6.435", "3,60", "74,04", "40,72", "R$ 12.581.416,00", "11.338", "SIM", "SIM", "SIM", "2.036", "R$ 1.904.454,20"],
    ["Belford Roxo", "Wagner Dos Santos Carneiro", "Daniela Moté De Souza Carneiro", "474.596", "0,68", "12", "3", "1", "16", "2,72", "59.726", "12,58", "4,18", "42.583", "8,97", "109,65", "71,3", "R$ 82.506.257,00", "73.171", "SIM", "SIM", "SIM", "8.187", "R$ 7.657.135,95"],
    ["Bom Jardim", "Antonio Claret Gonçalves Figueira", "Flávio De Almeida E Albuquerque", "25.738", "0,66", "3", "1", "0", "4", "0,68", "2.640", "10,26", "0,18", "986", "3,83", "60,31", "37,35", "R$ 1.789.077,00", "2.352", "SIM", "SIM", "SIM", "757", "R$ 709.309,00"],
    ["Bom Jesus do Itabapoana", "Roberto Elias Figueiredo Salim Filho", "Gisele Ferreira Da Silva Garcia", "35.677", "0,73", "3", "1", "0", "4", "0,68", "4.019", "11,26", "0,28", "2.947", "8,26", "114,49", "73,33", "R$ 5.090.019,00", "5.551", "SIM", "SIM", "SIM", "815", "R$ 759.627,45"],
    ["Cabo Frio", "Marquinho Mendes", "Romulo Vidal Dos Anjos", "195.197", "0,74", "8", "1", "0", "9", "1,53", "17.062", "8,74", "1,19", "9.350", "4,79", "91,18", "54,8", "R$ 20.736.423,00", "19.317", "SIM", "SIM", "SIM", "3.214", "R$ 3.005.628,72"],
    ["Cachoeiras de Macacu", "Mauro  Cezar De Castro Soares ", "Gilvana Azevedo Miranda", "55.139", "0,70", "3", "1", "0", "4", "0,68", "6.205", "11,25", "0,43", "4.555", "8,26", "116,65", "73,41", "R$ 10.571.956,00", "7.689", "SIM", "SIM", "SIM", "1.409", "R$ 1.315.072,05"],
    ["Cambuci", "Agnaldo Vieira Mello", "Fatima De Souza Vieira", "14.851", "0,69", "2", "1", "0", "3", "0,51", "2.031", "13,68", "0,14", "1.342", "9,04", "108,31", "66,08", "R$ 2.667.839,00", "2.560", "SIM", "SIM", "SIM", "348", "R$ 326.076,00"],
    ["Campos Dos Goytacazes", "Rafael Paes Barbosa Diniz Nogueira", "Sana Gimenes Alvarenga Domingues", "472.300", "0,72", "13", "3", "1", "17", "2,89", "55.809", "11,82", "3,90", "31.530", "6,68", "85,33", "56,5", "R$ 65.688.718,00", "58.009", "SIM", "SIM", "SIM", "8.836", "R$ 8.267.856,57"],
    ["Cantagalo", " Guga De Paula", "Jorge Braz Cardoso Ferreira", "19.830", "0,71", "3", "1", "0", "4", "0,68", "2.026", "10,22", "0,14", "1.071", "5,40", "82,13", "52,86", "R$ 2.035.484,00", "2.197", "SIM", "SIM", "SIM", "469", "R$ 437.813,80"],
    ["Carapebus", "Christiane Miranda De Andrade Cordeiro", "Cíntia Camargo Barcelos", "14.024", "0,71", "2", "1", "0", "3", "0,51", "1.276", "9,10", "0,09", "809", "5,77", "111,59", "63,4", "R$ 1.631.643,00", "1.901", "SIM", "SIM", "SIM", "275", "R$ 257.666,00"],
    ["Cardoso Moreira", "Gilson Nunes Siqueira", "Fausto Da Rocha Pereira", "12.601", "0,65", "2", "1", "0", "3", "0,51", "1.887", "14,98", "0,13", "926", "7,35", "82,31", "49,07", "R$ 1.603.250,00", "1.718", "SIM", "SIM", "SIM", "501", "R$ 469.437,00"],
    ["Carmo", "Cesar Ladeira ", "Silvio Murad De Onofre", "17.758", "0,7", "2", "1", "0", "3", "0,51", "2.091", "11,77", "0,15", "1.385", "7,80", "114,84", "66,24", "R$ 2.698.831,00", "2.642", "SIM", "SIM", "SIM", "349", "R$ 325.420,10"],
    ["Casimiro de Abreu", "Paulo Cezar Dames Passos", "Leila Marcia Barbosa De Souza", "37.340", "0,73", "3", "1", "0", "4", "0,68", "3.035", "8,13", "0,21", "1.701", "4,56", "91,75", "56,05", "R$ 3.463.798,00", "3.250", "SIM", "SIM", "SIM", "1.340", "R$ 1.254.840,88"],
    ["Comendador Levy Gasparian", "Valter Luis Lavinas Ribeiro", "Cristina Bonforte Serpa Vasconcelos", "8.219", "0,69", "2", "1", "0", "3", "0,51", "838", "10,20", "0,06", "411", "5,00", "90,33", "49,05", "R$ 819.196,00", "978", "SIM", "SIM", "SIM", "98", "R$ 91.826,00"],
    ["Conceição de Macabu", "Cláudio Eduardo Barbosa Linhares", "Marilia Nunes Bastos", "21.613", "0,71", "3", "1", "0", "4", "0,68", "2.250", "10,41", "0,16", "1.496", "6,92", "116,42", "66,49", "R$ 3.384.272,00", "3.017", "SIM", "SIM", "SIM", "592", "R$ 553.750,00"],
    ["Cordeiro", "Luciano Ramos Pinto", "Leticia Ramos Reis", "20.707", "0,73", "3", "1", "0", "4", "0,68", "1.636", "7,90", "0,11", "733", "3,54", "87,47", "44,8", "R$ 1.237.887,00", "2.010", "SIM", "SIM", "SIM", "429", "R$ 399.162,07"],
    ["Duas Barras", "Luiz Carlos Botelho Lutterbach", "Maria Eliza De Jesus Lutterbach", "11.020", "0,66", "2", "1", "0", "3", "0,51", "1.238", "11,23", "0,09", "572", "5,19", "79,01", "46,2", "R$ 1.081.991,00", "1.127", "SIM", "SIM", "SIM", "206", "R$ 193.022,00"],
    ["Duque de Caxias", "Washington Reis De Oliveira", "Aline Ferreira Batista Ribeiro", "867.067", "0,71", "11", "3", "1", "15", "2,55", "95.109", "10,97", "6,65", "54.140", "6,24", "88,43", "56,92", "R$ 97.616.398,00", "97.804", "NÃO", "SIM", "SIM", "25.265", "R$ 23.638.690,91"],
    ["Engenheiro Paulo de Frontin", "Jauldo De Souza Balthazar Ferreira", "Ana Paula Melo Gouvea Balthazar Ferreira", "13.408", "0,72", "2", "1", "0", "3", "0,51", "1.590", "11,86", "0,11", "1.029", "7,67", "110,53", "64,72", "R$ 2.615.341,00", "2.005", "SIM", "SIM", "SIM", "230", "R$ 210.433,00"],
    ["Guapimirim", "Jocelito Pereira De Oliveira ", "Paula Francinete Machado De Jesus", "53.527", "0,7", "3", "1", "0", "4", "0,68", "5.807", "10,85", "0,41", "4.213", "7,87", "116,06", "72,55", "R$ 9.052.990,00", "8.109", "NÃO", "SIM", "SIM", "714", "R$ 667.492,10"],
    ["Iguaba Grande", "Ana Grasiella Moreira Figueiredo Magalhães", "Nara Maria Damião Azeredo", "24.079", "0,76", "2", "1", "0", "3", "0,51", "2.353", "9,77", "0,16", "1.793", "7,45", "117,11", "76,2", "R$ 4.264.121,00", "3.733", "NÃO", "SIM", "SIM", "243", "R$ 227.691,00"],
    ["Itaboraí", "Sadinoel Oliveira Gomes Souza", "Wanderson Dias Pereira", "222.618", "0,69", "6", "1", "1", "8", "1,36", "25.050", "11,25", "1,75", "15.812", "7,10", "103,41", "63,12", "R$ 31.842.331,00", "24.947", "SIM", "SIM", "SIM", "5.456", "R$ 5.099.598,23"],
    ["Itaguaí", "Carlo Busatto Júnior", "Maria Izabel Lopes Ribeiro", "113.182", "0,72", "6", "1", "1", "8", "1,36", "11.446", "10,11", "0,80", "7.583", "6,70", "102,89", "66,25", "R$ 14.066.412,00", "13.667", "NÃO", "SIM", "SIM", "4.093", "R$ 3.827.688,98"],
    ["Italva", "Margareth De Souza Rodrigues Soares", "Arthur Aurelio Vieira Do Amaral", "14.281", "0,69", "2", "0", "0", "2", "0,34", "1.601", "11,21", "0,11", "1.004", "7,03", "111,93", "62,71", "R$ 1.970.611,00", "2.008", "NÃO", "SIM", "NÃO", "393", "R$ 368.241,00"],
    ["Itaocara", "Manoel Queiroz Faria", "Edilene Rodrigues Da Silva Sampaio", "22.884", "0,71", "3", "1", "0", "4", "0,68", "2.692", "11,76", "0,19", "1.303", "5,69", "73,7", "48,4", "R$ 2.332.672,00", "3.014", "SIM", "SIM", "SIM", "923", "R$ 859.138,75"],
    ["Itaperuna", "Marcus Vinícius De Oliveira Pinto", "Camila Andrade Pires", "97.219", "0,73", "5", "1", "0", "6", "1,02", "9.243", "9,51", "0,65", "3.893", "4,00", "71,37", "42,12", "R$ 6.575.893,00", "9.927", "SIM", "SIM", "SIM", "2.308", "R$ 2.158.849,20"],
    ["Itatiaia", "Eduardo Guedes Da Silva", "Raquel De Fátima Silva Rocha", "29.394", "0,74", "3", "1", "0", "4", "0,68", "2.624", "8,93", "0,18", "1.654", "5,63", "114,23", "63,03", "R$ 3.858.908,00", "3.631", "NÃO", "SIM", "SIM", "522", "R$ 488.487,00"],
    ["Japeri", "Carlos Moraes Costa", "Marcio Rodrigues Rosa", "97.337", "0,66", "7", "1", "0", "8", "1,36", "13.700", "14,07", "0,96", "9.238", "9,49", "101,52", "67,43", "R$ 17.810.246,00", "16.385", "SIM", "SIM", "SIM", "2.307", "R$ 2.158.272,95"],
    ["Laje do Muriaé", "Rivelino Da Silva Bueno", "Adilson Fernandes Da Silva", "7.424", "0,67", "2", "1", "0", "3", "0,51", "1.117", "15,05", "0,08", "662", "8,92", "91,44", "59,27", "R$ 1.162.613,00", "1.208", "NÃO", "SIM", "SIM", "194", "R$ 181.123,00"],
    ["Macaé", "Aluizio Dos Santos Junior", "Tatiana De Oliveira Pires", "217.951", "0,76", "7", "2", "1", "10", "1,70", "15.328", "7,03", "1,07", "7.156", "3,28", "78,43", "46,69", "R$ 11.160.431,00", "17.202", "SIM", "SIM", "SIM", "3.347", "R$ 3.130.011,76"],
    ["Macuco", "Bruno Boaretto", "Claudia Bonan Taveira Pinaud", "5.327", "0,7", "2", "0", "0", "2", "0,34", "587", "11,02", "0,04", "366", "6,87", "101,39", "62,35", "R$ 614.144,00", "1.206", "SIM", "SIM", "NÃO", "140", "R$ 130.430,40"],
    ["Magé", "Rafael Santos De Souza (Rafael Tubarão)", "Bianca Gonçalves Vasconcellos De Souza", "230.568", "0,71", "8", "1", "1", "10", "1,70", "26.574", "11,53", "1,86", "16.589", "7,19", "102,51", "62,43", "R$ 32.366.723,00", "34.262", "SIM", "SIM", "SIM", "6.106", "R$ 5.706.150,36"],
    ["Mangaratiba", "Aarão De Moura Brito Neto", "Leandro De Paula Silva", "38.201", "0,75", "6", "1", "0", "7", "1,19", "3.128", "8,19", "0,22", "1.995", "5,22", "96,42", "63,78", "R$ 3.998.127,00", "4.048", "SIM", "SIM", "SIM", "517", "R$ 484.429,00"],
    ["Maricá", "Fabiano Taques Horta", "Jorge Luiz Cordeiro Da Costa", "135.121", "0,77", "8", "1", "0", "9", "1,53", "9.876", "7,31", "0,69", "6.108", "4,52", "99,76", "61,85", "R$ 10.286.622,00", "19.298", "SIM", "SIM", "SIM", "3.125", "R$ 2.926.628,50"],
    ["Mendes", "Rogério Riente", "Ana Luiza Matias De Oliveira", "18.024", "0,74", "3", "1", "0", "4", "0,68", "1.791", "9,94", "0,13", "1.075", "5,96", "103,86", "60,02", "R$ 2.250.519,00", "2.184", "SIM", "SIM", "SIM", "441", "R$ 410.140,34"],
    ["Mesquita", "Jorge Lúcio Ferreira Miranda", "Luiza Cristina Quaresma De Oliveira Vaz", "169.537", "0,74", "5", "1", "0", "6", "1,02", "17.392", "10,26", "1,22", "10.361", "6,11", "94,55", "59,57", "R$ 22.800.769,00", "17.808", "SIM", "SIM", "SIM", "6.728", "R$ 6.296.283,60"],
    ["Miguel Pereira", "Andre Portugues ", "Adriana Pinto De Afonseca", "24.754", "0,75", "2", "1", "0", "3", "0,51", "2.399", "9,69", "0,17", "1.516", "6,12", "113,9", "63,19", "R$ 3.628.190,00", "3.159", "NÃO", "SIM", "SIM", "566", "R$ 529.125,00"],
    ["Miracema", "Clovis Tostes De Barros", "Sérgio Salim Amim", "26.810", "0,71", "2", "1", "0", "3", "0,51", "2.694", "10,05", "0,19", "1.896", "7,07", "113,46", "70,38", "R$ 4.250.157,00", "3.171", "SIM", "SIM", "SIM", "706", "R$ 657.765,85"],
    ["Natividade", "Severiano Antônio Dos Santos Rezende", "Marcelo Luis Nogueira Pavanelli", "15.076", "0,73", "2", "1", "0", "3", "0,51", "1.711", "11,35", "0,12", "1.122", "7,44", "107,06", "65,58", "R$ 2.235.730,00", "2.125", "SIM", "SIM", "SIM", "405", "R$ 377.611,35"],
    ["Nilópolis", "Farid Abrão", "Michelle Azeredo Da Silva", "157.986", "0,75", "6", "1", "0", "7", "1,19", "13.342", "8,45", "0,93", "8.107", "5,13", "99,53", "60,76", "R$ 17.695.969,00", "12.782", "NÃO", "SIM", "SIM", "7.293", "R$ 6.821.018,30"],
    ["Niterói", "Rodrigo Neves Barreto", "Verônica Dos Santos Lima", "491.807", "0,84", "10", "2", "1", "13", "2,21", "25.478", "5,18", "1,78", "14.482", "2,94", "93,8", "56,84", "R$ 30.556.902,00", "27.203", "NÃO", "SIM", "SIM", "9.319", "R$ 8.723.777,46"],
    ["Nova Friburgo", "Renato Pinheiro Bravo", "Christiano Pereira Huguenin", "183.391", "0,75", "4", "1", "0", "5", "0,85", "11.917", "6,50", "0,83", "5.121", "2,79", "84,06", "42,97", "R$ 10.140.997,00", "13.895", "SIM", "SIM", "SIM", "2.557", "R$ 2.393.992,79"],
    ["Nova Iguaçu", "Rogerio Lisboa", "Alexandre Alverca", "801.746", "0,71", "10", "4", "1", "15", "2,55", "93.918", "11,71", "6,57", "49.277", "6,15", "78,87", "52,47", "R$ 118.881.156,00", "85.412", "SIM", "SIM", "SIM", "16.938", "R$ 15.826.539,84"],
    ["Paracambi", "Lucimar Cristina Da Silva Ferreira", "Aline Otilia Soares Ferreira Benevenuto", "48.129", "0,72", "5", "1", "0", "6", "1,02", "5.237", "10,88", "0,37", "4.016", "8,34", "116,91", "76,69", "R$ 10.615.955,00", "5.881", "NÃO", "SIM", "SIM", "2.603", "R$ 2.437.868,70"],
    ["Paraíba do Sul", "Alessandro Cronge Bouzada", "Elaine Cristina Arruda Aguiar", "41.639", "0,7", "2", "1", "0", "3", "0,51", "4.501", "10,81", "0,31", "1.863", "4,47", "70,46", "41,39", "R$ 3.324.539,00", "3.438", "SIM", "SIM", "SIM", "961", "R$ 898.021,80"],
    ["Paraty", "Carlos José Gama Miranda", "Valdecir Machado Ramiro", "38.740", "0,69", "2", "1", "0", "3", "0,51", "3.482", "8,99", "0,24", "2.107", "5,44", "108,05", "60,51", "R$ 4.572.123,00", "4.937", "SIM", "SIM", "SIM", "810", "R$ 757.769,67"],
    ["Paty do Alferes", "Eurico Pinheiro Bernardes Neto", "Jeanne Marisete Teixeira Bernardes", "26.575", "0,67", "2", "1", "0", "3", "0,51", "3.484", "13,11", "0,24", "2.195", "8,26", "95,68", "63", "R$ 4.310.093,00", "3.783", "SIM", "SIM", "SIM", "603", "R$ 564.075,00"],
    ["Petrópolis", "Bernardo Rossi", "Denise Maria Respeita Quintella Coelho", "297.192", "0,75", "8", "1", "1", "10", "1,70", "24.219", "8,15", "1,69", "10.430", "3,51", "74,32", "43,07", "R$ 21.721.595,00", "21.763", "NÃO", "SIM", "SIM", "4.972", "R$ 4.645.727,61"],
    ["Pinheiral", "Ednardo Barbosa Oliveira", "Patricia Rivello Garcia", "23.208", "0,72", "2", "1", "0", "3", "0,51", "2.481", "10,69", "0,17", "1.734", "7,47", "104,33", "69,89", "R$ 4.293.918,00", "2.993", "NÃO", "SIM", "SIM", "216", "R$ 198.223,55"],
    ["Piraí", "Luiz Antonio Da Silva Neves", "Heloisa Souza Lima Machado", "26.948", "0,71", "2", "1", "0", "3", "0,51", "2.943", "10,92", "0,21", "1.538", "5,71", "86,11", "52,26", "R$ 3.537.225,00", "2.572", "SIM", "SIM", "SIM", "620", "R$ 575.556,94"],
    ["Porciúncula", "Leonardo Paes Barreto Coutinho", "Maria Antonieta Gomes Correa", "18.034", "0,7", "3", "1", "0", "4", "0,68", "2.288", "12,69", "0,16", "1.256", "6,96", "78,89", "54,9", "R$ 2.514.644,00", "2.782", "SIM", "SIM", "SIM", "487", "R$ 454.671,63"],
    ["Porto Real", "Jorge Serfiotis", "Valéria Ribeiro De Carvalho", "17.272", "0,71", "2", "1", "0", "3", "0,51", "1.568", "9,08", "0,11", "946", "5,48", "116,07", "60,33", "R$ 2.471.998,00", "2.235", "NÃO", "SIM", "SIM", "225", "R$ 210.825,00"],
    ["Quatis", "Raimundo De Souza", "Rosana Luisa De Bem Almeida", "13.105", "0,69", "2", "1", "0", "3", "0,51", "1.221", "9,32", "0,09", "692", "5,28", "94,28", "56,67", "R$ 1.415.414,00", "1.353", "SIM", "SIM", "SIM", "247", "R$ 231.158,00"],
    ["Queimados", "Carlos De França Vilela", "Elton Teixeira Rosa Da Silva", "140.374", "0,68", "8", "1", "0", "9", "1,53", "17.193", "12,25", "1,20", "12.509", "8,91", "111,32", "72,76", "R$ 25.608.505,00", "23.311", "SIM", "SIM", "SIM", "6.189", "R$ 5.792.183,15"],
    ["Quissamã", "Maria De Fátima Pacheco", "Tania Regina Dos Santos Magalhães", "21.234", "0,7", "2", "1", "0", "3", "0,51", "2.364", "11,13", "0,17", "1.463", "6,89", "100,9", "61,89", "R$ 2.875.009,00", "3.188", "SIM", "SIM", "SIM", "528", "R$ 493.799,40"],
    ["Resende", "Diogo Balieiro Diniz", "Jéssica Pavone Carrijo Muller", "122.068", "0,77", "6", "1", "1", "8", "1,36", "9.015", "7,39", "0,63", "2.418", "1,98", "47,6", "26,82", "R$ 4.288.277,00", "9.501", "SIM", "SIM", "SIM", "2.237", "R$ 2.090.523,97"],
    ["Rio Bonito", "José Luiz Alves Antunes", "Lílian De Araujo Alves Antunes", "56.436", "0,71", "3", "1", "0", "4", "0,68", "5.699", "10,10", "0,40", "3.469", "6,15", "96,85", "60,87", "R$ 7.385.025,00", "6.998", "SIM", "SIM", "SIM", "1.738", "R$ 1.626.062,10"],
    ["Rio Claro", "José Osmar De Almeida", "Julio Cesar Rocha De Camargo Castro", "17.606", "0,68", "2", "1", "0", "3", "0,51", "1.928", "10,95", "0,13", "631", "3,58", "50,76", "32,73", "R$ 1.025.388,00", "1.521", "SIM", "SIM", "SIM", "235", "R$ 220.195,00"],
    ["Rio Das Flores", "Vicente De Paula De Souza Guedes", "Tereza Cristina Meyer Cabral Machado", "8.703", "0,68", "2", "1", "0", "3", "0,51", "1.018", "11,70", "0,07", "627", "7,20", "116,54", "61,59", "R$ 1.440.662,00", "1.303", "NÃO", "SIM", "SIM", "129", "R$ 119.936,00"],
    ["Rio Das Ostras", "Carlos Augusto Carvalho Balthazar", "Elizabeth Bousquet Schott", "116.134", "0,77", "4", "1", "0", "5", "0,85", "7.107", "6,12", "0,50", "4.822", "4,15", "116,78", "67,85", "R$ 8.774.782,00", "13.369", "SIM", "SIM", "SIM", "1.572", "R$ 1.471.296,91"],
    ["Rio de Janeiro", "Marcelo Bezerra Crivella", "Maria Teresa Bergher", "6.390.290", "0,8", "47", "14", "2", "63", "10,71", "458.625", "7,18", "32,06", "237.054", "3,71", "80,82", "51,69", "R$ 424.256.328,00", "487.222", "NÃO", "SIM", "SIM", "106.618", "R$ 99.771.463,98"],
    ["Santa Maria Madalena", "Carlos Alberto De Matos Botelho", "Carlos Roberto Mello Lula Lamego", "10.298", "0,67", "3", "0", "0", "3", "0,51", "1.291", "12,54", "0,09", "590", "5,73", "71,17", "45,7", "R$ 1.270.459,00", "1.140", "SIM", "SIM", "NÃO", "262", "R$ 245.494,00"],
    ["Santo Antônio de Pádua", "Josias Quintal De Oliveira", "Maria Tertuliana De Souza Oliveira", "40.876", "0,72", "2", "1", "0", "3", "0,51", "4.602", "11,26", "0,32", "2.164", "5,29", "85,77", "47,02", "R$ 4.305.828,00", "4.237", "SIM", "SIM", "SIM", "1.209", "R$ 1.126.626,01"],
    ["São Fidélis", "Amarildo Henrique Alcântara", "Victor Mauro Cruz", "37.657", "0,69", "2", "1", "0", "3", "0,51", "4.207", "11,17", "0,29", "3.049", "8,10", "114,32", "72,47", "R$ 6.300.913,00", "5.501", "SIM", "SIM", "SIM", "710", "R$ 664.334,00"],
    ["São Francisco de Itabapoana", "Francimara Azeredo Da Silva Barbosa Lemos ", "Fagner Azeredo Da Silva", "41.386", "0,64", "3", "1", "0", "4", "0,68", "7.416", "17,92", "0,52", "4.195", "10,14", "76,61", "56,57", "R$ 6.812.086,00", "7.573", "NÃO", "SIM", "SIM", "1.363", "R$ 1.273.937,13"],
    ["São Gonçalo", "José Luiz Nanci", "Marlos Luiz De Araujo Costa", "1.016.128", "0,74", "18", "5", "2", "25", "4,25", "91.133", "8,97", "6,37", "61.267", "6,03", "111,87", "67,23", "R$ 130.037.585,00", "107.357", "SIM", "SIM", "SIM", "12.912", "R$ 12.084.915,34"],
    ["São João da Barra", "Carla Maria Machado Dos Santos", "Claudia Maria Falcao Carvalho", "33.512", "0,67", "5", "1", "0", "6", "1,02", "4.192", "12,51", "0,29", "2.821", "8,42", "103,22", "67,29", "R$ 7.536.328,00", "5.078", "SIM", "SIM", "SIM", "1.294", "R$ 1.212.104,00"],
    ["São João de Meriti", "João Ferreira Neto", "Roberta Ferreira De Queiroz", "460.062", "0,72", "6", "2", "1", "9", "1,53", "46.733", "10,16", "3,27", "19.573", "4,25", "69,37", "41,88", "R$ 35.788.180,00", "36.160", "NÃO", "SIM", "SIM", "10.889", "R$ 10.191.730,37"],
    ["São José de Ubá", "Marcionilio Botelho Moreira", "Maria Adriana Silva Verdan Moreira", "7.093", "0,65", "2", "0", "0", "2", "0,34", "1.185", "16,71", "0,08", "708", "9,98", "90,42", "59,75", "R$ 1.229.646,00", "1.312", "SIM", "SIM", "NÃO", "103", "R$ 96.511,00"],
    ["São José do Vale do Rio Preto", "Gilberto Martins Esteves", "Aparecida De Fatima Moreira Esteves", "20.540", "0,66", "1", "1", "0", "2", "0,34", "2.608", "12,70", "0,18", "1.352", "6,58", "88,83", "51,84", "R$ 2.603.041,00", "2.930", "NÃO", "SIM", "SIM", "838", "R$ 783.052,40"],
    ["São Pedro da Aldeia", "Cláudio Vasque Chumbinho Dos Santos", "Ester Marques Chumbinho Dos Santos", "91.542", "0,71", "6", "1", "0", "7", "1,19", "8.722", "9,53", "0,61", "5.263", "5,75", "101,29", "60,34", "R$ 11.064.311,00", "10.750", "SIM", "SIM", "SIM", "2.263", "R$ 2.119.185,30"],
    ["São Sebastião do Alto", "Carlos Otavio Da Silva Rodrigues", "Ely Pinto Lopes", "8.970", "0,65", "2", "1", "0", "3", "0,51", "1.237", "13,79", "0,09", "744", "8,29", "99,6", "60,15", "R$ 1.306.516,00", "1.398", "SIM", "SIM", "SIM", "229", "R$ 214.386,00"],
    ["Sapucaia", "Fabricio Dos Santos Baião", "Cleuza Rodrigues Galluzzi", "17.581", "0,68", "5", "1", "0", "6", "1,02", "2.068", "11,76", "0,14", "1.159", "6,59", "84,66", "56,04", "R$ 2.267.600,00", "2.851", "SIM", "SIM", "SIM", "354", "R$ 331.230,00"],
    ["Saquarema", "Manoela Ramos De Souza Gomes Alves", "Eliane Alves De Aquino", "77.522", "0,71", "4", "1", "0", "5", "0,85", "7.892", "10,18", "0,55", "3.685", "4,75", "75,9", "46,69", "R$ 6.544.950,00", "7.603", "SIM", "SIM", "SIM", "3.055", "R$ 2.860.828,95"],
    ["Seropédica", "Anabal Barbosa De Souza", "Fernanda Raquel Dos Santos Monteiro Moffati", "80.138", "0,71", "4", "1", "0", "5", "0,85", "8.205", "10,24", "0,57", "5.757", "7,18", "113,44", "70,16", "R$ 10.982.641,00", "9.603", "SIM", "SIM", "SIM", "689", "R$ 645.219,00"],
    ["Silva Jardim", "Wanderson Gimenes Alexandre", "Sebastião Da Silva Rocha", "21.362", "0,65", "2", "1", "0", "3", "0,51", "3.061", "14,33", "0,21", "2.418", "11,32", "111,43", "78,99", "R$ 5.188.733,00", "4.180", "SIM", "SIM", "SIM", "506", "R$ 474.113,00"],
    ["Sumidouro", "Eliésio Peres Da Silva", "Victória Dos Santos Pereira", "15.010", "0,61", "2", "1", "0", "3", "0,51", "2.152", "14,34", "0,15", "1.600", "10,66", "114,53", "74,35", "R$ 2.814.238,00", "3.069", "NÃO", "SIM", "SIM", "238", "R$ 223.006,00"],
    ["Tanguá", "Valber Luiz Marcelo De Carvalho", "Felippe Matos Monteiro", "31.438", "0,65", "5", "1", "0", "6", "1,02", "4.241", "13,49", "0,30", "3.002", "9,55", "108,3", "70,79", "R$ 6.017.276,00", "5.087", "SIM", "SIM", "SIM", "718", "R$ 670.512,75"],
    ["Teresópolis", "Mario De Oliveira Tricano", "Carla Cavalcanti Tricano", "167.622", "0,73", "5", "1", "0", "6", "1,02", "14.725", "8,78", "1,03", "5.807", "3,46", "68,13", "39,44", "R$ 11.203.527,00", "12.945", "SIM", "SIM", "SIM", "3.254", "R$ 3.042.904,60"],
    ["Trajano de Moraes", "Rodrigo Freire Viana", "Juliana Pais Esteves Freire Viana", "10.327", "0,67", "2", "1", "0", "3", "0,51", "1.401", "13,57", "0,10", "959", "9,29", "107,51", "68,45", "R$ 1.849.666,00", "1.492", "NÃO", "SIM", "SIM", "287", "R$ 268.919,00"],
    ["Três Rios", "Josimar Salles", "Gilberto Garcia Golfeto", "78.256", "0,73", "4", "1", "0", "5", "0,85", "7.155", "9,14", "0,50", "5.054", "6,46", "114,79", "70,64", "R$ 12.587.620,00", "10.751", "SIM", "SIM", "SIM", "1.001", "R$ 936.026,02"],
    ["Valença", " Luiz Fernando Furtado Da Graça", "Roseli Da Silva Moreira", "72.679", "0,74", "3", "1", "0", "4", "0,68", "7.213", "9,92", "0,50", "5.023", "6,91", "116,54", "69,64", "R$ 11.329.336,00", "8.463", "SIM", "SIM", "SIM", "1.462", "R$ 1.359.761,06"],
    ["Varre-sai", "Silvestre José Gorini", "Isabela Louvain Fabri Moraes", "9.720", "0,66", "2", "0", "0", "2", "0,34", "1.352", "13,91", "0,09", "879", "9,04", "101,97", "65,01", "R$ 1.575.692,00", "1.562", "SIM", "SIM", "NÃO", "178", "R$ 166.786,00"],
    ["Vassouras", "Severino Ananias Dias Filho", "Rosa Maria Coelho De Almeida", "34.858", "0,71", "3", "1", "0", "4", "0,68", "3.509", "10,07", "0,25", "1.586", "4,55", "73,49", "45,2", "R$ 2.825.859,00", "3.390", "SIM", "SIM", "SIM", "853", "R$ 792.328,36"],
    ["Volta Redonda", "Elderson Ferreira Da Silva ", "Maycon César Inácio Abrantes", "260.180", "0,77", "33", "1", "1", "35", "5,95", "17.858", "6,86", "1,25", "10.966", "4,21", "115,49", "61,41", "R$ 24.633.994,00", "22.609", "SIM", "SIM", "SIM", "3.439", "R$ 3.199.831,11"],
    ["ESTADO DO RIO DE JANEIRO", "Luiz Fernando de Souza", "Gustavo Reis Ferreira", "16.231.365", "0,76", "453", "116", "19", "588", "100", "1.430.427", "", "", "804.641", "", "", "", "R$ 1.588.104.562,00", "1.560.055", "", "", "", "319.056", "R$ 298.419.232,44"],
  ];

}

// TODO refatorar como serviço
interface IIndicadoresOrcamentarios {
  municipio:             string;
  pseUtilizado:          number;
  pseNaoUtilizado:       number;
  pseTotal:              number;
  psbUtilizado:          number;
  psbNaoUtilizado:       number;
  psbTotal:              number;
  programasUtilizado:    number;
  programasNaoUtilizado: number;
  programasTotal:        number;
}

// TODO refatorar como serviço
interface IIDH {
  municipio: string;
  idh:       number;
}

// TODO refatorar como serviço
interface IPopulacao {
  municipio: string;
  populacao: number;
}

// TODO refatorar como serviço
interface IEquipamento {
  tipo:      string;
  municipio: string;
  porte:     string;
  nome:      string;
  endereco:  string;
  cep:       string;
  telefone:  string;
}

// TODO refatorar como serviço
interface IIndicadoresSociais {
  municipio:                         string;
  prefeito:                          string;
  secretarioAssistenciaSocial:       string;
  nFamiliasVulneraveis:              string;
  pFamiliasVulneraveisMunicipio:     string;
  pFamiliasVulneraveisEstado:        string;
  nFamiliasBolsaFamilia:             string;
  pFamiliasBolsaFamiliaMunicipio:    string;
  pFamiliasBolsaFamiliaCobertura:    string;
  nFamiliasCadastroUnico:            string;
  nBeneficiariosPrestacaoContinuada: string;
  cadUnicoBeneficiosEventuais:       boolean;
  cadUnicoPAIF:                      boolean;
  cadUnicoPAEF:                      boolean;
}
