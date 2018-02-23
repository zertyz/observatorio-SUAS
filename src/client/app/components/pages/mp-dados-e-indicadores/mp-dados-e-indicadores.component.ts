// libs
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {DataGridModule} from 'primeng/primeng';

import { ActivatedRoute } from '@angular/router';

import { Injector, Injectable, Input } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

// services
import { DadosEIndicadoresService }   from '../../../shared/modules/m-observatorio-suas/services/dados-e-indicadores.service';
import { IDadosGerais }               from '../../../shared/modules/m-observatorio-suas/services/IDadosGerais';
import { IIndicadoresOrcamentarios }  from '../../../shared/modules/m-observatorio-suas/services/IIndicadoresOrcamentarios';
import { IEquipamento }               from '../../../shared/modules/m-observatorio-suas/services/IEquipamento';
import { IIndicadoresSociais }        from '../../../shared/modules/m-observatorio-suas/services/IIndicadoresSociais';


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
  estadoId:       string = 'Rio de Janeiro - RJ';     // Esta string deve constar como 'nome do município' nos dados, para apresentar dados de todo o estado. Também é usada no componente MAPA.
  estadoSelected: boolean = true;

  //Campo selecionado nos botões no menu de equipamentos
  equipamentoSelecionado: string = 'equipamento';
  indicadores :DadosEIndicadoresService;
  // campos computados
  indicadoresOrcamentarios: IIndicadoresOrcamentarios;
  indicadoresSociais:      	IIndicadoresSociais;
  dadosGerais:              IDadosGerais;
  equipamentos:             IEquipamento[];
  contagemCentrosPOP:       number;
  contagemCRAS:             number;
  contagemCREAS:            number;
  contagemEquipamentos:     number;
  totalEquipamentosEstado:  number;
  graficoPSEalto:           any;
  graficoPSEmedio:          any;
  graficoPSB:               any;
  graficoProgramas:         any;
  graficoGestaoSUAS:        any;
  graficoGestaoBolsaFamilia:any;
  graficoPisoBasicoFixo:    any;
  graficoPisoBasicoVariavel:any;
  graficoPisoAlto1:         any;
  graficoPisoAlto2:         any;
  graficoPisoTransicao:     any;
  graficoResumoOrcamentario:any;

  //Blocos trazidos do JSON
  blocoDadosGerais: IDadosGerais[] = [];
  blocoIndicadoresSociais: IIndicadoresSociais[] = [];
  blocoIndicadoresOrcamentarios: IIndicadoresOrcamentarios[] = [];
  crases: IEquipamento[] = [];
  creases: IEquipamento[] = [];
  centrosPOP: IEquipamento[] = [];

  private errorMessage: string = null;

  opcoesGraficos: any = {
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    }
  };

  constructor(private dadosEIndicadoresService: DadosEIndicadoresService,
              private injector: Injector,
              public routerext: RouterExtensions,
              private route: ActivatedRoute) {
    this.dadosGerais = {
      'municipio': '§ não encontrado §',
      'prefeito': '§ não encontrado §',
      'secretarioAssistenciaSocial': '§ não encontrado §',
      'populacao': -1,
      'idh': -1,
      'idc': -1
    };
    this.indicadoresSociais = {
      'municipio': '§ não encontrado §',
      'contagemCRAS': '§ não encontrado §',
      'contagemCREAS': '§ não encontrado §',
      'contagemCentrosPOP': '§ não encontrado §',
      'totalEquipamentosEstado': '§ não encontrado §',
      'pEquipamentosEstado': '§ não encontrado §',
      'nFamiliasVulneraveis': '§ não encontrado §',
      'pFamiliasVulneraveisMunicipio': '§ não encontrado §',
      'pFamiliasVulneraveisEstado': '§ não encontrado §',
      'nFamiliasBolsaFamilia': '§ não encontrado §',
      'pFamiliasBolsaFamiliaMunicipio': '§ não encontrado §',
      'pFamiliasBolsaFamiliaEstado': '§ não encontrado §',
      'pFamiliasBolsaFamiliaCobertura': '§ não encontrado §',
      'pFamiliasCadastroUnicoCobertura': '§ não encontrado §',
      'bolsaFamiliaValorTotalRepassado': '§ não encontrado §',
      'nFamiliasCadastroUnico': '§ não encontrado §',
      'pCadastroUnicoMunicipio': '§ não encontrado §',
      'pCadastroUnicoEstado': '§ não encontrado §',
      'cadUnicoBeneficiosEventuais': false,
      'cadUnicoPAIF': false,
      'cadUnicoPAEFI': false,
      'nBeneficiariosPrestacaoContinuada': '§ não encontrado §',
      'bpcValorTotalRepassado': '§ não encontrado §',
      'nivelGestao': '§ não encontrado §'
    };

    this.indicadoresOrcamentarios = {
      'anoOrcamento': -2,
      'municipio': '§ não encontrado §',
      'programasTotal': -2,
      'programasNaoUtilizado': -2,
      'programasUtilizado': -2,
      'pseMediaComplexidadeTotal': -2,
      'pseMediaComplexidadeNaoUtilizado': -2,
      'pseMediaComplexidadeUtilizado': -2,
      'pseAltaComplexidadeTotal': -2,
      'pseAltaComplexidadeNaoUtilizado': -2,
      'pseAltaComplexidadeUtilizado': -2,
      'psbTotal': -2,
      'psbNaoUtilizado': -2,
      'psbUtilizado': -2,
      'gestaoSuasTotal': -2,
      'gestaoSuasNaoUtilizado': -2,
      'gestaoSuasUtilizado': -2,
      'gestaoBolsaFamiliaTotal': -2,
      'gestaoBolsaFamiliaNaoUtilizado': -2,
      'gestaoBolsaFamiliaUtilizado': -2,
      'pisoBasicoFixoTotal': -2,
      'pisoBasicoFixoNaoUtilizado': -2,
      'pisoBasicoFixoUtilizado': -2,
      'pisoBasicoVariavelTotal': -2,
      'pisoBasicoVariavelNaoUtilizado': -2,
      'pisoBasicoVariavelUtilizado': -2,
      'pisoAltaComplexidade1Total': -2,
      'pisoAltaComplexidade1NaoUtilizado':-2,
      'pisoAltaComplexidade1Utilizado': -2,
      'pisoAltaComplexidade2Total': -2,
      'pisoAltaComplexidade2NaoUtilizado': -2,
      'pisoAltaComplexidade2Utilizado': -2,
      'pisoTransicaoMediaComplexidadeTotal': -2,
      'pisoTransicaoMediaComplexidadeNaoUtilizado': -2,
      'pisoTransicaoMediaComplexidadeUtilizado': -2,
      'totalPago': -2,
      'totalBloqueado':-2,
      'totalUtilizado':-2,
      'pBloqueio': -2,
    };

    this.equipamentos = [];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.municipio = params['municipio'] || this.estadoId;
      if(this.municipio === this.estadoId) {
        this.estadoSelected = true;
      }else {
        this.estadoSelected = false;
      }

      this.computaCampos();

      document.getElementById('check1').click();//Equipamento Total

    });
    this.dadosEIndicadoresService.fetchCRAS().subscribe( response=> {
      this.crases = response;
    },error => this.errorMessage = < any > error)

    this.dadosEIndicadoresService.fetchCREAS().subscribe( response=> {
        this.creases = response;
      },error => this.errorMessage = < any > error)


    this.dadosEIndicadoresService.fetchCentroPop().subscribe( response=> {
        this.centrosPOP = response;
      },error => this.errorMessage = < any > error)

  }

  // computa campos assim que for resolvido o parâmetro 'municipio'
  computaCampos() {

    // computa equipamentos
    this.contagemCentrosPOP   = 0;
    this.contagemCRAS         = 0;
    this.contagemCREAS        = 0;
    this.contagemEquipamentos = 0;

    //preenche
    this.dadosEIndicadoresService.fetchDadosGerais().subscribe(response => {
      this.blocoDadosGerais = response;
      if(this.blocoDadosGerais!=undefined){
        this.dadosGerais = this.blocoDadosGerais.find(e => e.municipio == this.municipio);
      }
    }, error => this.errorMessage = < any > error);

    // preenche indicadoresOrçamentários
    this.dadosEIndicadoresService.fetchIndicadoresSociais().subscribe(response => {
      this.blocoIndicadoresSociais = response;
      if(this.blocoIndicadoresSociais!=undefined){
        this.indicadoresSociais = this.blocoIndicadoresSociais.find(e => e.municipio == this.municipio);
      }
    }, error => this.errorMessage = < any > error);

    //preenche gráfico de indicadoresOrçamentários
    this.dadosEIndicadoresService.fetchIndicadoresOrcamentarios().subscribe(response => {
      this.blocoIndicadoresOrcamentarios = response;
      if(this.blocoIndicadoresOrcamentarios!=undefined){
        this.indicadoresOrcamentarios = this.blocoIndicadoresOrcamentarios.find(e => e.municipio == this.municipio && e.anoOrcamento == 2017);
      }
      this.graficoPSEalto = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.pseAltaComplexidadeUtilizado, this.indicadoresOrcamentarios.pseAltaComplexidadeNaoUtilizado],
            backgroundColor: [
              '#117011',
              '#660000'
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ],
          }
        ],
      };

      this.graficoPSEmedio = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.pseMediaComplexidadeUtilizado, this.indicadoresOrcamentarios.pseMediaComplexidadeNaoUtilizado],
            backgroundColor: [
              '#117011',
              '#660000'
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ],
          }
        ],
      };
      // preenche estrutura de dados do gráfico Piso
      this.graficoPisoBasicoFixo = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.pisoBasicoFixoUtilizado, this.indicadoresOrcamentarios.pisoBasicoFixoNaoUtilizado],
            backgroundColor: [
              '#117011',
              '#660000'
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ],
          }
        ],
      };

      this.graficoPisoBasicoVariavel = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.pisoBasicoVariavelUtilizado, this.indicadoresOrcamentarios.pisoBasicoVariavelNaoUtilizado],
            backgroundColor: [
              '#117011',
              '#660000'
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ],
          }
        ],
      };

      this.graficoPisoAlto1 = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.pisoAltaComplexidade1Utilizado, this.indicadoresOrcamentarios.pisoAltaComplexidade1NaoUtilizado],
            backgroundColor: [
              '#117011',
              '#660000'
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ],
          }
        ],
      };

      this.graficoPisoAlto2 = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.pisoAltaComplexidade2Utilizado, this.indicadoresOrcamentarios.pisoAltaComplexidade2NaoUtilizado],
            backgroundColor: [
              '#117011',
              '#660000'
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ],
          }
        ],
      };

      this.graficoPisoTransicao = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.pisoBasicoFixoUtilizado, this.indicadoresOrcamentarios.pisoBasicoFixoNaoUtilizado],
            backgroundColor: [
              '#117011',
              '#660000'
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ],
          }
        ],
      };

//preenche estrutura de dados do gráfico Gestão Bolsa Familia
      this.graficoGestaoBolsaFamilia = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.gestaoBolsaFamiliaUtilizado, this.indicadoresOrcamentarios.gestaoBolsaFamiliaNaoUtilizado],
            backgroundColor: [
              '#117011',
              '#660000'
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ],
          }
        ],
      };

//preenche estrutura de dados do gráfico gestão  SUAS
      this.graficoGestaoSUAS = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.gestaoSuasUtilizado, this.indicadoresOrcamentarios.gestaoSuasNaoUtilizado],
            backgroundColor: [
              '#117011',
              '#660000'
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ],
          }
        ],
      };

      // preenche estrutura de dados do gráfico PSB
      this.graficoPSB = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.psbUtilizado, this.indicadoresOrcamentarios.psbNaoUtilizado],
            backgroundColor: [
              '#117011',
              '#660000'
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ]
          }
        ]
      };

      // preenche estrutura de dados do gráfico Resumo Orcamentario
      this.graficoResumoOrcamentario = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.totalUtilizado, this.indicadoresOrcamentarios.totalBloqueado],
            backgroundColor: [
              '#117011',
              '#660000',
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ]
          }
        ]
      };
      // preenche estrutura de dados do gráfico Programas
      this.graficoProgramas = {
        labels: ['Verba Utilizada', 'Verba não utilizada'],
        datasets: [
          {
            data: [this.indicadoresOrcamentarios.programasTotal, this.indicadoresOrcamentarios.programasNaoUtilizado],
            backgroundColor: [
              '#117011',
              '#660000',
            ],
            hoverBackgroundColor: [
              '#117011',
              '#660000'
            ]
          }
        ]
      };
    }, error => this.errorMessage = < any > error);


    this.dadosEIndicadoresService.fetchCREAS().subscribe(response => {
      this.creases = response;
      if(this.creases!=undefined){
        this.equipamentos = [] ;
        this.equipamentos = this.equipamentos.concat(this.creases
          .filter(creas => this.estadoSelected || creas.municipio.toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
          .map(creas => {
            this.contagemCREAS++;
            this.contagemEquipamentos++;
            return {
              tipo:      'CREAS',
              municipio: creas['municipio'],
              porte:     creas['porte'],
              nome:      creas['nome'].toLocaleUpperCase(),
              endereco: `${creas['tipoLogradouro']} ${creas['endereco']
                          .replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)},
                         ${creas['numero']} - ${creas['bairro']
                          .replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)} 
                       - ${creas['municipio']}`,
              cep:       creas['cep'],
              telefone:  creas['telefone'],
            };
          }));
      }
    }, error => this.errorMessage = < any > error);

    this.dadosEIndicadoresService.fetchCentroPop().subscribe(response => {
      this.centrosPOP = response;
      if(this.centrosPOP!=undefined){
        this.equipamentos = this.equipamentos.concat(this.centrosPOP
          .filter(centroPOP => this.estadoSelected || centroPOP.municipio.toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
          .map(centroPOP => {
            this.contagemCentrosPOP++;
            this.contagemEquipamentos++;
            return {
              tipo:      'CENTRO POP',
              municipio: centroPOP['municipio'],
              porte:     centroPOP['porte'],
              nome:      centroPOP['nome'].toLocaleUpperCase(),
              endereco: `${centroPOP['tipoLogradouro']} ${centroPOP['endereco']
                            .replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)},
                         ${centroPOP['numero']} -${centroPOP['bairro']
                            .replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)} 
                       - ${centroPOP['municipio']}`,
              cep:       centroPOP['cep'].toString().replace(/(\d)(\d{3})$/,"$1-$2"),
              telefone:  centroPOP['telefone'].toString().replace(/(\d)(\d{4})$/,"$1-$2"),

            };
          }));
      }
    }, error => this.errorMessage = < any > error);

    this.dadosEIndicadoresService.fetchCRAS().subscribe(response => {
      this.crases = response;
      if(this.crases!=undefined){
        this.equipamentos =  this.equipamentos.concat(this.crases
          .filter(cras => this.estadoSelected || cras.municipio.toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
          .map(cras => {
            this.contagemCRAS++;
            this.contagemEquipamentos++;
            return {
              tipo:      'CRAS',
              municipio: cras['municipio'],
              porte:     cras['porte'],
              nome:      cras['nome'].toLocaleUpperCase(),
              endereco: `${cras['tipoLogradouro']} ${cras['endereco']
                            .replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)},
                         ${cras['numero']} - ${cras['bairro']
                            .replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)},
                        -${cras['municipio']}`,
              cep:       cras['cep'].toString().replace(/(\d)(\d{3})$/,"$1-$2"),
              telefone:  cras['telefone'].toString().replace(/(\d)(\d{4})$/,"$1-$2"),
            };
          }));
        this.totalEquipamentosEstado = (this.crases.length + this.creases.length + this.centrosPOP.length);
      }
    }, error => this.errorMessage = < any > error);
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
    'user strict'

    // Centros Pop do municipio ou com o do estado (todos os municípios)
    let   equipamentosCentroPop: IEquipamento[] = this.centrosPOP
      .filter(centroPOP => this.estadoSelected || centroPOP.municipio.toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
      .map(centroPOP => {
        return {
          tipo: 'CENTRO POP',
          municipio:   centroPOP['municipio'],
          porte:       centroPOP['porte'],
          nome:        centroPOP['nome'].toLocaleUpperCase(),
          endereco: `  ${centroPOP['tipoLogradouro']} ${centroPOP['endereco']
                        .replace(/\w\S*/g, txt => ` ${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)},
                       ${centroPOP['numero']} -${centroPOP['bairro']
                        .replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)}
                     - ${centroPOP['municipio']}`,
          cep:         centroPOP['cep'].toString().replace(/(\d)(\d{3})$/,"$1-$2"),
          telefone:    centroPOP['telefone'].toString().replace(/(\d)(\d{4})$/,"$1-$2"),
        };
      });

    // CREASes do municipio ou com o do estado (todos os municípios)
    let   equipamentosCREAS: IEquipamento[] = this.creases
      .filter(creas => this.estadoSelected || creas.municipio.toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
      .map(creas => {
        return {
          tipo:      'CREAS',
          municipio:  creas['municipio'],
          porte:      creas['porte'],
          nome:       creas['nome'].toLocaleUpperCase(),
          endereco:  `${creas['tipoLogradouro']}, ${creas['endereco']
                        .replace(/\w\S*/g, txt => ` ${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)},
                      ${creas['numero']} - ${creas['bairro']
                        .replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)}
                    - ${creas['municipio']}`,
          cep:        creas['cep'],
          telefone:   creas['telefone'],
        };
      });

    // CRASes do municipio ou com o do estado (todos os municípios)
    let   equipamentosCRAS: IEquipamento[] = this.crases
      .filter(cras => this.estadoSelected || cras.municipio.toLocaleLowerCase() == this.municipio.toLocaleLowerCase())
      .map(cras => {
        return {
          tipo:      'CRAS',
          municipio:    cras['municipio'],
          porte:        cras['porte'],
          nome:         cras['nome'].toLocaleUpperCase(),
          endereco:    `${cras['tipoLogradouro']} ${cras['endereco']
                          .replace(/\w\S*/g, txt => ` ${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)},
                        ${cras['numero']} - ${cras['bairro']
                          .replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}`)}-
                        ${cras['municipio']}`,
          cep:          cras['cep'].toString().replace(/(\d)(\d{3})$/,"$1-$2"),
          telefone:     cras['telefone'].toString().replace(/(\d)(\d{4})$/,"$1-$2"),
        };
      });

    if (i === 'cras') {
      this.equipamentoSelecionado = 'CRAS';
      this.equipamentos = equipamentosCRAS;

    } else if (i === 'creas') {
      this.equipamentoSelecionado = 'CREAS';
      this.equipamentos = equipamentosCREAS;

    } else if (i === 'centroPop') {
      this.equipamentoSelecionado = 'Centro Pop';
      this.equipamentos = equipamentosCentroPop;

    } else {
      this.equipamentoSelecionado = 'total';
      // inclui todos os equipamentos, CRASes, CREASes e Centros Pop -- por município ou para todo o estado
     this.equipamentos = [
        ...equipamentosCRAS,
        ...equipamentosCREAS,
        ...equipamentosCentroPop
      ];
    }

  }

  ngOnChanges() {
    // encontra 'Dados Gerais' baseado no nome do município
    this.dadosGerais = this.blocoDadosGerais.find(e => e.municipio == this.municipio);

    // encontra 'Indicadores Sociais' baseado no nome do município
    this.indicadoresSociais = this.blocoIndicadoresSociais.find(e => e.municipio == this.municipio);
    //encontra 'Indicadores Orcamentarios' baseado no nome do município e no ano desejado
    this.indicadoresOrcamentarios = this.blocoIndicadoresOrcamentarios.find(e => e.municipio == this.municipio && e.anoOrcamento==2017);
  }
}
