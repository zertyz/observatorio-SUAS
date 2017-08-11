// libs
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

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
  municipio: string;

  // campos computados
  indicadoresOrcamentariosDoMunicipio: IIndicadoresOrcamentarios;
  idh: IIDH;
  populacao: IPopulacao;
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
      this.municipio = params['municipio'] || 'Rio de Janeiro';
      this.computaCampos();
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




  // TODO cópia de indicadores_orcamentarios_20170810.json até que se implemente como serviço
  indicadoresOrcamentarios: IIndicadoresOrcamentarios[] = [
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
      "municipio": "Parati",
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
      "municipio": "Trajano de Morais",
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
};

// TODO refatorar como serviço
interface IIDH {
  municipio: string;
  idh:       number;
};

// TODO refatorar como serviço
interface IPopulacao {
  municipio: string;
  populacao: number;
}
