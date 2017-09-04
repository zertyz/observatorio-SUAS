// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {MultiSelectModule} from 'primeng/primeng';
import {SelectItem} from 'primeng/primeng';


import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

@Component({
  moduleId: module.id,
  selector: 'mp-inspecoes',
  templateUrl: 'mp-inspecoes.component.html',
  styleUrls: ['mp-inspecoes.component.css']
})

export class MPInspecoesComponent {

  dataInicio: Date;

  dataFim: Date;

  // Tipos Selecionados
  tipo1: boolean = false; //CRAS
  tipo2: boolean = false; //CREAS
  // Tipos Selecionados

  eixos: SelectItem[];  tipo3: boolean = false; //CENTRO POP

  municipios: SelectItem[];
  equipamentos: SelectItem[];
  selectedEixos: string[];
  selectedMunicipios: string[];
  selectedEquipamentos: string[];

  constructor(private injector: Injector, public routerext: RouterExtensions) {

    this.eixos = [];
    this.eixos.push({label: 'EQUIPE TÉCNICA', value: 'EQUIPE TÉCNICA'});
    this.eixos.push({label: 'INFRAESTRUTURA', value: 'INFRAESTRUTURA'});
    this.eixos.push({
      label: 'PROGRAMAS, PROJETOS, SERVIÇOS E BENEFÍCIOS',
      value: 'PROGRAMAS, PROJETOS, SERVIÇOS E BENEFÍCIOS'
    });

    this.equipamentos = [];
    /*this.equipamentos.push({label: 'CRAS', value: 'CRAS'});
    this.equipamentos.push({label: 'CRAS BARRA', value: 'CRAS BARRA'});
    this.equipamentos.push({label: 'CRAS SÃO GONÇALO', value: 'CRAS SÃO GONÇALO'});
    this.equipamentos.push({label: 'CRAS RIO', value: 'CRAS RIO'});*/


  }

  selectTipo(i: number) {
    if (i === 1) {
      this.tipo1 = !this.tipo1;
      this.preencheMunicipios();
      return;
    } else if (i === 2) {
      this.tipo2 = !this.tipo2;
      this.preencheMunicipios();
      return;
    } else {
      this.tipo3 = !this.tipo3;
      this.preencheMunicipios();
      return;
    }
  }


  //DADOS DE TESTE

  // TODO cópia de centro_pop_20170810.json
  centrosPOP: string[][] = [
    ['Municipio_2013', 'Porte_pop2010', 'ident_1', 'ident_2', 'ident_3', 'ident_4', 'ident_5', 'ident_6', 'ident_8', 'ident_12'],
    ['Araruama', 'Grande', 'CENTRO POP', 'Rodovia', 'AMARAL PEIXOTO', '1141', '', 'VILA CAPRI', '28970-000', '(22) 2665-3256'],
    ['Barra Mansa', 'Grande', 'CENTRO POP CASA DA GENTE', 'Alameda', 'Alameda vanzzi', '60', '', 'Ano Bom', '27360-000', '(24) 3324-1486'],
    ['Belford Roxo', 'Grande', 'CREAS -CENTRO DE REFERENCIA ESPECIALIZADO EM POPULAÇÃO DE RUA', 'Estrada', 'Estrada Dr. Plínio Casado', '3968', 'loja 01', 'CENTRO', '26127-780', '(21) 2761-4088'],
    ['Campos dos Goytacazes', 'Grande', 'CREAS - CENTRO POP- CENTRO DE REFERÊNCIA ESPECIALIZADO PARA POPULAÇÃO EM SITUAÇÃO DE RUA', 'Rua', 'Rua Tenente Coronel Cardoso', '565', '', 'Centro', '28035-042', '(22) 2726-4041'],
    ['Duque de Caxias', 'Grande', 'CREAS POP FIGUEIRA', 'Estrada', 'Estrada Velha do Pilar', '0', '', 'FIGUEIRA', '25231-610', '(21) 2771-0976'],
    ['Itaboraí', 'Grande', 'CENTRO POP - ESPECIALIZADO PARA PESSOAS EM SITUAÇÃO DE RUA', 'Rua', 'Augusto Moreira', '0', 'LT 53', 'Jardim Imperial', '24800-000', '(21) 3639-2080'],
    ['Itaguaí', 'Grande', 'CENTRO POP', 'Rua', 'Lea Cabral da Cunha', '161', '', 'Centro', '23810-410', '(21) 2687-8208'],
    ['Macaé', 'Grande', 'CREAS  CENTRO POP', 'Rua', 'JOSE BRUNO DE AZEVEDO', '99', '', 'CENTRO', '27947-090', '(22) 2796-1084'],
    ['Magé', 'Grande', 'CENTRO POP MAGÉ', 'Rua', 'Mario de Brito', '119', '', 'Piabetá', '25931-746', '(21) 2659-0834'],
    ['Niterói', 'Grande', 'CENTRO POP', 'Rua', 'Rua Coronel Gomes Machado', '281', '', 'Centro', '24020-111', '(21) 2620-1578'],
    ['Nova Iguaçu', 'Grande', 'CREAS POP - POPULAÇÃO EM SITUAÇÃO DE RUA', 'Rua', 'REPÚBLICA ÁRABE DA SÍRIA', '136', '', 'Centro', '26215-520', '(21) 2667-5795'],
    ['Petrópolis', 'Grande', 'CENTRO POP MARCELINO DA CONCEIÇÃO GARCIA', 'Rua', 'MARECHAL FLORIANO PEIXOTO', '396', '', 'CENTRO', '25610-081', '(24) 2242-4554'],
    ['Resende', 'Grande', 'CREAS POP', 'Rua', 'do Rosário', '230', 'casa', 'Centro', '27500-000', '(24) 3360-9739'],
    ['Rio de Janeiro', 'Metrópole', 'CENTRO POP BÁRBARA CALAZANS', 'Praça', 'PIO X', '119', '6 ANDAR', 'Centro', '20040-002', '(21) 96858-7736'],
    ['Rio de Janeiro', 'Metrópole', 'CENTRO POP JOSÉ SARAMAGO', 'Rua', 'CAPITÃO ALIATAR MARTINS', '211', 'TERREO', 'IRAJÁ', '21235-515', '(21) 2051-4118'],
    ['São Gonçalo', 'Metrópole', 'CENTRO POP I', 'Rua', 'Maria Candida', '42', '', 'Mutondo', '24450-690', '(21) 3708-7850'],
    ['São Gonçalo', 'Metrópole', 'CREAS CentroPop II', 'Rua', 'São Pedro', '2', '', 'Vista Alegre', '24412-380', '(21) 3262-3603'],
    ['São João de Meriti', 'Grande', 'CREAS - Centro POP', 'Avenida', 'Doutor Celso José de Carvalho', '911', 'Loja R', 'Jardim Meriti', '25555-201', '(21) 2651-2696'],
    ['Volta Redonda', 'Grande', 'CREAS POP - Centro de Referencia Especializado para Pessoas em Situação de Rua', 'Rua', 'PAULO LEOPOLDO MARÇAL', '117', '', 'ATERRADO', '27213-280', '(24) 3339-9588'],
  ];

  // TODO cópia de cras_20170810.json
  crases: string[][] = [
    ['Município', 'Porte_pop2010', 'ident_1_Nome', 'ident_2_TPLog', 'ident_3_Endereço', 'ident_4_Núm', 'ident_5_Comp', 'ident_6_Bairro', 'ident_8_CEP', 'ident_12_Tel'],
    ['Angra Dos Reis', 'Grande', 'CRAS Frade', 'Rua', 'Julieta Conceição Reis', '142', '', 'Frade', '23946020', '(24)3369655'],
    ['Angra Dos Reis', 'Grande', 'CRAS Belém', 'Rodovia', 'mario covas s/n', '0', '', 'Belém', '23933005', '(24)3368463'],
    ['Angra Dos Reis', 'Grande', 'CRAS Monsuaba', 'Rua', 'Manoel de Souza Lima', '248', '', 'Monsuaba', '23916075', '(24)3366109'],
    ['Angra Dos Reis', 'Grande', 'CRAS Bracuí', 'Rua', 'Três Amigos', '32', '', 'Bracuhy', '23943150', '(24)3363189'],
    ['Angra Dos Reis', 'Grande', 'CRAS Campo Belo', 'Rua', 'das Margaridas', '21', '', 'Campo Belo', '23900000', '(24)3377773'],
    ['Angra Dos Reis', 'Grande', 'CRAS Nova Angra', 'Avenida', 'Jose Fausto de Queiroz', '5', '', 'japuiba', '23934087', '(24)3377188'],
    ['Angra Dos Reis', 'Grande', 'CRAS Parque Mambucaba', 'Rua', 'Limeira', '96', '', 'Parque Mambucaba', '23900000', '(24)3362443'],
    ['Aperibé', 'Pequeno I', 'CRAS CENTRO', 'Rua', 'ANIBAL CORTES', '46', 'CASA', 'CENTRO', '28495000', '(22)3864160'],
    ['Aperibé', 'Pequeno I', 'CRAS PORTO DAS BARCAS', 'Rua', 'DIOMAR BAIRRAL', '1240', 'CASA', 'PORTO DAS BARCAS', '28495000', '(22)3861364'],
    ['Aperibé', 'Pequeno I', 'CRAS PONTE SECA', 'Rua', 'Genocy Coelho da Silva', '0', '', 'PONTE SECA', '28495000', '(22)3864417'],
    ['Araruama', 'Grande', 'CRAS DO MUTIRÃO', 'Rua', 'RUA HORACIO VIEIRA', '0', 'COMERCIAL', 'MUTIRÃO', '28970000', '(22)2665551'],
    ['Araruama', 'Grande', 'CRAS  Bananeiras', 'Rua', 'Iguarassu', '176', 'Parque Novo Horizonte', 'Bananeiras', '28970000', '(22)2665564'],
    ['Araruama', 'Grande', 'CRAS FAZENDINHA', 'Rua', 'ANTÔNIO DIAS DA CUNHA', '0', '', 'FAZENDINHA', '28970000', '(22)2664432'],
    ['Araruama', 'Grande', 'CRAS DE SÃO VICENTE', 'Rua', 'B', '0', '', 'SÃO VICENTE DE PAULA', '28980000', '(22)2666155'],
    ['Araruama', 'Grande', 'CRAS DO OUTEIRO', 'Rua', 'Almirante Protógenes Guimarães', '679', '', 'Outeiro', '28970000', '(22)2665324'],
    ['Areal', 'Pequeno I', 'Centro de Referencia de Assistencia Social - Cras Amazonas', 'Rua', 'Inglaterra', '9', '', 'Amazonas', '25845000', '(24)2257202'],
    ['Areal', 'Pequeno I', 'Centro de Referencia da Assistencia Social - CRAS Centro', 'Rua', 'Manoel Cabral de Melo', '425', '', 'Centro', '25845000', '(24)2257290'],
    ['Armação Dos Búzios', 'Pequeno II', 'CRAS José Gonçalves', 'Avenida', 'José Gonçalves', '44', '', 'José Gonçalves', '28950000', '(22)2633073'],
    ['Armação Dos Búzios', 'Pequeno II', 'CRAS BAIA FORMOSA', 'Estrada', 'CABO FRIO BUZIOS', '1201', '', 'BAIA FORMOSA', '28950000', '(22)2633076'],
    ['Armação Dos Búzios', 'Pequeno II', 'CRAS - RASA', 'Rua', 'ALVARO ELIDIO GONÇALVES', '317', 'À ESQUERDA DA ESTÁTUA DO ZUMBI', 'RASA', '28950000', '(22)2620895'],
    ['Arraial do Cabo', 'Pequeno II', 'CRAS JOSÉ HENRIQUE DA SILVA', 'Rua', 'SÃO GENUÁRIO', '51', '', 'FIGUEIRA', '28930000', '(22)2662111'],
    ['Arraial do Cabo', 'Pequeno II', 'CRAS AMADO JULIÃO', 'Travessa', 'TOME DE SOUZA', '6', '', 'MORRO DA CABOCLA', '28930000', '(22)2622178'],
    ['Barra do Piraí', 'Médio', 'CRAS Areal', 'Rua', 'Teresopolis', '52', '', 'Areal', '27150090', '(24)2445154'],
    ['Barra do Piraí', 'Médio', 'CRAS Vargem Alegre', 'Rua', 'Elias Antonio', '26', '', 'Santa Rosa', '27155000', '(24)2430214'],
    ['Barra do Piraí', 'Médio', 'CRAS California', 'Rua', '32', '142', '', 'Morada do Vale', '27163000', '(24)3347845'],
    ['Barra do Piraí', 'Médio', 'CRAS Centro', 'Rua', 'José Ferreira Aguiar', '128', '', 'Centro', '27123150', '(24)2443108'],
    ['Barra Mansa', 'Grande', 'CRAS VILA NATAL', 'Rua', 'Manoel Anisio Rodrigues', '4', '', 'Vila Natal', '27330000', '(24)3349053'],
    ['Barra Mansa', 'Grande', 'CRAS GETÚLIO VARGAS', 'Rua', 'BELO HORIZONTE', '273', '', 'GETÚLIO VARGAS', '27325340', '(24)3322017'],
    ['Barra Mansa', 'Grande', 'CRAS PENA FORTE', 'Rua', 'Vereador Joaquim Boa Morte', '8', '', 'VILA CORINGA', '27321370', '(24)3323043'],
    ['Barra Mansa', 'Grande', 'CRAS SÃO PEDRO', 'Rua', 'RUA RODOLPHO MARQUES', '356', '', 'SÃO PEDRO', '27340040', '(24)3322652'],
    ['Barra Mansa', 'Grande', 'CRAS SIDERLÂNDIA', 'Rua', 'JOSE GONÇALVES REBOLLAS', '3330', '', 'BOCAININHA', '27350390', '(24)3328395'],
    ['Barra Mansa', 'Grande', 'CRAS PARAÍSO DE CIMA', 'Rua', 'IZALINO GOMES DA SILVA', '0', '', 'PARAÍSO DE CIMA', '27400000', '(24)3350715'],
    ['Belford Roxo', 'Grande', 'CRAS  I  -  XAVANTE', 'Rua', 'Felipe Antonio Lopes Pinto.', '12', 'casa', 'Xavante', '26125063', '(21)2762182'],
    ['Belford Roxo', 'Grande', 'CRAS IV - LOTE XV', 'Rua', 'PADRE EGÍDIO CARMELINCK', '70', 'casa', 'LOTE XV', '26183385', '(21)3135693'],
    ['Belford Roxo', 'Grande', 'CRAS  VI - JARDIM BOM PASTOR', 'Avenida', 'DISTINÇÃO', '0', 'LT03 QD05', 'JARDIM BOM PASTOR', '26150000', '(21)3752201'],
    ['Belford Roxo', 'Grande', 'CRAS  X - ROSANE  CUNHA', 'Rua', 'José da Cunha', '205', '', 'Areia Branca', '26135000', '(21)2662239'],
    ['Belford Roxo', 'Grande', 'CRAS  IX - JARDIM DO IPÊ', 'Rua', 'júlia abraão', '26', '', 'jardim do Ipê', '26180100', '(21)3135291'],
    ['Belford Roxo', 'Grande', 'CRAS II SANTA MARTA', 'Rua', 'DR. ARMANDO REZENDE', '88', '', 'SANTA MARTA', '26173110', '(21)2662020'],
    ['Belford Roxo', 'Grande', 'CRAS VIII - DORITHY MAE STONG', 'Estrada', 'LIGAÇÃO', '40', '', 'PARQUE SUECIA', '26187180', '(21)3662999'],
    ['Belford Roxo', 'Grande', 'CRAS III - NOVA AURORA', 'Avenida', 'NOVA AURORA', '36', '', 'NOVA  AURORA', '26155070', '(21)2661024'],
    ['Belford Roxo', 'Grande', 'CRAS XII  -  WONA', 'Rua', 'Cromita', '0', 'Qd. 01 - Lote 30', 'Jardim Piedade', '26183830', '(21)3661238'],
    ['Belford Roxo', 'Grande', 'CRAS XIII - BABI', 'Avenida', 'ATLÂNTICA', '850', '', 'VILA MAIA', '26160630', '(21)2779701'],
    ['Belford Roxo', 'Grande', 'CRAS VII ZILDA ARNS NEUMANN', 'Rua', 'MAJOR ÊNIO CAVALCANTE CALDAS', '16', '', 'SARGENTO RONCALLE', '26178400', '(21)2762300'],
    ['Belford Roxo', 'Grande', 'CRAS V - SHANGRILA', 'Rua', 'ITAIPU BABI', '36', '', 'SHANGRILA', '26127140', '(21)2761612'],
    ['Bom Jardim', 'Pequeno II', 'CRAS SAO MIGUEL', 'Rua', 'JOAO JACINTO DE CARVALHO', '1068', 'CASA', 'SAO MIGUEL', '28660000', '(22)2566284'],
    ['Bom Jardim', 'Pequeno II', 'CRAS BANQUETE', 'Estrada', 'Rosário', '0', 'S/N', 'Banquete', '28660000', '(22)2565135'],
    ['Bom Jardim', 'Pequeno II', 'CRAS JARDIM ORNELLAS', 'Avenida', 'WALTER VENDA RODRIGUES', '100', 'CASA', 'CAMPO BELO', '28660000', '(22)2566249'],
    ['Bom Jesus do Itabapoana', 'Pequeno II', 'CRAS - Nova Bom Jesus', 'Rua', 'Projetada F', '0', '', 'Nova Bom Jesus - Usina Santa Isabel', '28600000', '(22)3835165'],
    ['Bom Jesus do Itabapoana', 'Pequeno II', 'CRAS - SANTA TEREZINHA', 'Avenida', 'TENENTE JOSÉ TEIXEIRA', '1396', '', 'SANTA TEREZINHA', '28360000', '(22)3831344'],
    ['Bom Jesus do Itabapoana', 'Pequeno II', 'CRAS - BELA VISTA', 'Rua', 'OTACÍLIO DE AQUINO', '220', '', 'BELA VISTA', '28360000', '(22)3831607'],
    ['Cabo Frio', 'Grande', 'CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL TEREZA FRANCISCONE', 'Estrada', 'Estrada de Botafogo', '14', '', 'BOTAFOGO', '28927990', '(22)2647375'],
    ['Cabo Frio', 'Grande', 'CRAS - JUZETE TRINDADE CORREA', 'Rua', 'CANADÁ', '156', '', 'JARDIM NÁUTILUS', '28909190', '(22)2644269'],
    ['Cabo Frio', 'Grande', 'CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL JOÃO NASCIMENTO', 'Rua', 'SOROROCA', '8', '2º DISTRITO - TAMOIOS', 'SAMBURÁ', '28927000', '(22)2630572'],
    ['Cabo Frio', 'Grande', 'CRAS DOMINGOS ANTÔNIO SIQUEIRA', 'Rua', 'Carlos Gomes', '11', '', 'JACARÉ', '28910000', '(22)2643922'],
    ['Cabo Frio', 'Grande', 'CRAS - CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL VIRGÍNIO CORRÊA', 'Rua', 'Santo Antônio de Lisboa', '29', '', 'Porto do Carro', '28900000', '(22)2644019'],
    ['Cabo Frio', 'Grande', 'CRAS - CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL PRAIA DO SIQUEIRA', 'Rua', 'Guanabara', '1', '', 'Jardim Olinda II', '28908050', '(22)2645485'],
    ['Cabo Frio', 'Grande', 'CRAS CENTRAL GRAZIELLE AZEVEDO MARQUES', 'Rua', 'Nossa Senhora Aparecida', '325', '', 'Parque Central', '28900000', '(22)2644606'],
    ['Cabo Frio', 'Grande', 'CRAS JARDIM ESPERANÇA', 'Rua', 'Paraná', '29', '', 'Jardim Esperança', '28920232', '(22)2629450'],
    ['Cachoeiras de Macacu', 'Médio', 'CRAS - Papucaia', 'Rua', 'Henrique Laje', '113', '', 'Papucaia', '28680000', '(21)2745057'],
    ['Cachoeiras de Macacu', 'Médio', 'CRAS - Cachoeiras', 'Rua', 'ANTÔNIO VALLADARES', '91', '', 'BOA VISTA', '28680000', '(21)2649249'],
    ['Cachoeiras de Macacu', 'Médio', 'CRAS - Japuíba', 'Praça', 'Macedo Soares', '0', '', 'Japuiba', '28680000', '(21)2745534'],
    ['Cambuci', 'Pequeno I', 'CRAS 1', 'Parque', 'de Exposições - Pavilhão 1', '1', '', 'Guarani', '28430000', '(22)2767208'],
    ['Cambuci', 'Pequeno I', 'CRAS 2', 'Rua', 'Muniz de Medeiros', '91', '', 'CENTRO SÃO JOÃO DO PARAÍSO', '28450000', '(22)3855139'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS URURAÍ', 'Rua', 'RUA JOSÉ PEREIRA', '51', '', 'URURAÍ', '28000000', '(22)2728394'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS Codin', 'Rua', 'G', '15', '', 'Codin', '28090630', '(22)2739595'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS TRAVESSÃO', 'Rua', 'ANTONIO LUIZ DA SILVEIRA', '482', '', 'TRAVESSÃO DE CAMPOS', '28175000', '(22)2748511'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS Chatuba', 'Rua', 'Maçaranduba', '0', 'Condomínio Oswaldo Gregório', 'Chatuba', '28100000', '(22)2724631'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS Goitacazes', 'Rodovia', 'RAUL SOUTO MAIOR', '49', '', 'Goitacazes', '28030045', '(22)2731918'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS JARDIM CARIOCA', 'Travessa', 'SANTO ELIAS', '0', '', 'JARDIM CARIOCA', '28080385', '(22)2725361'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS Penha', 'Rua', 'Rossine Quintanilha Chagas', '0', '', 'Penha', '28021001', '(22)2724812'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS CUSTODÓPOLIS', 'Rua', 'POETA  MARINHO', '7', '', 'CUSTODOPOLIS', '28080090', '(22)2723349'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS JOCKEY', 'Rua', 'Professor Alvaro Barcelos', '0', '', 'Jockey II', '28020307', '(22)9817505'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS MORRO DO CÔCO', 'Rua', 'Nilo Peçanha', '0', '', 'Morro do Coco', '28178000', '(22)9771453'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS Parque Guarús', 'Rua', 'Rio Bonito', '5', '', 'Parque Guarús', '28070645', '(22)2731754'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS MATADOURO', 'Rua', 'Adão Pereira Nunes', '0', '', 'MATADOURO', '28015472', '(22)2731344'],
    ['Campos Dos Goytacazes', 'Grande', 'CRAS ESPLANADA', 'Rua', 'VALTER SALES', '0', '', 'PQ ESPLANADA', '28000100', '(22)2732288'],
    ['Cantagalo', 'Pequeno I', 'CRAS NOVO HORIZONTE', 'Rua', 'RUA F', '0', 'PRÉDIO', 'NOVO HORIZONTE', '28500000', '(22)2555200'],
    ['Cantagalo', 'Pequeno I', 'CRAS SANTO ANTONIO', 'Rua', 'PROF: MANOEL VIEIRA BAPTISTA', '237', 'PRÉDIO', 'SANTO ANTONIO', '28500000', '(22)2555110'],
    ['Cantagalo', 'Pequeno I', 'CRAS Centro', 'Travessa', 'Luiz Carlos Falcão', '0', '', 'Centro', '28500000', '(22)2555485'],
    ['Carapebus', 'Pequeno I', 'CRAS Sapecado', 'Rua', 'João Pedro Sobrinho', '182', '', 'Sapecado', '27998000', '(22)2768368'],
    ['Carapebus', 'Pequeno I', 'CRAS UBÁS', 'Rua', 'RUA JOÃO AURÉLIO ORTIZ', '207', '', 'UBÁS', '27998000', '(22)2768441'],
    ['Cardoso Moreira', 'Pequeno I', 'CRAS DE OUTEIRO', 'Rua', 'PRINCIPAL', '0', 'USINA DE OUTEIRO', 'OUTEIRO', '28180000', '(22)2735815'],
    ['Cardoso Moreira', 'Pequeno I', 'CRAS DE CARDOSO MOREIRA', 'Rua', 'SEBASTIÃO ZAQUEU', '0', '', 'centro', '28180000', '(22)2785204'],
    ['Carmo', 'Pequeno I', 'CRAS INFLUÊNCIA', 'Rua', 'Jose Ferreira Alves', '247', '', 'INFLUÊNCIA', '28640000', '(22)2537423'],
    ['Carmo', 'Pequeno I', 'CRAS CENTRAL', 'Rua', 'SENADOR DANTAS', '578', '', 'CENTRO', '28640000', '(22)2537141'],
    ['Casimiro de Abreu', 'Pequeno II', 'CRAS  - BARRA DE SÃO JOÃO', 'Rua', 'Corvina', '705', 'Peixe Dourado II', 'BARRA DE SÃO JOÃO', '28880000', '(22)2774565'],
    ['Casimiro de Abreu', 'Pequeno II', 'CRAS Casimiro de Abreu', 'Rua', 'PASTOR LUIZ LAURENTINO DA SILVA', '385', '', 'MATARUNA', '28860000', '(22)2778514'],
    ['Casimiro de Abreu', 'Pequeno II', 'CRAS Professor Souza', 'Rua', 'João Soares', '468', '', 'PROFESSOR SOUZA', '28860000', '(22)2778308'],
    ['Comendador Levy Gasparian', 'Pequeno I', 'CRAS - Afonso Arinos', 'Rua', 'Jaime Matos', '184', '', 'Afonso Arinos', '25875000', '(24)2254162'],
    ['Comendador Levy Gasparian', 'Pequeno I', 'CRAS - Fonseca Almeida', 'Avenida', 'Fonseca Almeida', '26', '', 'Fonseca Almeida', '25870000', '(24)2254134'],
    ['Conceição de Macabu', 'Pequeno II', 'CRAS USINA', 'Vila', 'LEOLINDA', '54', '', 'USINA', '28740000', '(22)2779309'],
    ['Conceição de Macabu', 'Pequeno II', 'CRAS MACABUZINHO/CENTRAL', 'Rua', 'Maria Adelaide', '191', 'Sede', 'Vila Nova', '28740000', '(22)2779259'],
    ['Conceição de Macabu', 'Pequeno II', 'CRAS RHODIA', 'Rua', 'MARIA JULIA GOMES DE LEMOS', '41', 'CASA', 'RHODIA', '28740000', '(22)2779305'],
    ['Cordeiro', 'Pequeno II', 'CRAS CENTRO', 'Rua', 'Van Erven', '23', '', 'Centro', '28540000', '(22)2551101'],
    ['Cordeiro', 'Pequeno II', 'CRAS MANANCIAL', 'Rua', 'Romualdo Pereira Lopes', '0', '', 'Manancial', '28540000', '(22)2551318'],
    ['Cordeiro', 'Pequeno II', 'CRAS RODOLFO GONÇALVES', 'Rua', 'RUA MAESTRO JOÃO MACEDO', '76', '', 'Retiro Poético', '28540000', '(22)2551387'],
    ['Duas Barras', 'Pequeno I', 'CRAS DUAS BARRAS', 'Rua', 'monnerat', '0', '', 'CENTRO', '28650000', '(22)2534121'],
    ['Duas Barras', 'Pequeno I', 'CRAS / MONNERAT', 'Rua', 'Antonio Pereira da Silva', '0', '', 'CENTRO', '28655000', '(22)2534507'],
    ['Duque de Caxias', 'Grande', 'CRAS Pilar', 'Avenida', 'President Kennedy', '0', 'lote 10, quadra 43', 'Pilar', '25071128', '(21)2672665'],
    ['Duque de Caxias', 'Grande', 'CRAS VILA MARIA HELENA', 'Rua', 'Antenor Resende', '100', '', 'Vila Maria Helena', '25251750', '(21)2672556'],
    ['Duque de Caxias', 'Grande', 'IMBARIÊ', 'Rua', 'FELICIANO SODRE', '0', '', 'IMBARIÊ', '25266260', '(21)2787014'],
    ['Duque de Caxias', 'Grande', 'CRAS LAGUNA E DOURADOS', 'Rua', 'MAJOR THOMAZ GONÇALVES', '0', '0', 'LAGUNA E DOURADOS', '25011230', '(21)2671566'],
    ['Duque de Caxias', 'Grande', 'CRAS XERÉM', 'Avenida', 'NÓBREGA RIBEIRO', '15', '', 'Ns Sra. das Graças - Xerém', '25500000', '(21)2679169'],
    ['Duque de Caxias', 'Grande', 'CRAS CENTENARIO', 'Rua', 'FRANCISCA TOME', '842', '', 'Centenario', '25030150', '(21)3774278'],
    ['Duque de Caxias', 'Grande', 'BEIRA MAR', 'Rua', 'FRANCISCO ALVES', '0', '0', 'PARQUE BEIRA MAR', '25000000', '(21)2671159'],
    ['Duque de Caxias', 'Grande', 'CRAS JARDIM GRAMACHO', 'Avenida', 'PISTÓIA', '0', '0', 'JARDIM GRAMACHO', '25055120', '(21)2672667'],
    ['Duque de Caxias', 'Grande', 'CRAS de Parada Morabi', 'Avenida', 'Anhangá', '0', '0', 'Parada Morabi', '25265000', '(21)2672665'],
    ['Duque de Caxias', 'Grande', 'CRAS FIGUEIRA', 'Rodovia', 'Washington Luis', '0', '', 'FIGUEIRA', '25000000', '(21)3654040'],
    ['Duque de Caxias', 'Grande', 'CRAS JARDIM PRIMAVERA', 'Rua', 'VICENTE CELESTINO', '615', '0', 'JARDIM PRIMAVERA', '25220020', '(21)2672665'],
    ['Engenheiro Paulo de Frontin', 'Pequeno I', 'CRAS 2', 'Rua', 'Joquim Mendes', '349', '', 'Morro Azul', '26650000', '(24)2468221'],
    ['Engenheiro Paulo de Frontin', 'Pequeno I', 'CRAS 1', 'Avenida', 'Antônio Mauricio, S/N', '0', '', 'Centro', '26650000', '(24)2463392'],
    ['Guapimirim', 'Médio', 'CRAS II', 'Rua', 'José Maria da Silva', '1443', 'casa', 'Vale das Pedrinhas', '25940690', '(21)2747944'],
    ['Guapimirim', 'Médio', 'CRAS III', 'Rua', 'Praianos', '845', 'casa', 'Jardim Guapimirim', '25940000', '(21)2632287'],
    ['Guapimirim', 'Médio', 'CRAS I', 'Avenida', 'Dedo de Deus', '342', 'casa', 'Centro', '25940000', '(21)2632208'],
    ['Iguaba Grande', 'Pequeno II', 'CRAS Apolo Belisário de Sousa', 'Estrada', 'Estrada do Arrastão s/nº', '0', '', 'Vila Nova', '28960000', '(22)2624220'],
    ['Iguaba Grande', 'Pequeno II', 'CRAS ADILSON LESSA', 'Estrada', 'ESTRADA DA CAPIVARA', '846', '', 'CIDADE NOVA', '28960000', '(22)2624397'],
    ['Itaboraí', 'Grande', 'CRAS - AMPLIAÇÃO', 'Rua', 'Miguel Ângelo Gimenez', '0', 'Lote 01 - Quadra - 63', 'AMPLIAÇÃO', '24808332', '(21)2635665'],
    ['Itaboraí', 'Grande', 'CRAS - RETA', 'Rua', 'Pedro Ferreira Pinto', '0', 'LT 10 QD 06', 'VILA PROGRESSO', '24802365', '(21)3637043'],
    ['Itaboraí', 'Grande', 'CRAS - ITAMBI', 'Rua', 'JOÃO MOREIRA', '276', '', 'ITAMBI', '24800000', '(21)2736558'],
    ['Itaboraí', 'Grande', 'CRAS - VISCONDE', 'Rua', 'DRAUZIO LEMOS', '835', '', 'VISCONDE DE ITABORAI', '24875120', '(21)3639685'],
    ['Itaboraí', 'Grande', 'CRAS - APOLO', 'Rua', 'ANTONIETA RODRIGUES VIANA', '0', 'LT 19 QD 05', 'APOLLO II', '24858564', '(21)3639539'],
    ['Itaboraí', 'Grande', 'CRAS - JARDIM IMPERIAL', 'Rua', 'EURYDICE NASCIMENTO PINHO', '0', 'L 684 Q 29', 'JARDIM IMPERIAL', '24800345', '(21)3637759'],
    ['Itaguaí', 'Grande', 'CRAS Mazomba', 'Estrada', 'do Mazomba', '3623', '', 'Mazombinha', '23830250', '(21)3782510'],
    ['Itaguaí', 'Grande', 'CRAS Engenho', 'Rua', 'Ari Parreiras', '1560', 'Lote 2/Quadra 134', 'Engenho', '23820000', '(21)3782533'],
    ['Itaguaí', 'Grande', 'CRAS Brisamar', 'Rua', 'Soldado Luiz Mendonça Santos', '44', '', 'Brisamar', '23825615', '(21)2687341'],
    ['Itaguaí', 'Grande', 'CRAS Califórnia', 'Rua', 'Joaquim Nabuco', '21', 'Quadra 112', 'Califórnia', '23811550', '(21)2688170'],
    ['Itaguaí', 'Grande', 'CRAS Centro', 'Rua', 'Thieres Teixeira Leite', '231', 'Área 01/Qd 69', 'Jardim Laiá', '23822730', '(21)2687421'],
    ['Itaguaí', 'Grande', 'CRAS Chaperó', 'Estrada', 'de Chaperó', '0', 'Gleba A', 'Chaperó', '23812260', '(21)2687735'],
    ['Italva', 'Pequeno I', 'CENTRO DE REFERENCIA DE ASSISTÊNCIA SOCIAL', 'Rua', 'JOSE LUIZ MARINHO', '13', '', 'CENTRO', '28250000', '(22)2783222'],
    ['Italva', 'Pequeno I', 'CENTRO DE REFERENCIA DE ASSISTÊNCIA SOCIAL', 'Rua', 'AV. CORONEL LUIS SALLES', '92', '', 'CENTRO', '28250000', '(22)2783174'],
    ['Itaocara', 'Pequeno II', 'CRAS BELA VISTA', 'Rua', 'PAULO CEZAR ERTHAL', '187', '', 'CENTRO', '28570000', '(22)3861255'],
    ['Itaocara', 'Pequeno II', 'CRAS LARANJAIS', 'Rua', 'PERICLES CORREIA DA ROCHA', '1', '', 'NITEROI', '28580000', '(22)3862128'],
    ['Itaocara', 'Pequeno II', 'CRAS - ITAOCARA', 'Rua', 'ALDERICO VIANA  DE BARROS', '155', 'SOBRADO', 'FLORESTAL', '28570000', '(22)3861261'],
    ['Itaperuna', 'Médio', 'CRAS BAIRRO NITERÓI', 'Avenida', 'SANTO ANTONIO', '157', '', 'NITERÓI', '28300000', '(22)3824323'],
    ['Itaperuna', 'Médio', 'CRAS AEROPORTO', 'Rua', 'RUA PAULO DE OLIVEIRA', '685', 'PROX. AO MERCADO TABAJARA', 'AEROPORTO', '28300000', '(22)3823725'],
    ['Itaperuna', 'Médio', 'CRAS CASTELO / HORTO FLORESTAL', 'Rua', 'SÃO VICENTE DE PAULA', '92', '', 'CASTELO', '28300000', '(22)3822605'],
    ['Itaperuna', 'Médio', 'CRAS VINHOSA / SÃO MATHEUS / GUARITÁ', 'Rua', 'BENEDITO NICOLAU', '45', '', 'VINHOSA', '28300000', '(22)3824640'],
    ['Itaperuna', 'Médio', 'CRAS CIDADE NOVA / JARDIM SURUBI', 'Avenida', 'PORTO ALEGRE', '1000', '', 'CIDADE NOVA/JARDIM SURUBI', '28300000', '(22)3823647'],
    ['Itatiaia', 'Pequeno II', 'CRAS PENEDO', 'Rua', 'do médico', '30', '', 'Penedo', '27580000', '(24)3352504'],
    ['Itatiaia', 'Pequeno II', 'CRAS Maromba', 'Rua', 'do Pingo de Mel', '161', '', 'Estrada Maringá - Maromba', '27580000', '(24)3387168'],
    ['Itatiaia', 'Pequeno II', 'CRAS Centro', 'Rua', 'SÃO JOSÉ', '126', 'CASA', 'CENTRO', '27580000', '(24)3352149'],
    ['Japeri', 'Médio', 'CRAS - Centro', 'Avenida', 'São João Evangelista', '1', '', 'Engenheiro Pedreira', '26445970', '(21)3691006'],
    ['Japeri', 'Médio', 'CRAS - Alecrim', 'Rua', 'Roberto Bandeira', '16', '', 'Alecrim', '26382290', '(21)2664642'],
    ['Japeri', 'Médio', 'CRAS Santa Amélia', 'Estrada', 'Da Saudade', '3', 'Quadra 2', 'Jardim Emilia', '26460400', '(21)3691909'],
    ['Japeri', 'Médio', 'CRAS - Guandu', 'Avenida', 'do Canal', '3', 'lote 3 Quadra 3', 'GUANDU', '26410050', '(21)2664450'],
    ['Japeri', 'Médio', 'CRAS - Mucajá', 'Avenida', 'Tancredo Neves', '10', 'LT10 Q11', 'Mucajá', '26372390', '(21)2664867'],
    ['Japeri', 'Médio', 'CRAS CANCELA', 'Rua', 'LENI FERREIRA', '366', '', 'CENTRO', '26435210', '(21)2670369'],
    ['Japeri', 'Médio', 'CRAS Japeri', 'Rua', 'Augusto Batista de Carvalho', '72', '', 'Nova Belém', '26433340', '(21)2670177'],
    ['Laje do Muriaé', 'Pequeno I', 'CRAS CENTRO', 'Rua', 'Ferreira César', '282', 'CASA', 'Centro', '28350000', '(22)3829132'],
    ['Laje do Muriaé', 'Pequeno I', 'CRAS QUERÓ', 'Rua', 'Garcia Pereira', '181', 'CASA', 'Centro', '28350000', '(22)3829132'],
    ['Macaé', 'Grande', 'CRAS Nova Esperança', 'Rua', 'Sergipe, lote 09  S/Nº', '0', '', 'Nova Esperança', '27910000', '(22)2759886'],
    ['Macaé', 'Grande', 'CRAS Parque Aeroporto Paulo Roberto Pereira', 'Estrada', 'Do Caminho s/nº', '0', '', 'Ajuda de Baixo', '27971973', '(22)2793037'],
    ['Macaé', 'Grande', 'CRAS Serra', 'Avenida', 'Miguel Peixoto Guimarães', '703', '', 'Córrego do Ouro', '27985000', '(22)2762780'],
    ['Macaé', 'Grande', 'CRAS Novo Visconde Alba Corral', 'Rua', 'Manoel Batista de Carvalho', '0', '', 'Novo Visconde', '27940520', '(22)2762511'],
    ['Macaé', 'Grande', 'CRAS  Aroeira', 'Rua', 'Luiz Alves de Lima e Silva s/nº', '0', '', 'Jardim Santo Antônio', '27910300', '(22)2796111'],
    ['Macaé', 'Grande', 'CRAS Botafogo', 'Rua', 'Antônio Bichara Filho S/nº', '0', '', 'Novo Botafogo', '27946130', '(22)2759085'],
    ['Macaé', 'Grande', 'CRAS Barra', 'Rua', 'Eurico Barbosa de Souza', '0', '', 'Barra', '27961040', '(22)2763702'],
    ['Macuco', 'Pequeno I', 'CRAS MACUCO', 'Rua', 'DR MARIO FREIRE MARTINS', '194', 'MULTIPLO-USO SALA 02', 'CENTRO', '28545000', '(22)2554910'],
    ['Macuco', 'Pequeno I', 'PROGRAMA DE ATENDIMENTO INTEGRAL A FAMILIA', 'Rua', 'ANGELO BIANCHINI', '0', '', 'NOVA MACUCO', '28540000', '(22)2554187'],
    ['Magé', 'Grande', 'CRAS MAGE II', 'Rua', 'CASSIMIRO DE ABREU', '230', '', 'RIO DO OURO', '25920000', '(21)3632178'],
    ['Magé', 'Grande', 'CRAS MAGÉ I', 'Travessa', 'AIRTON INÁCIO DA SILVEIRA', '0', 's/nº', 'VILA NOVA', '25900000', '(21)2633336'],
    ['Magé', 'Grande', 'CRAS SURUÍ I', 'Rua', 'JOSÉ ZARZUR', '142', '', 'SURUÍ', '25925000', '(21)3632206'],
    ['Magé', 'Grande', 'CRAS VILA INHOMIRIM II', 'Rua', 'Francisca Gomes dos Santos', '60', '', 'Fragoso', '25935000', '(21)2739635'],
    ['Magé', 'Grande', 'CRAS VILA INHOMIRIM III', 'Rua', 'SANTA CECÍLIA', '90', '', 'PARQUE CAÇULA', '25936710', '(21)9995673'],
    ['Magé', 'Grande', 'CRAS SANTO ALEIXO I', 'Rua', 'OTHON LINCH B DE MELLO', '0', '', 'SANTO ALEIXO', '25912206', '(21)3632100'],
    ['Magé', 'Grande', 'CRAS VILA INHOMIRIM I', 'Avenida', 'CAIOABA', '0', 's/nº', 'PIABETÁ', '25915000', '(21)2650966'],
    ['Magé', 'Grande', 'CRAS GUIA DE PACOBAÍBA I', 'Rua', '59', '0', 'MAUÁ', 'JARDIM DA PAZ', '25930000', '(21)2631861'],
    ['Mangaratiba', 'Pequeno II', 'CRAS Ismael Orestino da Silva', 'Rua', 'JOSE ALVES DEE SOUZA E SILVA', '80', 'LT 80', 'CENTRO', '23860000', '(21)2789601'],
    ['Mangaratiba', 'Pequeno II', 'CRAS PRAIA DO SACO', 'Avenida', 'FREI AFONSO JORGE BRAGA', '0', 'QD 4  LT20', 'PRAIA DO SACO', '23860000', '(21)3789309'],
    ['Mangaratiba', 'Pequeno II', 'CRAS SERRA DO PILOTO', 'Estrada', 'SÃO JOÃO MARCOS', '0', 'S/N', 'SERRA DO PILOTO', '23860000', '(21)3789368'],
    ['Mangaratiba', 'Pequeno II', 'CRAS Antonio Canella da Costa', 'Rua', 'JOAO BONDIM', '0', 'MORRO SÃO SEBASTIÃO', 'MURIQUI', '23860000', '(21)2780430'],
    ['Mangaratiba', 'Pequeno II', 'CRAS Alziro Gibram Simões', 'Rua', 'Ceci', '143', '', 'ITACURUCA', '23860000', '(21)2680724'],
    ['Mangaratiba', 'Pequeno II', 'CRAS CONCEICAO DE JACAREI', 'Rua', 'Jose Batista Maia', '25', '', 'CONCEICAO DE JACAREI', '23860000', '(21)3789301'],
    ['Maricá', 'Grande', 'CRAS  SANTA PAULA', 'Rua', '05 LOTE 01 A2 QUADRA 19', '0', 'S/N', 'INOÃ', '24900000', '(21)2637364'],
    ['Maricá', 'Grande', 'CRAS JARDIM ATLÂNTICO', 'Rua', 'DARCY ROQUE DA SILVEIRA QUADRA 485 LOTE 06', '0', '', 'JARDIM ATLÂNTICO', '24900000', '(21)2634082'],
    ['Maricá', 'Grande', 'CRAS REGIÃO OCEÂNICA', 'Avenida', 'MAÍSA MONJARDIM Quadra 195 Lote05', '0', '', 'PONTA NEGRA', '24900000', '(21)2637364'],
    ['Maricá', 'Grande', 'CRAS CENTRO', 'Rua', 'DOMICIO DA GAMA', '0', 'LT.18-QD.03', 'CENTRO', '24900000', '(21)3731035'],
    ['Maricá', 'Grande', 'CRAS CEU', 'Rodovia', 'AMARAL PEIXOTO KM 27', '0', '', 'MUMBUCA', '24912760', '(21)2634082'],
    ['Maricá', 'Grande', 'CRAS ITAIPUAÇU', 'Rua', 'PROFESSOR CARDOSO DE MENEZES QUADRA 01 LOTE 37', '0', '', 'ITAIPUAÇU', '24900000', '(21)2638652'],
    ['Maricá', 'Grande', 'CRAS INOÃ', 'Rua', '05 Lote  01 Barra Quadra 19', '0', '', 'Inoã', '24940550', '(21)2636653'],
    ['Maricá', 'Grande', 'CRAS SÃO JOSÉ', 'Rua', 'IBIAPINA LOTES 21 E 22 QUADRA 44', '0', '', 'São José do Imbassaí', '24900000', '(21)2636850'],
    ['Mendes', 'Pequeno I', 'CRAS 4', 'Rua', 'Pinto da Fonseca', '1', '', 'Humberto Antunes', '26700000', '(24)2465682'],
    ['Mendes', 'Pequeno I', 'CRAS 1', 'Rua', 'Estela Rudge, S/N', '0', '', 'Oscar Rudge', '26700000', '(24)2465227'],
    ['Mendes', 'Pequeno I', 'CRAS 2', 'Rua', 'PREFEITO RUBENS JOSE DE MACEDO, S/N', '0', '', 'MARTINS COSTA', '26700000', '(24)2465612'],
    ['Mesquita', 'Grande', 'CRAS SANTA TEREZINHA', 'Rua', 'Hélio Mendes do Amaral /Sete Anões', '220', '', 'SANTA TEREZINHA', '26554420', '(21)2797032'],
    ['Mesquita', 'Grande', 'CRAS ROCHA SOBRINHO', 'Avenida', 'Coelho da Rocha', '1426', '', 'Rocha Sobrinho', '26572481', '(21)3763976'],
    ['Mesquita', 'Grande', 'CRAS CHATUBA', 'Rua', 'Magno de Carvalho', '1302', 'FUNDOS', 'Chatuba', '26587021', '(21)3763600'],
    ['Mesquita', 'Grande', 'CRAS JUSCELINO', 'Avenida', 'São Paulo', '465', '', 'Juscelino', '26580140', '(21)3763751'],
    ['Mesquita', 'Grande', 'CRAS BANCO DE AREIA', 'Rua', 'Bicuíba', '48', '', 'Banco de Areia', '26570090', '(21)2697770'],
    ['Miguel Pereira', 'Pequeno II', 'CRAS PAIF I', 'Rua', 'Dr. Osório de Almeida', '550', 'casa', 'GOVERNADOR PORTELA', '26910000', '(24)2483831'],
    ['Miguel Pereira', 'Pequeno II', 'CRAS PAIF II', 'Travessa', 'PANTREZINA', '199', 'casa', 'PRACA DA PONTE', '26900000', '(24)2483047'],
    ['Miracema', 'Pequeno II', 'CRAS II Professora Ana Lúcia de Oliveira', 'Rua', 'BERNARDINO CARDOSO DIAS', '0', '', 'Vila Nova', '28460000', '(22)3852742'],
    ['Miracema', 'Pequeno II', 'CRAS I Demétrio Damasceno', 'Avenida', 'CARVALHO', '1228', '', 'JARDIM BEVERLY', '28460000', '(22)3852099'],
    ['Natividade', 'Pequeno I', 'CRAS - CANTINHO DO FIORELLO', 'Rua', 'Dr. ANTONIO CAMPOS CAVALCANTE', '0', 'PREDIO', 'CANTINHO DO FIORELLO', '28380000', '(22)3841221'],
    ['Natividade', 'Pequeno I', 'CRAS - QUERENDO', 'Rua', 'RUA:  EDUARDO LACERDA DA SILVA', '0', 'Casa', 'DISTRITO BOM JESUS DO QUERENDO', '28380000', '(22)3844508'],
    ['Nilópolis', 'Grande', 'CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL - CRAS FRANÇA LEITE', 'Rua', 'Antônio Félix', '721', '', 'CENTRO', '26520081', '(21)2791197'],
    ['Nilópolis', 'Grande', 'CRAS CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL - CRAS NOVA CIDADE', 'Rua', 'GONÇALVES DIAS S/Nº', '0', 'N° PARA LOCALIZAÇÃO NO GEORREFERENCIAMENTO', 'NOVA CIDADE', '26530180', '(21)3762831'],
    ['Nilópolis', 'Grande', 'CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL - CRAS PAIOL', 'Rua', 'CARLOS DE SOUZA FERNANDES', '0', 'LOTE 215 QUADRA D', 'PAIOL DE PÓLVORA', '26545015', '(21)3762831'],
    ['Nilópolis', 'Grande', 'CRAS NOVO HORIZONTE', 'Rua', 'JOÃO DA MATA PEIXOTO', '596', '', 'NOVO HORIZONTE', '26535340', '(21)2691177'],
    ['Nilópolis', 'Grande', 'CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL - CRAS SOFIA', 'Rua', 'SOFIA', '111', '', 'NOSSA SENHORA DE FÁTIMA', '26525510', '(21)3762831'],
    ['Nilópolis', 'Grande', 'CRAS CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL - CRAS CABRAL', 'Rua', 'ROLDÃO GONÇALVES, S/Nº', '0', 'N° PARA LOCALIZAÇÃO NO GEORREFERENCIAMENTO', 'CABRAL', '26515041', '(21)2792895'],
    ['Niterói', 'Grande', 'CRAS Preventório', 'Rua', 'Santa Candida', '10', '', 'Charitas', '24370105', '(21)0000000'],
    ['Niterói', 'Grande', 'CRAS Jurujuba', 'Avenida', 'Carlos Ermelindo Marins', '34', '', 'JURUJUBA', '24370292', '(21)3602459'],
    ['Niterói', 'Grande', 'CRAS Badu', 'Estrada', 'Estrada Caetano Monteiro', '820', '', 'Badu', '24320570', '(21)0000000'],
    ['Niterói', 'Grande', 'CRAS Centro', 'Rua', 'Evaristo da Veiga', '0', '0', 'Centro', '24020280', '(21)2613662'],
    ['Niterói', 'Grande', 'CRAS Santa Bárbara - Manuel Augusto Vicente', 'Avenida', 'Desembargador Nestor Rodrigues Perlingeiro', '860', '', 'Santa Barbara', '24141330', '(21)2717202'],
    ['Niterói', 'Grande', 'CRAS Vila Ipiranga', 'Rua', 'Tenente Osório, S/N', '0', '', 'Vila Ipiranga', '24130209', '(21)2625343'],
    ['Niterói', 'Grande', 'CRAS BARRETO', 'Rua', 'Dr. Luis Palmier, S/Nº', '0', '', 'Barreto', '24110000', '(21)2628161'],
    ['Niterói', 'Grande', 'CRAS Cafubá', 'Rua', 'Deputado José Luiz Erthal', '320', '', 'Cafubá', '24333028', '(21)2619398'],
    ['Niterói', 'Grande', 'CRAS Morro do Céu', 'Rua', 'da Horta', '0', '', 'Caramujo', '24141000', '(21)2717404'],
    ['Niterói', 'Grande', 'CRAS Cubango', 'Rua', 'Desembargador Lima Castro', '241', '', 'Fonseca', '24120350', '(21)2625411'],
    ['Nova Friburgo', 'Grande', 'CRAS CENTRO', 'Rua', 'MAC NIVEN', '4', '', 'Centro', '28610190', '(22)2528727'],
    ['Nova Friburgo', 'Grande', 'Campo do Coelho', 'Rua', 'Antônio Mario de Azevedo', '13256', '', 'Campo do Coelho', '28630590', '(22)2543141'],
    ['Nova Friburgo', 'Grande', 'Cras Olaria', 'Rua', 'JULIO ANTONIO THURLER', '430', '', 'OLARIA', '28620000', '(22)2533241'],
    ['Nova Friburgo', 'Grande', 'CRAS Conselheiro Paulino', 'Rua', 'Antenor Fernandes', '8', '', 'centro conselheiro paulino', '28600000', '(22)2533124'],
    ['Nova Iguaçu', 'Grande', 'CRAS VILA DE CAVA', 'Rua', 'VICTOR HUGO', '0', 'S/N', 'VILA DE CAVA', '26000000', '(21)2667921'],
    ['Nova Iguaçu', 'Grande', 'CRAS CERÂMICA', 'Rua', 'DONA GISELE URIN', '25', '', 'CERAMICA', '26031810', '(21)2669144'],
    ['Nova Iguaçu', 'Grande', 'CRAS NOVA ERA', 'Rua', 'INOCENCIO FERREIRA', '42', '', 'JARDIM NOVA ERA', '26272160', '(21)3794836'],
    ['Nova Iguaçu', 'Grande', 'CRAS COMENDADOR SOARES', 'Rua', 'RECIFE', '530', '', 'JARDIM PERNAMBUCO', '26251210', '(21)2695452'],
    ['Nova Iguaçu', 'Grande', 'CRAS DOM BOSCO', 'Rua', 'GELO', '0', 'CONJUNTO DOM BOSCO', 'MARAPICU', '26298027', '(21)2695452'],
    ['Nova Iguaçu', 'Grande', 'CRAS AUSTIN', 'Rua', ': Santo Inácio', '50', '', 'AUSTIN', '26087180', '(21)2763122'],
    ['Nova Iguaçu', 'Grande', 'CRAS VALVERDE', 'Rua', 'abilio augusto tavora', '0', '', 'Valverde', '26000000', '(21)2695055'],
    ['Nova Iguaçu', 'Grande', 'CRAS JARDIM PARAÍSO', 'Rua', 'DAS MARGARIDAS', '0', '', 'Jardim Paraíso', '26000000', '(21)3778010'],
    ['Nova Iguaçu', 'Grande', 'CRAS MIGUEL COUTO', 'Estrada', 'SANTA BÁRBARA', '2083', '', 'GRAMA', '26000000', '(21)2768189'],
    ['Nova Iguaçu', 'Grande', 'CRAS CENTRO', 'Rua', 'Terezinha Pinto', '297', '', 'CENTRO', '26215210', '(21)2669144'],
    ['Paracambi', 'Pequeno II', 'CRAS IV - SABUGO', 'Rua', 'Feliciano dos Anjos Teixeira', '830', 'casa 2', 'Sabugo', '26600000', '(21)2683362'],
    ['Paracambi', 'Pequeno II', 'CRAS I - LAGES - PRAÇA DO MIRO', 'Rua', 'Bezerra de Menezes', '611', '', 'Lages', '26600000', '(21)3693622'],
    ['Paracambi', 'Pequeno II', 'CRAS II - PARACAMBI - CENTRO', 'Rua', 'Dr Soares Filho', '115', 'Fundos', 'Centro', '26600000', '(21)3693295'],
    ['Paracambi', 'Pequeno II', 'CRAS III - GUARAJUBA', 'Rua', 'São João', '50', '', 'Guarajuba', '26600000', '(21)3693288'],
    ['Paracambi', 'Pequeno II', 'CRAS V - JARDIM NOVA ERA', 'Rua', 'dos Lírios', '285', '', 'Jardim Nova Era', '26600000', '(21)3693126'],
    ['Paraíba do Sul', 'Pequeno II', 'CRAS - CENTRO', 'Avenida', 'Marechal Castelo Branco', '940', '', 'Centro', '25850000', '(24)2263114'],
    ['Paraíba do Sul', 'Pequeno II', 'CRAS - VILA SALUTARIS', 'Rua', 'Heinz G Weill', '36', 'Fundos', 'VILA SALUTARIS', '25850000', '(24)2263386'],
    ['Parati', 'Pequeno II', 'CRAS RURAL', 'Avenida', 'Roberto da Silveira/A', '2203', 'C', 'Vila Colonial', '23970000', '(24)3371861'],
    ['Parati', 'Pequeno II', 'CRAS CENTRAL - 33038006703', 'Avenida', 'Av. Roberto da Silveira', '2302', 'BR 101', 'Vila Colonial', '23970000', '(24)3371861'],
    ['Paty do Alferes', 'Pequeno II', 'CRAS Avelar', 'Rua', 'Dr. Manoel Vieira Muniz', '11', '', 'Avelar', '26980000', '(24)2487118'],
    ['Paty do Alferes', 'Pequeno II', 'CRAS CENTRO', 'Rua', 'DO RECANTO', '46', '', 'CENTRO', '26950000', '(24)2485272'],
    ['Petrópolis', 'Grande', 'CRAS POSSE', 'Estrada', 'União e Indústria', '32965', 'Praça corta Rio', 'Posse', '25770470', '(24)2259136'],
    ['Petrópolis', 'Grande', 'CRAS VALE DO CARANGOLA', 'Rua', 'Waldemar Vieira Afonso', '19', '', 'Vale do Carangola', '25715402', '(24)2246633'],
    ['Petrópolis', 'Grande', 'CRAS RETIRO', 'Rua', 'Henrique Dias', '221', '', 'Retiro', '25680276', '(24)2246456'],
    ['Petrópolis', 'Grande', 'CRAS QUITANDINHA', 'Rua', 'ALAGOAS', '0', '', 'QUITANDINHA', '25650170', '(24)2246915'],
    ['Petrópolis', 'Grande', 'CRAS Madame Machado', 'Rua', 'Geraldo Lourenço Dias', '0', '', 'Madame Machado', '25745702', '(24)2249428'],
    ['Petrópolis', 'Grande', 'CRAS Corrêas', 'Rua', 'Vigário Corrêa', '443', '', 'Corrêas', '25720322', '(24)2221004'],
    ['Petrópolis', 'Grande', 'CRAS CENTRO', 'Rua', 'VINTE E QUATRO DE MAIO', '0', '', 'CENTRO', '25640550', '(24)2245827'],
    ['Petrópolis', 'Grande', 'CRAS ITAIPAVA', 'Estrada', 'União e Indústria', '11860', 'Sala 8', 'Itaipava', '25730745', '(24)2246874'],
    ['Pinheiral', 'Pequeno II', 'CRAS II', 'Rua', 'Manoel Torres', '357', 'Casa', 'Cruzeiro II', '27197000', '(24)3356406'],
    ['Pinheiral', 'Pequeno II', 'CRAS I', 'Rua', 'Manaus', '77', '', 'Parque Mayra', '27197000', '(24)3356568'],
    ['Piraí', 'Pequeno II', 'CRAS ARROZAL', 'Praça', 'Theodora Barbosa Ribeiro', '61', 'CENTRO', 'ARROZAL', '27185000', '(24)3333120'],
    ['Piraí', 'Pequeno II', 'CRAS PIRAÍ', 'Rua', 'Manoel Teixeira Campos Junior', '88', '', 'Centro', '27175000', '(24)2431250'],
    ['Porciúncula', 'Pequeno I', 'CRAS SANTA CLARA', 'Rua', 'EUFIZINIO G PUDDO', '1', '', 'CENTRO', '28398000', '(22)3844111'],
    ['Porciúncula', 'Pequeno I', 'CRAS / Purilândia', 'Rua', 'Mauro Alves Ribeiro', '1', '2º Distrito', 'Centro', '28396000', '(22)3844213'],
    ['Porciúncula', 'Pequeno I', 'CRAS/Porciúncula', 'Rua', 'Pedro Lopes de Oliveira', '637', '', 'Vale do Sol', '28390000', '(22)3842121'],
    ['Porto Real', 'Pequeno I', 'CRAS NOVO HORIZONTE', 'Rua', 'Um', '0', '', 'Novo Horizonte', '27570000', '(24)0000000'],
    ['Porto Real', 'Pequeno I', 'CRAS FÁTIMA', 'Rua', 'FLORIANO X PORTO REAL', '109', '', 'BAIRRO N. S. DE FÁTIMA', '27570000', '(24)3353177'],
    ['Quatis', 'Pequeno I', 'CRAS CENTRO', 'Avenida', 'EUCLIDES ALVES GUIMARÃES COTIA', '78', '', 'CENTRO', '27430140', '(24)3353305'],
    ['Quatis', 'Pequeno I', 'CRAS DONA JULIA ESPERANÇA', 'Rua', 'CAPITÃO APRIGIO BARBOSA LIMA', '176', '', 'JARDIM INDEPENDÊNCIA', '27430010', '(24)3353227'],
    ['Queimados', 'Grande', 'CRAS IV - SÃO JORGE', 'Rua', 'Henrique', '7', '', 'São Jorge', '26300000', '(21)3698067'],
    ['Queimados', 'Grande', 'CRAS VI - JARDIM DA FONTE', 'Rua', 'THOMAS PEREIRA DA SILVA', '6', '', 'JARDIM DA FONTE', '26390000', '(21)3698834'],
    ['Queimados', 'Grande', 'CRAS II - PARQUE SANTIAGO', 'Rua', 'Estrada do Riachão', '2', '', 'Santiago', '26330150', '(21)3699329'],
    ['Queimados', 'Grande', 'CRAS VII - NOVA CIDADE', 'Rua', 'MARIA CARLOS', '18', '', 'NOVA CIDADE', '26380280', '(21)2779922'],
    ['Queimados', 'Grande', 'CRAS VIII - GLORIA', 'Rua', 'São Nicolau', '153', '', 'Nossa Senhora da Glória', '26300000', '(21)3778785'],
    ['Queimados', 'Grande', 'CRAS III - INCONFIDENCIA', 'Avenida', 'TIRADENTES', '258', 'LT 08 QD 12', 'INCONFIDENCIA', '26320000', '(21)3778802'],
    ['Queimados', 'Grande', 'CRAS Vandir Dutra (CRAS V)', 'Rua', 'Macaé', '430', '', 'São Roque', '26310040', '(21)3764944'],
    ['Queimados', 'Grande', 'CRAS I - NOVO ELDORADO', 'Rua', 'TEREZINHA SIMÃO', '7', 'LT 10 QD 15', 'NOVO ELDORADO', '26390380', '(21)2665832'],
    ['Quissamã', 'Pequeno II', 'CRAS I - SITIO QUISSAMÃ', 'Rua', 'GESSY BARCELOS', '0', '', 'SITIO QUISSAMA', '28735000', '(22)2768659'],
    ['Quissamã', 'Pequeno II', 'BARRA DO FURADO', 'Rua', 'RUA VICENTE RIBEIRO DA SILVA', '0', '', 'BARRA DO FURADO', '28735000', '(22)2768254'],
    ['Resende', 'Grande', 'CRAS JARDIM ESPERANÇA', 'Rua', 'FREI TITO', '27', '', 'JARDIM ESPERANÇA', '27540660', '(24)3354467'],
    ['Resende', 'Grande', 'CRAS ITINERANTE', 'Rua', 'Simão da Cunha', '5', '', 'Centro', '27501970', '(24)3360951'],
    ['Resende', 'Grande', 'Lavapés', 'Rua', 'Celestino de Paula', '29', 'casa', 'Lavapés', '27511040', '(24)3360988'],
    ['Resende', 'Grande', 'CRAS PARAÍSO', 'Avenida', 'Abílio Godoy', '127', '', 'Paraíso', '27500000', '(24)3381207'],
    ['Resende', 'Grande', 'ITAPUCA', 'Rua', 'WILLY FAULSTICH', '64', '', 'ELITE', '27522214', '(24)3381617'],
    ['Resende', 'Grande', 'CRAS Toyota', 'Avenida', 'Projetada', '0', '', 'Toyota II', '27525526', '(24)3360509'],
    ['Rio Bonito', 'Médio', 'CRAS ESPAÇO CIDADÃO', 'Rua', 'CAMILO HENRINGER SERRA', '3', 'CASA', 'PARQUE DAS ACACIAS', '28800000', '(21)3634803'],
    ['Rio Bonito', 'Médio', 'CRAS ESPAÇO FAMÍLIA', 'Rua', 'MAJOR BEZERRA CAVALCANTE', '654', '', 'CENTRO', '28800000', '(21)2734191'],
    ['Rio Bonito', 'Médio', 'CRAS ESPERANCA', 'Rua', '2', '0', 'PARQUE ANDREA', 'BOA ESPERANCA', '28810000', '(21)2747842'],
    ['Rio Claro', 'Pequeno I', 'CRAS PASSA TRÊS', 'Rua', 'VICTOR KONDER', '65', '4° DISTRITO', 'PASSA TRÊS', '27470000', '(24)3332171'],
    ['Rio Claro', 'Pequeno I', 'CRAS RIO CLARO', 'Praça', 'FAGUNDES VARELLA', '30', '1° DISTRITO', 'CENTRO', '27460000', '(24)3332119'],
    ['Rio Das Flores', 'Pequeno I', 'Centro de Referência da Assistência Social do Centro', 'Rua', 'Coronel Ladislau Guedes', '7', '', 'Centro', '27660000', '(24)2458134'],
    ['Rio Das Flores', 'Pequeno I', 'Centro de Referência da AssistÊncia Social de Tabôas', 'Alameda', 'Antonio S Avila', '18', '', 'Tabôas', '27665000', '(24)2458536'],
    ['Rio Das Ostras', 'Grande', 'CRAS Rocha Leão', 'Rua', 'Isolino Almeida', '5', 'Cruzamento entre a RFFSA e a Rua Isolino Almeida', 'Rocha Leão', '28890000', '(22)2777143'],
    ['Rio Das Ostras', 'Grande', 'CRAS Região Sul', 'Rua', 'Serafim Bastos', '0', 's/n', 'Cidade Beira Mar', '28890000', '(22)2771640'],
    ['Rio Das Ostras', 'Grande', 'CRAS Região Norte', 'Rua', 'Peperônia', '82', 'Qd 56', 'Âncora', '28899563', '(22)2771570'],
    ['Rio Das Ostras', 'Grande', 'CRAS Região Central', 'Rua', 'Três Marias, S/ N°', '0', '', 'Nova Cidade', '28890000', '(22)2771291'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS FRANCISCO SALES DE MESQUITA', 'Avenida', 'SARGENTO DE MILICIAS', '0', '', 'PAVUNA', '21525660', '(21)2407229'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS CAIO FERNANDO ABREU', 'Avenida', 'DOS DEMOCRATICOS', '646', '', 'MANGUINHOS', '21050000', '(21)2293429'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS DR. SOBRAL PINTO', 'Rua', 'DR LEAL', '706', 'TERREO', 'ENGENHO DE DENTRO', '20730380', '(21)3273037'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS ADALBERTO ISMAEL DE SOUZA', 'Avenida', 'BARTOLOMEU GUSMÃO', '1100', 'FUNDOS', 'SÃO CRISTOVÃO', '20941160', '(21)3234171'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS PROFESSORA ISMÊNIA LIMA MARTINS', 'Rua', 'DA ALFANDEGA', '114', '', 'CENTRO', '20070004', '(21)2224806'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS DEPUTADO LUÍS EDUARDO MAGALHÃES', 'Rua', 'PARAÍSO DO TUIUTÍ', '0', '', 'SÃO CRISTOVÃO', '20920220', '(21)3895866'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS RUBENS CORRÊA', 'Rua', 'CAPITÃO ALIATAR MARTINS', '211', '', 'IRAJÁ', '21235515', '(21)3013463'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS ACARI', 'Rua', 'GUAIUBA', '150', '', 'ACARI', '21531060', '(21)3375801'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS ZÓZIMO BARROSO DO AMARAL', 'Rua', 'OLIVA MAIA', '81', 'CASA 102', 'MADUREIRA', '21350180', '(21)3018372'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS MARIA THEREZA FREIRE MOURA', 'Rua', 'SILVA CARDOSO', '967', '', 'BANGU', '21815071', '(21)3463793'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS CECÍLIA MEIRELES', 'Rua', 'VIUVA DANTAS', '695', '', 'CAMPO GRANDE', '23052090', '(21)3403596'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS PROFESSOR DARCY RIBEIRO', 'Estrada', 'GOVERNADOR CHAGAS FREITAS', '1900', 'PARQUE ROYAL', 'Portuguesa', '21932820', '(21)3393992'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS MARIA DA LUZ DOS SANTOS', 'Rua', 'ANA QUINTÃO', '380', '', 'PIEDADE', '20751240', '(21)3111754'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS ROSANI CUNHA', 'Rua', 'VISCONDE DE SANTA ISABEL', '412', 'FDS', 'GRAJAÚ', '20560121', '(21)3278644'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS ALUNO MARCELO CARDOSO TOMÉ', 'Rua', 'DO RADIO', '0', '', 'CAMPO GRANDE', '23087060', '(21)3394446'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS ELIS REGINA', 'Rua', 'EDGARD WERNECK', '1565', 'FUNDOS', 'CIDADE DE DEUS', '22763970', '(21)3342792'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS GONZAGUINHA', 'Praça', 'BARAO DA TAQUARA', '9', '', 'PRAÇA SECA', '21321010', '(21)3017285'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS MARIA VIEIRA BAZANI', 'Estrada', 'DA MATRIZ', '4445', '', 'GUARATIBA', '23030320', '(21)3155244'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS BETTY FRIEDAN', 'Rua', 'PRAINHAS', '57', '', 'SEPETIBA', '23545115', '(21)3427987'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS HELONEIDA STUDART', 'Rua', 'RANGEL PESTANA', '510', '', 'BANGU', '21820040', '(21)3463721'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS IACYRA FRAZÃO SOUSA', 'Rua', 'ALBERI VIEIRA DOS SANTOS', '0', '', 'PACIÊNCIA', '23573160', '(21)3157400'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS MARIA CLARA MACHADO', 'Rua', 'EDUARDO PINTO VILAR', '0', 'CONJUNTO JOÃO XXIII', 'SANTA CRUZ', '23560260', '(21)3156909'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS JORGE GONÇALVES', 'Rua', 'PRIMEIRA', '61', 'FUNDOS', 'SANTA CRUZ', '23515180', '(21)3292743'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS PRESIDENTE ITAMAR FRANCO', 'Rua', 'CAÇAPAVA', '305', '', 'GRAJAÚ', '20541350', '(21)2268837'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS TIJUCA', 'Rua', 'GUAPIARA', '43', '', 'TIJUCA', '20521180', '(21)3872351'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS MARY RICHMOND', 'Rua', 'CONSELHEIRO FERRAZ', '54', '', 'LINS DE VASCONCELOS', '20710350', '(21)3278629'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS SEBASTIÃO TEODORO FILHO', 'Rua', 'SAINT ROMAN', '172', '', 'COPACABANA', '22071060', '(21)3111248'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS VILA MORETTI', 'Rua', 'ESPERANÇA', '30', '', 'BANGU', '21860160', '(21)3463172'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS JOSÉ CARLOS CAMPOS', 'Rua', 'GUARAMA', '0', '', 'ROCHA MIRANDA', '21210530', '(21)2475510'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS CIDADANIA RIO DAS PEDRAS', 'Praça', 'RUA NOVA', '20', 'B', 'ITANHANGÁ', '22753043', '(21)2447180'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS RAMOS', 'Avenida', 'CENTRAL', '0', 'Estação Alemão', 'COMPLEXO DO ALEMÃO', '21061700', '(21)3886319'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS ANILVA DUTRA MENDES', 'Rua', 'FRANZ LISTZ', '0', '', 'JARDIM AMÉRICA', '21240430', '(21)2475510'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS DEPUTADO JOÃO FASSARELA', 'Rua', 'FLORA LOBO', '0', 'PARQUE ARI BARROSO', 'PENHA CIRCULAR', '22210500', '(21)2573122'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS DODO DA PORTELA', 'Avenida', 'MARECHAL FLORIANO', '191', '', 'CENTRO', '20080005', '(21)2213253'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS PADRE VELOSO', 'Rua', 'SÃO CLEMENTE', '312', '', 'BOTAFOGO', '22260000', '(21)2535446'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS OSWALDO ANTONIO FERREIRA', 'Rua', 'DONA OLÍMPIA', '220', '', 'REALENGO', '21765020', '(21)3335054'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS NELSON MANDELA', 'Rua', 'DA REGENERAÇÃO', '654', '', 'BONSUCESSO', '21040170', '(21)3867485'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS YARA AMARAL', 'Rua', 'NEI VIDAL', '43', '', 'GUADALUPE', '21675360', '(21)3018625'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS ZUMBI DOS PALMARES', 'Estrada', 'DOS BANDEIRANTES', '11227', '', 'VARGEM PEQUENA', '22783116', '(21)2408022'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS GERMINAL DOMINGUES', 'Rua', 'AMBIRÉ CAVALCANTI', '95', '', 'RIO COMPRIDO', '20250490', '(21)2293339'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS XV DE MAIO', 'Rua', 'GENERAL SAMPAIO', '74', '', 'CAJU', '20931970', '(21)3895866'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS CARLOS DRUMMOND DE ANDRADE', 'Rua', 'TAPEROÁ', '308', 'MORRO CARACOL', 'PENHA', '21070680', '(21)3884839'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS LUIZA MAHIM', 'Rua', 'CAMPO GRANDE', '3058', '', 'INHOAIBA', '23070000', '(21)2415410'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS MACHADO DE ASSIS', 'Estrada', 'RODRIGUES CALDAS', '3400', '', 'COLONIA JULIANO MOREIRA', '22713375', '(21)2446195'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS RINALDO DE LAMARE', 'Avenida', 'NIEMEYER', '776', '8O. E 9O. ANDARES', 'SÃO CONRADO', '22450221', '(21)3111108'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS OLIMPIA ESTEVES', 'Rua', 'SANTA CECÍLIA', '984', 'TÉRREO', 'BANGU', '21810080', '(21)3463833'],
    ['Rio de Janeiro', 'Metrópole', 'CRAS PROFESSORA HELENICE NUNES JACINTHO', 'Travessa', 'JK', '5', '31 de Outubro', 'Paciência', '23585127', '(21)3096318'],
    ['Santa Maria Madalena', 'Pequeno I', 'CRAS - CENTRO', 'Rua', 'Coronel Portugal', '16', '', 'Centro', '28770000', '(22)2561329'],
    ['Santa Maria Madalena', 'Pequeno I', 'CRAS -Largo do Machado', 'Praça', 'Luiz Machado', '38', '', 'Largo do Machado', '28770000', '(22)2561327'],
    ['Santa Maria Madalena', 'Pequeno I', 'CRAS - Triunfo', 'Rua', 'Cel. José Teixeira Genelhoud', '21', '', 'Triunfo - 2° Distrito', '28770000', '(22)2561202'],
    ['Santo Antônio de Pádua', 'Pequeno II', 'CRAS José Miguel', 'Rua', 'Dr. Ferreira da Luz', '618', 'casa 1', 'Centro', '28470000', '(22)3853214'],
    ['Santo Antônio de Pádua', 'Pequeno II', 'CIDADE NOVA', 'Rua', 'Recanto da Saudade', '17', 'Campo Alegre', 'campo alegre', '28470000', '(22)3853417'],
    ['São Fidélis', 'Pequeno II', 'CRAS Filotéia Bragança', 'Praça', 'Filotéia Bragança', '48', 'B', 'São Vicente de Paula', '28400000', '(22)2758527'],
    ['São Fidélis', 'Pequeno II', 'CRAS Duque de Caxias', 'Rua', 'Frei Vitório', '621', '', 'Centro', '28400000', '(22)2758646'],
    ['São Francisco de Itabapoana', 'Pequeno II', 'CRAS CENTRO', 'Rua', 'JOÃO PAES VIANA', '29', '', 'CENTRO', '28230000', '(22)2789116'],
    ['São Francisco de Itabapoana', 'Pequeno II', 'CRAS - PRAÇA JOÃO PESSOA', 'Rua', 'PROJETADA D', '0', '', 'PRAÇA JOÃO PESSOA', '28230000', '(22)2789116'],
    ['São Francisco de Itabapoana', 'Pequeno II', 'CRAS - ILHA DOS MINEIROS', 'Rua', 'SEIS', '0', '', 'ILHA DOS MINEIROS', '28230000', '(22)2789116'],
    ['São Gonçalo', 'Metrópole', 'CRAS VISTA ALEGRE', 'Rua', 'SÃO PEDRO', '2', '', 'VISTA ALEGRE', '24400000', '(21)2706360'],
    ['São Gonçalo', 'Metrópole', 'CRAS CENTRO', 'Rua', 'Dona Clara', '541', '', 'CENTRO', '24425005', '(21)2604457'],
    ['São Gonçalo', 'Metrópole', 'CRAS PORTO DO ROSA', 'Rua', 'ERNESTO LAVISSE', '2424', '', 'PORTO DO ROSA', '24470390', '(21)2605265'],
    ['São Gonçalo', 'Metrópole', 'CRAS NEVES', 'Rua', 'Lenor', '108', 'casa 1', 'Porto Velho', '24430150', '(21)2624001'],
    ['São Gonçalo', 'Metrópole', 'CRAS ALCÂNTARA', 'Rua', 'Oscar Lourenço', '632', '', 'ALCANTARA', '24440440', '(21)2624644'],
    ['São Gonçalo', 'Metrópole', 'CRAS AMENDOEIRA', 'Estrada', 'DO PACHECO', '39', '', 'Amendoeira', '24732570', '(21)3701644'],
    ['São Gonçalo', 'Metrópole', 'CRAS SALGUEIRO', 'Estrada', 'Estrada  das Palmeiras', '106', '', 'Itauna', '24475002', '(21)3605242'],
    ['São Gonçalo', 'Metrópole', 'CRAS MARAMBAIA', 'Rua', 'Itália', '38', 'B', 'Marambaia', '24440440', '(21)2603579'],
    ['São Gonçalo', 'Metrópole', 'CRAS MARIA PAULA', 'Rua', 'ANTONIO ALVES BELMONT', '385', '', 'MARIA PAULA', '24756320', '(21)2617606'],
    ['São Gonçalo', 'Metrópole', 'CRAS TRIBOBO', 'Rua', 'PASTOR MARTIN LUTHER KING', '500', '', 'TRIBOBÓ', '24400000', '(21)3711274'],
    ['São Gonçalo', 'Metrópole', 'CRAS GALO BRANCO', 'Rua', 'ALEXANDRINO CUNHA', '114', '', 'GALO BRANCO', '24422290', '(21)2617631'],
    ['São Gonçalo', 'Metrópole', 'CRAS Barro Vermelho', 'Rua', 'JOÃO PESSOA', '372', '', 'BARRO VERMELHO', '24400000', '(21)3703593'],
    ['São Gonçalo', 'Metrópole', 'CRAS ENGENHO PEQUENO', 'Rua', 'MENTOR COUTO', '925', '', 'ENGENHO PEQUENO', '24417000', '(21)3703188'],
    ['São Gonçalo', 'Metrópole', 'CRAS GUAXINDIBA', 'Rua', 'AQUILINO DE CARVALHO', '0', '', 'GUAXINDIBA', '24722250', '(21)2614974'],
    ['São Gonçalo', 'Metrópole', 'CRAS SANTA IZABEL', 'Estrada', 'SANTA IZABEL', '95', '', 'SANTA IZABEL', '24735040', '(21)3710307'],
    ['São Gonçalo', 'Metrópole', 'CRAS SANTA LUZIA', 'Rua', 'INES PEIXOTO LOTE 20', '0', 'QUADRA 100', 'Jardim Catarina', '24400000', '(21)3606183'],
    ['São Gonçalo', 'Metrópole', 'CRAS ITAOCA', 'Rua', 'ANTONIO LEONCIO', '33', '', 'ITAOCA', '24471400', '(21)2607864'],
    ['São Gonçalo', 'Metrópole', 'CRAS JARDIM CATARINA', 'Rua', 'Leão Gambeta', '533', '', 'Jardim Catarina', '24716380', '(21)2603131'],
    ['São João da Barra', 'Pequeno II', 'CRAS AÇU', 'Rua', 'MANOEL FRANCISCO DE ALMEIDA', '0', 'CASA', 'AÇU', '28200000', '(22)2741937'],
    ['São João da Barra', 'Pequeno II', 'CRAS CAZUMBÁ', 'Praça', 'PRAÇA DE CAZUMBÁ', '0', '', 'CAZUMBÁ', '28200000', '(22)2741787'],
    ['São João da Barra', 'Pequeno II', 'CRAS ATAFONA', 'Rua', 'JOAQUIM BRITO MACHADO', '523', 'casa', 'ATAFONA', '28200000', '(22)2741102'],
    ['São João da Barra', 'Pequeno II', 'CRAS BARCELOS', 'Rua', 'RUA GREGÓRIO PRUDÊNCIO DE AZEVEDO S/N', '0', 'PRÉDIO', 'BARCELOS', '28200000', '(22)2741533'],
    ['São João da Barra', 'Pequeno II', 'CRAS GRUSSAI', 'Rua', 'MANOEL FRANÇA DA SILVA', '373', 'CASA', 'FIGUEIRA-GRUSSAÍ', '28200000', '(22)2741787'],
    ['São João de Meriti', 'Grande', 'CRAS Trio de Ouro', 'Rua', 'Morro das Pedras', '73', 'Qd.98', 'Trio de Ouro', '25515520', '(21)2651104'],
    ['São João de Meriti', 'Grande', 'CRAS Éden', 'Rua', 'Ana Brito da Silva', '2470', '', 'Éden', '25525512', '(21)2756937'],
    ['São João de Meriti', 'Grande', 'CRAS Centro', 'Rua', 'SÃO JOÃO BATISTA', '742', '', 'CENTRO', '25515520', '(21)2786580'],
    ['São João de Meriti', 'Grande', 'CRAS Jardim Íris', 'Rua', 'Av. Copacabana', '50', '', 'Jardim Íris', '25580000', '(21)3757283'],
    ['São João de Meriti', 'Grande', 'CRAS Vila São José', 'Rua', 'Comendador Teles', '3199', 'casa 2', 'Vila São José', '25570457', '(21)3755222'],
    ['São João de Meriti', 'Grande', 'CRAS Parque Tiete', 'Rua', 'Castro Alves', '0', 'lt 01 qd 07', 'Parque Tiete', '25586157', '(21)2651104'],
    ['São José de Ubá', 'Pequeno I', 'CRAS RURAL', 'Rua', 'Orestes Siqueira', '0', 'Prédio', 'Loteamento Nova Ubá', '28455000', '(22)3866173'],
    ['São José de Ubá', 'Pequeno I', 'CRAS URBANO', 'Avenida', 'DAVID VIEIRA NEY', '215', '', 'CENTRO', '28455000', '(22)3866105'],
    ['São José do Vale do Rio Preto', 'Pequeno II', 'CRAS - Centro', 'Estrada', 'Silveira da Motta', '25693', 'Casa', 'Centro', '25780000', '(24)2224160'],
    ['São Pedro da Aldeia', 'Médio', 'CRAS Gelson Pinheiro - RUA DO FOGO', 'Rua', 'Projetada C lote 11', '11', 'Quadra D', 'Rua do Fogo', '28940000', '(22)2625330'],
    ['São Pedro da Aldeia', 'Médio', 'CRAS Antonio Paulino de Souza - MORRO DO MILAGRE', 'Rua', 'Iracy dos Santos', '7', '', 'Morro do Milagre', '28940000', '(22)2625806'],
    ['São Pedro da Aldeia', 'Médio', 'CRAS Catarina Machado da Silva Borges - ALECRIM', 'Rua', 'Alfazema', '5', 'Lote 27', 'Alecrim', '28940000', '(22)2648806'],
    ['São Pedro da Aldeia', 'Médio', 'CRAS Palmiro Gomes - PORTO DA ALDEIA', 'Rua', 'Saputiaba', '51', '', 'Porto da Aldeia', '28940000', '(22)2627077'],
    ['São Pedro da Aldeia', 'Médio', 'CRAS Anibal Martins Ferreira - SAO JOAO', 'Rua', 'São Jorge', '465', '', 'São João', '28942854', '(22)2625491'],
    ['São Pedro da Aldeia', 'Médio', 'CRAS Prof. Carlota Pereira dos Santos - BALNEARIO', 'Rua', 'Nicanor Pereira dos Santos', '0', '', 'Balneario', '28940000', '(22)2621918'],
    ['São Sebastião do Alto', 'Pequeno I', 'CRAS VALÃO DO BARRO', 'Rua', 'MANOEL JOAQUIM TEIXEIRA VOGAS', '235', '', 'CENTRO', '28555000', '(22)2556138'],
    ['São Sebastião do Alto', 'Pequeno I', 'CRAS I - SEDE', 'Rua', 'EURICO CERBINO', '139', '', 'centro', '28555000', '(22)2559121'],
    ['Sapucaia', 'Pequeno I', 'CRAS ANTA - Thereza Rocha Kochem', 'Rua', 'Domingos Vieira', '95', '', 'ANTA', '25882000', '(24)2271007'],
    ['Sapucaia', 'Pequeno I', 'CRAS APARECIDA', 'Rua', 'José Pedro Nolasco', '11', '', 'Aparecida', '25886000', '(24)2271407'],
    ['Sapucaia', 'Pequeno I', 'CRAS PIÃO', 'Rua', 'José Arthur dos Santos', '180', '', 'PIÃO', '25884000', '(21)3641792'],
    ['Sapucaia', 'Pequeno I', 'CRAS JAMAPARÁ', 'Avenida', 'Paulino Fernandes Silva', '409', '', 'Jamapará', '25887000', '(24)2272202'],
    ['Sapucaia', 'Pequeno I', 'CRAS SAPUCAIA', 'Rua', 'Maurício de Abreu', '161', '', 'Centro', '25880000', '(24)2271123'],
    ['Saquarema', 'Médio', 'CRAS BACAXÁ', 'Rua', 'Capitão Nunes', '962', '', 'Barreira', '28993000', '(22)2653477'],
    ['Saquarema', 'Médio', 'CRAS RIO DA AREIA', 'Rua', 'José Ferreira, s/nº', '0', 's/nº', 'Rio da Areia', '28993000', '(22)2653050'],
    ['Saquarema', 'Médio', 'CRAS JACONÉ', 'Rua', '22 COM RUA 96', '16', 'LOTE 16 QUADRA 2229', 'JACONE', '28990972', '(22)2652205'],
    ['Saquarema', 'Médio', 'CRAS SAMPAIO CORREA', 'Rua', 'PRIMEIRO DE MAIO', '115', '', 'SAMPAIO CORREA', '28997000', '(22)2654221'],
    ['Seropédica', 'Médio', 'CRAS 2 - FAZENDA CAXIAS', 'Rua', 'DEMETRIO DE BRITO', '136', '', 'FAZENDA CAXIAS', '23890000', '(21)3787085'],
    ['Seropédica', 'Médio', 'CRAS 1 - CAMPO LINDO', 'Rua', 'Niteroi,', '27', '', 'Campo lindo', '23890000', '(21)2682632'],
    ['Seropédica', 'Médio', 'CRAS 3 - JARDIM MARACANÃ', 'Rua', 'ARLIETE DA SILVA RODRIGUES', '0', '', 'JD MARACANÃ', '23890000', '(21)3787884'],
    ['Seropédica', 'Médio', 'CRAS 4 - BOA ESPERANÇA', 'Rua', 'João Gonçalves da Silva', '0', 'QD 24 Lt. 01', 'BOA ESPERANÇA', '23890000', '(21)2682354'],
    ['Silva Jardim', 'Pequeno II', 'CRAS ESTADUAL RJ', 'Rua', 'Padre Antônio Pinto', '332', '', 'Centro', '28820000', '(22)2668819'],
    ['Silva Jardim', 'Pequeno II', 'CRAS Renascer', 'Rua', 'Padre Ávila', '137', '', 'Centro', '28820000', '(22)2668173'],
    ['Sumidouro', 'Pequeno I', 'CRAS - CENTRO', 'Rua', 'Dez de Junho', '331', 'casa', 'Centro', '28637000', '(22)2531131'],
    ['Sumidouro', 'Pequeno I', 'CRAS - Campinas', 'Avenida', 'João Faustino Lopes', '0', '', 'Campinas', '28637000', '(22)2531309'],
    ['Tanguá', 'Pequeno II', 'CRAS Bandeirante', 'Rua', '38', '0', 'Lt 14, Qd 18', 'Bandeirante I', '24890000', '(21)3749127'],
    ['Tanguá', 'Pequeno II', 'CRAS  Posse dos Coutinhos', 'Praça', 'Palmira Pacheco', '0', '', 'Posse dos Coutinhos', '24890000', '(21)3749112'],
    ['Tanguá', 'Pequeno II', 'CRAS DUQUES', 'Rua', 'SEMPRE VIVA', '310', '', 'DUQUES', '24890000', '(21)3639595'],
    ['Tanguá', 'Pequeno II', 'CRAS VILA CORTES', 'Rua', 'ODNEA CARVANLHO DE SOUZA', '9', 'LT 10 QD 11', 'VILA CORTES', '24890000', '(21)2747133'],
    ['Tanguá', 'Pequeno II', 'CRAS Centro', 'Rua', 'Demerval Garcia', '112', '', 'Centro', '24890000', '(21)2747126'],
    ['Teresópolis', 'Grande', 'CRAS Meudon', 'Rua', 'Caramurú', '108', '', 'Meudon', '25954175', '(21)3641143'],
    ['Teresópolis', 'Grande', 'CRAS FISCHER', 'Rua', 'Pedro Eleutério de Oliveira', '2738', '', 'Fischer', '25976280', '(21)3641949'],
    ['Teresópolis', 'Grande', 'CRAS ALTO', 'Rua', 'Nilza Chiapeta Fadigas', '190', '', 'Varzea', '25963150', '(21)3641301'],
    ['Teresópolis', 'Grande', 'CRAS BARROSO', 'Rua', 'Pará', '0', 's/n no final da rua', 'Barroso', '25976065', '(21)3642105'],
    ['Teresópolis', 'Grande', 'CRAS SÃO PEDRO', 'Rua', 'Fileuterpe', '845', 'casa', 'São Pedro', '25956005', '(21)2743830'],
    ['Trajano de Moraes', 'Pequeno I', 'CRAS CENTRO', 'Rua', 'DOUTOR JOSE DE MORAES', '15', '', 'CENTRO', '28750000', '(22)2564142'],
    ['Trajano de Moraes', 'Pequeno I', 'CRAS VISCONDE DE IMBÉ', 'Rua', 'Jugurta Tupinambá', '0', 's/n', 'VISCONDE DE IMBÉ', '28755000', '(22)2564005'],
    ['Três Rios', 'Médio', 'CRAS BEMPOSTA', 'Rua', 'Werneck', '0', '', 'Bemposta', '25840000', '(24)2258214'],
    ['Três Rios', 'Médio', 'CRAS VILA', 'Praça', 'Ambrosina Bastos', '32', '', 'Vila Isabel', '25815430', '(24)2252407'],
    ['Três Rios', 'Médio', 'CRAS CENTRO', 'Rua', 'XV de Novembro', '566', '', 'Centro', '25804000', '(24)2255138'],
    ['Três Rios', 'Médio', 'CRAS TRIANGULO', 'Rua', 'Santo Antônio', '200', '', 'Triângulo', '25820185', '(24)2255475'],
    ['Valença', 'Médio', 'CRAS VARGINHA', 'Rua', 'MACIEL NASCIMENTO,', '155', 'LOTE 1, QUADRA H', 'CHACRINHA', '27600000', '(24)2452800'],
    ['Valença', 'Médio', 'CRAS BARÃO DE JUPARANÃ', 'Rua', 'SILVIO CAMARGO', '14', 'CENTRO', 'DISTRITO DE BARÃO DE JUPARANÃ', '27640000', '(24)2471586'],
    ['Valença', 'Médio', 'CRAS CAMBOTA', 'Rua', 'PEDRO PONCIANO', '164', '', 'CAMBOTA', '27600000', '(24)2452431'],
    ['Varre-sai', 'Pequeno I', 'CRAS I', 'Rua', 'João Ramos Pereira', '18', '', 'Centro', '28375000', '(22)3843310'],
    ['Varre-sai', 'Pequeno I', 'CRAS II', 'Fazenda', 'Cruz da Ana', '0', '', 'Zona rural', '28375000', '(22)3843323'],
    ['Vassouras', 'Pequeno II', 'CRAS REPRESA DO GRECCO', 'Rua', 'TIBURCIO BARBOSA', '818', '', 'GRECCO', '27700000', '(24)2491102'],
    ['Vassouras', 'Pequeno II', 'CRAS TOCA DOS LEÕES', 'Rua', 'B', '0', '', 'Toca dos Leoes', '27700000', '(24)2491196'],
    ['Vassouras', 'Pequeno II', 'CRAS Centro', 'Rua', 'JOSÉ DE OLIVEIRA CURA', '7', '', 'Centro', '27700000', '(24)2471357'],
    ['Volta Redonda', 'Grande', 'CRAS Candelária', 'Rua', 'TORRES', '45', '', 'CANDELÁRIA', '27285660', '(24)3337201'],
    ['Volta Redonda', 'Grande', 'CRAS Rústico', 'Praça', '7B', '142', '', 'RÚSTICO', '27264290', '(24)3339427'],
    ['Volta Redonda', 'Grande', 'CRAS Santa Rita de Cássia', 'Rua', 'DA GRANJA', '40', '', 'SANTA RITA DE CASSIA', '27200000', '(24)3345411'],
    ['Volta Redonda', 'Grande', 'CRAS JARDIM BELMONTE', 'Avenida', 'Almirante Adalberto Barros Nunes', '4187', '', 'Jardim Belmonte', '27274200', '(24)3339928'],
    ['Volta Redonda', 'Grande', 'CRAS Roma II', 'Rua', '5', '36', '', 'ROMA II', '27180000', '(24)3320665'],
    ['Volta Redonda', 'Grande', 'CRAS Roma I', 'Rua', 'DEZENOVE DE ABRIL', '76', '', 'ROMA I', '27185000', '(24)3320667'],
    ['Volta Redonda', 'Grande', 'CRAS Coqueiros', 'Rua', 'J', '50', '', 'COQUEIROS', '27280470', '(24)3338559'],
    ['Volta Redonda', 'Grande', 'CRAS São Luiz', 'Rua', 'EDGAR BANDEIRA', '787', '', 'SÃO LUIZ', '27286330', '(24)3338208'],
    ['Volta Redonda', 'Grande', 'CRAS Volta Grande', 'Rua', '1054', '159', '', 'VOLTA GRANDE I', '27180000', '(24)3339911'],
    ['Volta Redonda', 'Grande', 'CRAS Ilha Parque', 'Rua', '13 B', '0', '', 'Ilha Parque', '27291291', '(24)3339961'],
    ['Volta Redonda', 'Grande', 'CRAS Jardim Ponte Alta', 'Rua', 'D', '155', '', 'JARDIM PONTE ALTA', '27333220', '(24)3342557'],
    ['Volta Redonda', 'Grande', 'CRAS São Carlos', 'Rua', 'FARIA DE BRITO', '669', '', 'SÃO CARLOS', '27265565', '(24)3337843'],
    ['Volta Redonda', 'Grande', 'CRAS Açude', 'Rua', 'FRANCISCO ANTONIO FRANCISCO', '5', '', 'AÇUDE', '27270280', '(24)3341226'],
    ['Volta Redonda', 'Grande', 'CRAS Verde Vale', 'Rua', 'sete', '0', '', 'VERDE VALE', '27281020', '(24)3339974'],
    ['Volta Redonda', 'Grande', 'CRAS Nova Primavera', 'Rua', 'Ponciano Guimarães', '51', '', 'Nova Primavera', '27230100', '(24)3339245'],
    ['Volta Redonda', 'Grande', 'CRAS Vila Mury', 'Rua', 'AMAZONAS', '275', '', 'VILA MURY', '27281060', '(24)3339910'],
    ['Volta Redonda', 'Grande', 'CRAS Vila Americana', 'Rua', 'ESTADOS UNIDOS', '380', '', 'VILA AMERICANA', '27212160', '(24)3337848'],
    ['Volta Redonda', 'Grande', 'CRAS Santo Agostinho', 'Rua', 'ITAMARACÁ', '79', '', 'SANTO AGOSTINHO', '27291000', '(24)3339207'],
    ['Volta Redonda', 'Grande', 'CRAS Água Limpa', 'Rua', 'SIQUEIRA CAMPOS', '16', '', 'ÁGUA LIMPA', '27550520', '(24)3339448'],
    ['Volta Redonda', 'Grande', 'CRAS Monte Castelo', 'Rua', 'SÃO SEBASTIÃO', '112', '', 'MONTE CASTELO', '27255640', '(24)3342172'],
    ['Volta Redonda', 'Grande', 'CRAS São Sebastião', 'Via', 'B-10', '310', '', 'São Sebastião', '27286470', '(24)3347813'],
    ['Volta Redonda', 'Grande', 'CRAS Dom Bosco', 'Rua', 'DEODORO DA FONSECA', '53', '', 'DOM BOSCO', '27286070', '(24)3338530'],
    ['Volta Redonda', 'Grande', 'CRAS Belo Horizonte', 'Rua', 'NESTÓRIO', '1283', '', 'BELO HORIZONTE', '27180000', '(24)3339195'],
    ['Volta Redonda', 'Grande', 'CRAS Vila Brasília', 'Rua', 'C', '2', '', 'VILA BRASILIA', '27280760', '(24)3339208'],
    ['Volta Redonda', 'Grande', 'CRAS Padre Josimo', 'Rua', '7', '101', '', 'Padre Josimo', '27273750', '(24)3338369'],
    ['Volta Redonda', 'Grande', 'CRAS Retiro', 'Rua', 'GRANDES LOJAS', '107', '', 'RETIRO', '27279680', '(24)3338906'],
    ['Volta Redonda', 'Grande', 'CRAS Caieiras', 'Avenida', 'IMPRENSA', '5', '', 'CAIEIRAS', '27220030', '(24)3337898'],
    ['Volta Redonda', 'Grande', 'CRAS Brasilândia', 'Rua', 'K', '98', '', 'BRASILÂNDIA', '27220375', '(24)3339194'],
    ['Volta Redonda', 'Grande', 'CRAS Vila Três Poços', 'Rua', 'ÉRICA BERBET', '5', '', 'TRES POÇOS', '27240550', '(24)3336200'],
    ['Volta Redonda', 'Grande', 'CRAS Vila Rica', 'Rua', 'VINTE', '275', '', 'VILA RICA', '27259480', '(24)3339425'],
    ['Volta Redonda', 'Grande', 'CRAS Mariana Torres', 'Rua', 'D', '143', '', 'MARIANA TORRES', '27279390', '(24)3339956'],
    ['Volta Redonda', 'Grande', 'CRAS Siderlândia', 'Rua', '10', '20', '', 'SIDERLÂNDIA', '27273290', '(24)3339195'],
    ['Volta Redonda', 'Grande', 'CRAS Santa Cruz', 'Avenida', 'MAJOR ANIBAL', '232', '', 'SANTA CRUZ', '27288020', '(24)3341124'],
  ];

  // TODO cópia de creas_20170810.json
  creases: string[][] = [
    ['Município', 'Porte_pop2010', 'ident1', 'ident2', 'ident3', 'ident4', 'ident5', 'ident6', 'ident8', 'ident12'],
    ['Angra Dos Reis', 'Grande', 'CREAS Angra dos Reis', 'Rua', '11 DE JUNHO', '51', '', 'CENTRO', '23900-170', '(24) 3365-5167'],
    ['Aperibé', 'Pequeno I', 'CREAS', 'Rua', 'FRANCISCO HENRIQUE DE SOUZA', '535', '', 'PALMEIRAS', '28495-000', '(22) 3864-1606'],
    ['Araruama', 'Grande', 'CREAS - Centro de Referência Especializado de Assistência Social', 'Rua', 'Rua República do Chile', '437', '', 'Centro', '28970-000', '(22) 2664-1706'],
    ['Areal', 'Pequeno I', 'CREAS Amaurílio Jairo de Lima', 'Rua', 'Joao Pedro da Silveira', '235', '', 'Centro', '25845-000', '(24) 2257-2963'],
    ['Armação Dos Búzios', 'Pequeno II', 'CREAS - Armação dos Búzios', 'Estrada', 'JOSE BENTO RIBEIRO DANTAS', '4994', '', 'MANGUINHOS', '28950-000', '(22) 2623-1685'],
    ['Arraial do Cabo', 'Pequeno II', 'CREAS - ARRAIAL DO CABO', 'Rua', 'OSWALDO CRUZ', '62', '', 'centro', '28930-000', '(22) 2622-2500'],
    ['Barra do Piraí', 'Médio', 'CREAS Centro de Referencia Especializado de Assistencia Social', 'Rua', 'DONA GUILHERMINA', '45', '', 'CENTRO', '27120-080', '(24) 2444-4546'],
    ['Barra Mansa', 'Grande', 'CREAS BARRA MANSA', 'Rua', 'SANTOS DUMONT', '126', '', 'CENTRO', '27355-080', '(24) 3322-6534'],
    ['Belford Roxo', 'Grande', 'CREAS - ANDRE LUIZ BONFIM DE ALENCAR', 'Estrada', 'DOUTOR PLÍNIO CASADO', '3968', '', 'CENTRO', '26130-621', '(21) 2761-6578'],
    ['Belford Roxo', 'Grande', 'CREAS - IRMÃ FILOMENA', 'Rua', 'SILVA PEIXOTO', '10', 'Lt 10   Qd.J', 'PARQUE AMORIM', '26183-560', '(21) 2761-7233'],
    ['Belford Roxo', 'Grande', 'CREAS LEONARDO TARGINO DO CARMO', 'Avenida', 'JOAQUIM DA COSTA LIMA', '2723', '', 'SANTA AMÉLIA', '26115-315', '(21) 3772-1812'],
    ['Bom Jardim', 'Pequeno II', 'CREAS', 'Avenida', 'LEOPOLDO SILVA', '518', 'ANTIGA RUA NOVA', 'CENTRO', '28660-000', '(22) 2566-1125'],
    ['Bom Jesus do Itabapoana', 'Pequeno II', 'CREAS Assistente Social Josy Ramos Amador', 'Praça', 'Governador Portela - Ed. Ferreira e Borges', '164', 'sala 107/108', 'centro', '28360-000', '(22) 3831-5352'],
    ['Cabo Frio', 'Grande', 'CREAS CENTRO DE REFERÊNCIA ESPECIALIZADO DE ASSISTÊNCIA SOCIAL', 'Rua', 'Alemanha', '132', 'casa 01', 'Jardim Caiçara', '28910-370', '(22) 2645-3106'],
    ['Cachoeiras de Macacu', 'Médio', 'CREAS - Cachoeiras de Macacu', 'Rua', 'ANICIO MONTEIRO DA SILVA', '0', '', 'CENTRO', '28680-000', '(21) 2649-3076'],
    ['Cambuci', 'Pequeno I', 'CREAS', 'Avenida', 'José de Souza Faria', '220', '', 'Floresta', '28430-000', '(22) 2767-3247'],
    ['Campos Dos Goytacazes', 'Grande', 'CREAS I', 'Avenida', 'Carmem Carneiro', '1050', '', 'JARDIM CARIOCA', '28083-510', '(22) 2733-2992'],
    ['Campos Dos Goytacazes', 'Grande', 'CREAS II', 'Rua', 'Rua dos Goytacazes', '618', '', 'TURF CLUB', '28000-100', '(22) 2728-0123'],
    ['Campos Dos Goytacazes', 'Grande', 'CREAS III', 'Rua', 'Av. José Alves de Azevedo', '216', '', 'CENTRO', '28000-100', '(22) 2735-3925'],
    ['Cantagalo', 'Pequeno I', 'CREAS', 'Rua', 'Nair Jacinta', '0', '', 'São José', '28500-000', '(22) 2555-1763'],
    ['Carapebus', 'Pequeno I', 'CREAS', 'Rua', 'RUA PRATA MANCEBO', '30', '', 'Centro', '27998-000', '(22) 2768-3050'],
    ['Cardoso Moreira', 'Pequeno I', 'CREAS', 'Rua', 'Rua Donatila Vilela Marins.', '0', '', 'centro', '28180-000', '(22) 2785-1639'],
    ['Carmo', 'Pequeno I', 'CREAS NELSON LOPES CORRÊA', 'Rua', 'ABREU MAGALHAES', '137', '', 'CENTRO', '28640-000', '(22) 2537-2355'],
    ['Casimiro de Abreu', 'Pequeno II', 'CREAS Casimiro de Abreu', 'Rua', 'Armindo Julio Mozer', '0', 'Fundos', 'Mataruna', '28860-000', '(22) 2778-3933'],
    ['Comendador Levy Gasparian', 'Pequeno I', 'CREAS', 'Rua', 'EUCLIDES DANTAS WERNECK', '6', '', 'centro', '25870-000', '(24) 2254-2867'],
    ['Conceição de Macabu', 'Pequeno II', 'CREAS', 'Rua', 'Rozendo Fontes Tavares', '100', '', 'Bocaina', '28740-000', '(22) 2779-4044'],
    ['Cordeiro', 'Pequeno II', 'CREAS', 'Rua', 'Van Erven', '35', '', 'Centro', '28545-000', '(22) 2551-2600'],
    ['Duas Barras', 'Pequeno I', 'CREAS', 'Rua', 'MONNERAT', '123', '', 'CENTRO', '28650-000', '(22) 2534-1741'],
    ['Duque de Caxias', 'Grande', 'CREAS CENTENÁRIO', 'Rua', 'R. MANUEL VIEIRA', '0', 's/n', 'Vila Meriti', '25070-350', '(21) 2771-2879'],
    ['Duque de Caxias', 'Grande', 'CREAS FIGUEIRA', 'Rodovia', 'WASHINGTON LUIS KM 109', '0', '', 'FIGUEIRA', '25213-005', '(21) 2773-2342'],
    ['Duque de Caxias', 'Grande', 'CREAS Vila Maria Helena', 'Rua', 'Antenor', '100', '', 'Vila Maria Helena', '25251-750', '(21) 2676-1032'],
    ['Engenheiro Paulo de Frontin', 'Pequeno I', 'CREAS', 'Rua', 'CORREA LIMA. 25', '25', '', 'CENTRO', '26650-000', '(24) 2463-1173'],
    ['Guapimirim', 'Médio', 'CREAS Unidade Guapimirim', 'Rua', 'joão seixas júnior', '119', 'casa', 'parque freixal', '25940-000', '(21) 2632-6977'],
    ['Iguaba Grande', 'Pequeno II', 'CREAS OSCAR MAGALHÃES', 'Rua', 'RUA ANTELIN TEIXEIRA DE CARVALHO', '140', '', 'ESTAÇÃO', '28960-000', '(22) 2624-8387'],
    ['Itaboraí', 'Grande', 'CREAS CENTRO DE REFERÊCIA ESPECIALIZADO EM ASSISTÊNCIA SOCIAL', 'Rua', 'JOÃO CAETANO', '94', '', 'CENTRO', '24800-000', '(21) 3639-2080'],
    ['Itaguaí', 'Grande', 'CREAS ITAGUAÍ', 'Rua', 'Maria Soares da Silva', '314', '', 'Parque Independência', '23812-525', '(21) 2687-4217'],
    ['Itaocara', 'Pequeno II', 'CREAS', 'Rua', 'PRAÇA TOLEDO PIZZA', '68', 'CASA', 'CENTRO', '28570-000', '(22) 3861-3925'],
    ['Itaperuna', 'Médio', 'CREAS DE ITAPERUNA', 'Praça', 'GETÚLIO VARGAS', '94', '1º ANDAR', 'CENTRO', '28300-000', '(22) 3824-6301'],
    ['Itatiaia', 'Pequeno II', 'CREAS ITATIAIA', 'Rua', 'AV. DOS EXPEDICIONÁIOS', '539', 'CASA', 'CENTRO', '27580-000', '(24) 3352-3981'],
    ['Japeri', 'Médio', 'CREAS JAPERI', 'Praça', 'MANUEL MARQUES', '10', 'loja 14', 'CENTRO', '26375-630', '(21) 2670-4243'],
    ['Laje do Muriaé', 'Pequeno I', 'CREAS', 'Rua', 'Ferreira César', '195', '', 'Centro', '28350-000', '(22) 3829-1209'],
    ['Macaé', 'Grande', 'CREAS MACAE', 'Rua', 'Rua Alfredo Backer', '640', '', 'centro', '27910-190', '(22) 2796-1102'],
    ['Macaé', 'Grande', 'CREAS II', 'Rua', 'Ari de Carvalho', '0', 'loteamento Bosque Azul 2', 'Bosque Azul', '27971-754', '(22) 2796-1690'],
    ['Magé', 'Grande', 'CREAS - Magé', 'Rua', 'Coronel Theotônio Botelho do Rego', '29', 'Magé', 'CENTRO', '25900-000', '(21) 3630-7220'],
    ['Mangaratiba', 'Pequeno II', 'CREAS Mangaratiba', 'Rua', 'major Jose Caetano', '8182', 'CENTRO', 'MANGARATIBA', '23860-000', '(21) 2789-6014'],
    ['Maricá', 'Grande', 'CREAS', 'Rua', '0 LOTE 10 QUADRA 03', '10', 'PARQUE ELDORADO', 'CENTRO', '24900-000', '(21) 2637-3769'],
    ['Mendes', 'Pequeno I', 'CREAS', 'Rua', 'Dr. Felício dos Santos', '170', '', 'Centro - Fim do Ponto', '26700-000', '(24) 2465-7068'],
    ['Mesquita', 'Grande', 'CREAS', 'Avenida', 'COELHO DA ROCHA Nº 1426', '1426', '', 'ROCHA SOBRINHO', '26572-481', '(21) 3765-2987'],
    ['Miguel Pereira', 'Pequeno II', 'CREAS', 'Rua', 'Luiz Pamplona', '100', '', 'Centro', '26900-000', '(24) 2484-3676'],
    ['Miracema', 'Pequeno II', 'CREAS', 'Praça', 'JOÃO ANTÔNIO HASSEL', '91', '', 'CENTRO', '28460-000', '(22) 3852-1890'],
    ['Natividade', 'Pequeno I', 'CREAS - Lucia Regina Alvarez Pinto Ribeiro', 'Rua', 'Santo Expedito', '204', 'prédio', 'Sindicato', '28380-000', '(22) 3841-1630'],
    ['Nilópolis', 'Grande', 'CREAS NILÓPOLIS - CENTRO DE REFERÊNCIA ESPECIALIZADO DE ASSISTÊNCIA SOCIAL', 'Rua', 'MANUEL RODRIGUES FONTINHA', '13', '', 'NOVA CIDADE', '26535-270', '(21) 3761-5514'],
    ['Niterói', 'Grande', 'CREAS Centro', 'Avenida', 'Ernani do Amaral Peixoto', '901', '', 'CENTRO', '24020-073', '(21) 2717-4201'],
    ['Niterói', 'Grande', 'CREAS Largo da Batalha', 'Rua', 'Reverendo Armando Ferreira', '19', '', 'Largo da Batalha', '24310-400', '(21) 2715-7257'],
    ['Nova Friburgo', 'Grande', 'CREAS -NOVA FRIBURGO Centro de Referência Especializado de Assistência Social', 'Rua', 'PADRE MADUREIRA', '53', '', 'CENTRO', '28610-005', '(22) 2543-6305'],
    ['Nova Iguaçu', 'Grande', 'CREAS - Centro de Referência Especializado da Assistência Social', 'Rua', 'MARIA LAURA S/N', '0', '', 'MOQUETA', '26285-390', '(21) 2698-1461'],
    ['Nova Iguaçu', 'Grande', 'CREAS CAIOABA', 'Rua', 'Doutor SÁ REGO', '503', '', 'Caioaba', '26012-480', '(21) 2668-4517'],
    ['Nova Iguaçu', 'Grande', 'CREAS DOM BOSCO', 'Rua', 'do Gelo', '59', '', 'Dom Bosco', '26295-054', '(21) 3794-8365'],
    ['Nova Iguaçu', 'Grande', 'CREAS MIGUEL COUTO', 'Estrada', 'Luiz de Lemos', '2722', '', 'MIGUEL COUTO', '23113-000', '(21) 2769-1897'],
    ['Paracambi', 'Pequeno II', 'CREAS - PARACAMBI', 'Rua', 'Dr. Soares Filho', '125', '', 'Centro', '26600-000', '(21) 2683-3074'],
    ['Paraíba do Sul', 'Pequeno II', 'CREAS - Alair Pedroso', 'Rua', 'Visconde do Rio Novo', '149', 'Casa', 'Centro', '25850-000', '(24) 2263-5554'],
  ];

  removeDuplicate(dadosBrutos: string[]) {
    let municipiosUnicos = {};
    let dadosPrimeNG: any[] = [];
    dadosBrutos = dadosBrutos.sort();
    for (let v of dadosBrutos) {
      let municipio = v[0];
      if (municipiosUnicos[municipio] !== true) {
        municipiosUnicos[municipio] = true;
        dadosPrimeNG.push({label: municipio, value: municipio});
      }
    }
    return dadosPrimeNG;
  }

  preencheMunicipios() {

    this.municipios = [];
    let municipiosAux = [];

    if (this.tipo1 === true) {
      for (let i = 1; i < this.crases.length; i++) {
        municipiosAux.push(this.crases[i]);
      }
    }

    if (this.tipo2 === true) {
      for (let i = 1; i < this.creases.length; i++) {
        municipiosAux.push(this.creases[i]);
      }
    }

    if (this.tipo3 === true) {
      for (let i = 1; i < this.centrosPOP.length; i++) {
        municipiosAux.push(this.centrosPOP[i]);
      }
    }

    this.municipios = this.removeDuplicate(municipiosAux);

  }

  preencheEquipamentos() {
    this.equipamentos = [];
    let equipamentosAux = [];

    if (this.tipo1 === true) {
      for (let i = 1; i < this.crases.length; i++) {
        for(let j = 0;j < this.selectedMunicipios.length;j++) {
          if(this.selectedMunicipios[j] === this.crases[i][0]) {
            equipamentosAux.push(this.crases[i]);
          }
        }
      }
    }

    if (this.tipo2 === true) {
      for (let i = 1; i < this.creases.length; i++) {
        for(let j = 0;j < this.selectedMunicipios.length;j++) {
          if(this.selectedMunicipios[j] === this.creases[i][0]) {
            equipamentosAux.push(this.creases[i]);
          }
        }
      }
    }

    if (this.tipo3 === true) {
      for (let i = 1; i < this.centrosPOP.length; i++) {
        for(let j = 0;j < this.selectedMunicipios.length;j++) {
          if(this.selectedMunicipios[j] === this.centrosPOP[i][0]) {
            equipamentosAux.push(this.centrosPOP[i]);
          }
        }
      }
    }

    for(let v of equipamentosAux){
      let municipio = v[0];
      let equipamento = v[2];
      this.equipamentos.push({label: municipio + ' - ' + equipamento, value: equipamento});
    }
    this.equipamentos = this.equipamentos.sort();

  }

  pt: any;

  ngOnInit() {
    this.pt = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
      monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      today: 'Hoje',
      clear: 'Limpar'
    };
  }
}
