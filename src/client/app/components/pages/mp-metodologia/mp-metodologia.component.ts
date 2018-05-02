// libs
import { Component, ElementRef, ViewChild , OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Injector } from '@angular/core';
import { Config, RouterExtensions } from '../../../modules/core/index';

@Component({
  moduleId: module.id,
  selector: 'mp-metodologia',
  templateUrl: 'mp-metodologia.component.html',
  styleUrls: ['mp-metodologia.component.css']
})
export class MPMetodologiaComponent{
 

  constructor(private injector: Injector, public routerext: RouterExtensions) {
    
  }
  dimensoes :IMetodologia[] =[
  {
    'titulo':"financiamento",
    'texto': "Avalia a utilização dos recursos do Fundo Municipal de Assistência Social oriundos do Governo Federal, aplicados em programas, projetos, serviços e beneficios da assistência social.",
    'peso' :'10' ,
    'tituloImagem':"financiamento"
  },
  {
    'titulo':"gestão",
    'texto': "Avalia a utilização dos recursos do Fundo Municipal de Assistência Social oriundos do Governo Federal, aplicados em programas, projetos, serviços e benefícios da assistência social.",
    'peso' :'08' ,
    'tituloImagem':"gestao"
  },
  {
    'titulo':"inspeções",
    'texto': "Avalia, através de um questionário semi-estruturado os equipamentos de assistência social do estado do Rio de Janeiro, a partir de inspeções realizadas por equipe técnica do Ministério Público do Rio de Janeiro.",
    'peso' :'10',
    'tituloImagem':"inspecoes" 
  },
  {
    'titulo':"número de equipamentos",
    'texto': "Avalia a partir do censo SUAS 2016, as atividades desenvolvidas pelos orgãos de gestão das Secretarias Municipais de Assistência Social.",
    'peso' :'08',
    'tituloImagem':"numeroEquipamentos" 
  },
  {
    'titulo':"controle social",
    'texto': "Avalia as ações realizadas pelos Conselhos Municipais de Assistencia Social a partir de dados extraídos do Censo SUAS",
    'peso' :'08', 
    'tituloImagem':"controleSocial"
  },
  {
    'titulo':"cobertura bolsa familia",
    'texto': "Avalia o alcance da cobertura de famílias com o perfil para o programa Bolsa Família.",
    'peso' :'05',
    'tituloImagem': "coberturaBolsaFamilia" 
  },
  {
    'titulo':"cobertura do cadastro único",
    'texto': "Avalia o alcance da cobertura de cadastramento de familias com perfil CadÚnico dos municípios.",
    'peso' :'08',
    'tituloImagem':"coberturaCadastroUnico" 
  },
  {
    'titulo':"resolução de benefícios eventuais ",
    'texto': "Avalia a existência de atos normativos que regulamentem os Benefícios Eventuais nos municípios.",
    'peso' :'05',
    'tituloImagem':"beneficioEventuais"  
  }


]  
}

interface IMetodologia{
  titulo: string;
  texto:  string;
  peso:   string;
  tituloImagem: string;
}