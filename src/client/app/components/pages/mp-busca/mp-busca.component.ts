// libs
import { Component } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Input } from '@angular/core';

import { Injector } from '@angular/core';
import { RouterExtensions } from '../../../modules/core/index';

@Component({
  moduleId: module.id,
  selector: 'mp-busca',
  templateUrl: 'mp-busca.component.html',
  styleUrls: ['mp-busca.component.css']
})
export class MPBuscaComponent {

  @Input() selectedRedirection: string   = '';
  @Input()  pesquisa :string = '';
  @Input() categoria: string = '';

  private documentosProcurados: IPesquisa[] = [];
  private resultadosEncontrados: number = 0;


  private documentos: IPesquisa[] = [
    {
      'arquivo': 'Resolucao CNAS 2003 - 067 - 16.04.2003.pdf',
      'palavrasChave': '',
      'categoria': 'legislacao',
      'nome': 'Resolução 067/2003'
    },
    {
      'arquivo': 'Resolucao CNAS 001 de 21 de fevereiro de 2013.pdf',
      'palavrasChave': 'Reordenamento de Serviços',
      'categoria': 'legislacao',
      'nome': 'Resolução 001/2013'
    },
    {
      'arquivo': 'Resolucao CNAS 001 de 25 de janeiro de 2007.pdf',
      'palavrasChave': 'Texto da NOB/RH',
      'categoria': 'legislacao',
      'nome': 'Resolução 001/2007'
    },
    {
      'arquivo': 'Resolucao CNAS 002 de 16 de setembro de 2010 - Resolução Conjunta CNAS e CONANDA.pdf',
      'palavrasChave': 'Serviço de Acolhimento de Criança e Adolescente',
      'categoria': 'legislacao',
      'nome': 'Resolução CNAS e CONANDA 2010 – 002'
    },
    {
      'arquivo': 'Resolucao CNAS 004 de 09 de fevereiro de 2011.pdf',
      'palavrasChave': 'Controle Social',
      'categoria': 'legislacao',
      'nome': 'Resolução 004/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 004 de 13 de marco de 2013.pdf',
      'palavrasChave': 'Capacitação - Educação Permanente',
      'categoria': 'legislacao',
      'nome': 'Resolução 004/2013'
    },
    {
      'arquivo': 'Resolucao CNAS 006 de 142 de marco de 2012.pdf',
      'palavrasChave': 'Expansão de Serviços',
      'categoria': 'legislacao',
      'nome': 'Resolução 006/2012'
    },
    {
      'arquivo': 'Resolucao CNAS 006 de 21 de maio de 2015.pdf',
      'palavrasChave': 'Trabalhadores do SUAS',
      'categoria': 'legislacao',
      'nome': 'Resolução 006/2015'
    },
    {
      'arquivo': 'Resolucao CNAS 007 de 14 de marco de 2012.pdf',
      'palavrasChave': 'Expansão de Serviços',
      'categoria': 'legislacao',
      'nome': 'Resolução 007/2012'
    },
    {
      'arquivo': 'Resolucao CNAS 008 de 16 de marco de 2012.pdf',
      'palavrasChave': 'CapacitaSUAS',
      'categoria': 'legislacao',
      'nome': 'Resolução 008/2012'
    },
    {
      'arquivo': 'Resolucao CNAS 010 de 14 de abril de 2011.pdf',
      'palavrasChave': 'Inscrição de entidades',
      'categoria': 'legislacao',
      'nome': 'Resolução 010/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 010 de 24 de abril de 2012.pdf',
      'palavrasChave': 'Construção de CRAS,CREAS e CENTRO POP',
      'categoria': 'legislacao',
      'nome': 'Resolução 010/2012'
    },
    {
      'arquivo': 'Resolucao CNAS 011 de  23 de setembro de 2015.pdf',
      'palavrasChave': 'Usuários',
      'categoria': 'legislacao',
      'nome': 'Resolução 011/2015'
    },
    {
      'arquivo': 'Resolucao CNAS 011 de 24 de abril de 2012.pdf',
      'palavrasChave': 'Serviço de Proteção Especial para Pessoas com deficiência',
      'categoria': 'legislacao',
      'nome': 'Resolução 011/2012'
    },
    {
      'arquivo': 'Resolucao CNAS 013 de 13 de junho de 2013.pdf',
      'palavrasChave': 'Construção de CRAS e CREAS',
      'categoria': 'legislacao',
      'nome': 'Resolução 013/2013'
    },
    {
      'arquivo': 'Resolucao CNAS 013 de 13 de maio de 2014.pdf',
      'palavrasChave': 'SCFV - Serviço de Convivência e Fortalecimento de Vínculos - Serviços',
      'categoria': 'legislacao',
      'nome': 'Resolução 013/2014'
    },
    {
      'arquivo': 'Resolucao CNAS 013 de 26 de abril de 2011.pdf',
      'palavrasChave': 'Inscrição de entidades',
      'categoria': 'legislacao',
      'nome': 'Resolução 013/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 013 de 27 de abril de 2012.pdf',
      'palavrasChave': 'Pessoa com Deficiência no mundo do Trabalho',
      'categoria': 'legislacao',
      'nome': 'Resolução 013/2012'
    },
    {
      'arquivo': 'Resolucao CNAS 014 de 15 de maio de 2014.pdf',
      'palavrasChave': 'Inscrição de entidades',
      'categoria': 'legislacao',
      'nome': 'Resolução 014/2014'
    },
    {
      'arquivo': 'Resolucao CNAS 015 de 06 de maio de 2010.pdf',
      'palavrasChave': 'Modelo de Certidão para Entidades',
      'categoria': 'legislacao',
      'nome': 'Resolução 015/2010'
    },
    {
      'arquivo': 'Resolucao CNAS 016 de 05 de maio de 2010.pdf',
      'palavrasChave': 'Inscrição de entidades',
      'categoria': 'legislacao',
      'nome': 'Resolução 016/2010'
    },
    {
      'arquivo': 'Resolucao CNAS 016 de 17 de maio de 2012.pdf',
      'palavrasChave': 'Serviço de Proteção Especial para Pessoas com deficiência',
      'categoria': 'legislacao',
      'nome': 'Resolução 016/2012'
    },
    {
      'arquivo': 'Resolucao CNAS 017 de 11 de junho 2010.pdf',
      'palavrasChave': 'Comissão Intergestora Tripartite',
      'categoria': 'legislacao',
      'nome': 'Resolução 017/2010'
    },
    {
      'arquivo': 'Resolucao CNAS 017 de 20 de junho de 2011.pdf',
      'palavrasChave': 'RH - Equipe de Referência',
      'categoria': 'legislacao',
      'nome': 'Resolução 017/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 018 de 15 de julho de 2013.pdf',
      'palavrasChave': 'Gestão',
      'categoria': 'legislacao',
      'nome': 'Resolução 018/2013'
    },
    {
      'arquivo': 'Resolucao CNAS 018 de 20 de junho de 2011.pdf',
      'palavrasChave': '',
      'categoria': 'legislacao',
      'nome': 'Resolução 018/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 018 de 24 de maio de 2012.pdf',
      'palavrasChave': 'ACESSUAS - TRABALHO',
      'categoria': 'legislacao',
      'nome': 'Resolução 018/2012'
    },
    {
      'arquivo': 'Resolucao CNAS 023 de 23 de agosto de 2011.pdf',
      'palavrasChave': 'Certificação de entidades',
      'categoria': 'legislacao',
      'nome': 'Resolução 023/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 027 de 12 de agosto de 2010.pdf',
      'palavrasChave': 'Fundo Nacional para Idoso',
      'categoria': 'legislacao',
      'nome': 'Resolução 027/2010'
    },
    {
      'arquivo': 'Resolucao CNAS 027 de 19 de setembro de 2011.pdf',
      'palavrasChave': 'Assessoramento',
      'categoria': 'legislacao',
      'nome': 'Resolução 027/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 028 de 14 outubro de 2014.pdf',
      'palavrasChave': 'CapacitaSUAS',
      'categoria': 'legislacao',
      'nome': 'Resolução 028/2014'
    },
    {
      'arquivo': 'Resolucao CNAS 029 de 01 de novembro de 2011.pdf',
      'palavrasChave': 'Certificado de entidades',
      'categoria': 'legislacao',
      'nome': 'Resolução 029/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 030 de 01 de novembro de 2011.pdf',
      'palavrasChave': 'Inscrição de entidades',
      'categoria': 'legislacao',
      'nome': 'Resolução 030/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 031 de 31 de outubro de 2013.pdf',
      'palavrasChave': 'Regionalização',
      'categoria': 'legislacao',
      'nome': 'Resolução 031/2013'
    },
    {
      'arquivo': 'Resolucao CNAS 032 08 de outubro de 2010.pdf',
      'palavrasChave': 'Recurso - Financiamento',
      'categoria': 'legislacao',
      'nome': 'Resolução 032/2010'
    },
    {
      'arquivo': 'Resolucao CNAS 032 de 28 de novembro de 2011.pdf',
      'palavrasChave': 'Gasto com RH',
      'categoria': 'legislacao',
      'nome': 'Resolução 032/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 033 de 11 de outubro de 2010.pdf',
      'palavrasChave': 'Inscrição de entidades',
      'categoria': 'legislacao',
      'nome': 'Resolução 033/2010'
    },
    {
      'arquivo': 'Resolucao CNAS 033 de 12 de dezembro de 2012.pdf',
      'palavrasChave': 'NOB/SUAS',
      'categoria': 'legislacao',
      'nome': 'Resolução 033/2012'
    },
    {
      'arquivo': 'Resolucao CNAS 033 de 19 de novembro de2013.pdf',
      'palavrasChave': 'SCFV - deficientes',
      'categoria': 'legislacao',
      'nome': 'Resolução 033/2013'
    },
    {
      'arquivo': 'Resolucao CNAS 033 de 28 de novembro de 2011.pdf',
      'palavrasChave': 'Trabalho',
      'categoria': 'legislacao',
      'nome': 'Resolução 033/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 034 de 19 de novembro de 2013.pdf',
      'palavrasChave': 'CapacitaSUAS',
      'categoria': 'legislacao',
      'nome': 'Resolução 034/2013'
    },
    {
      'arquivo': 'Resolucao CNAS 034 de 28 de novembro de 2011.pdf',
      'palavrasChave': 'Pessoa com Deficiência e o SUAS',
      'categoria': 'legislacao',
      'nome': 'Resolução 034/2011'
    },
    {
      'arquivo': 'Resolucao CNAS 036 de 16 de abril de 2009.pdf',
      'palavrasChave': 'Recomendação de Inscrição no Conselho',
      'categoria': 'legislacao',
      'nome': 'Resolução 036/2009'
    },
    {
      'arquivo': 'Resolucao CNAS 039 de 09 de dezembro de 2010.pdf',
      'palavrasChave': 'Reordernamento dos Benefícios Eventuais',
      'categoria': 'legislacao',
      'nome': 'Resolução 039/2010'
    },
    {
      'arquivo': 'Resolucao CNAS 082 de 16 de setembro de 2009.pdf',
      'palavrasChave': 'Certificados',
      'categoria': 'legislacao',
      'nome': 'Resolução 082/2009'
    },
    {
      'arquivo': 'Resolucao CNAS 085 16 de setembro de 2009.pdf',
      'palavrasChave': 'Certificados',
      'categoria': 'legislacao',
      'nome': 'Resolução 085/2009'
    },
    {
      'arquivo': 'Resolucao CNAS 088 de 10 de dezembro de 2008.pdf',
      'palavrasChave': '',
      'categoria': 'legislacao',
      'nome': 'Resolução 088/2008'
    },
    {
      'arquivo': 'Resolucao CNAS 109 de 11 de novembro de 2009.pdf',
      'palavrasChave': 'Tipificação dos Serviços',
      'categoria': 'legislacao',
      'nome': 'Resolução 109/2009'
    },
    {
      'arquivo': 'Resolucao CNAS 204 de 04 de dezembro de 1997.pdf',
      'palavrasChave': 'NOB',
      'categoria': 'legislacao',
      'nome': 'Resolução 204/1997'
    },
    {
      'arquivo': 'Resolucao CNAS 207 de 16 de dezembro de 1998.pdf',
      'palavrasChave': '',
      'categoria': 'legislacao',
      'nome': 'Resolução 207/1998'
    },
    {
      'arquivo': 'Resolucao CNAS 222 de 19 de outubro de 2000.pdf',
      'palavrasChave': '',
      'categoria': 'legislacao',
      'nome': 'Resolução 222/2000'
    },
    {
      'arquivo': 'Resolucao CNAS 269 de 13 de dezembro de 2006.pdf',
      'palavrasChave': 'NOB/RH',
      'categoria': 'legislacao',
      'nome': 'Resolução 269/2006'
    },
    {
      'arquivo': 'Resolucao-CNAS de 01 de 03 de Março de 2016-deliberacoes-da-x-conferencia.pdf',
      'palavrasChave': 'Deliberação da Conferência',
      'categoria': 'legislacao',
      'nome': 'Resolução 001/2016'
    },
    {
      'arquivo': 'Resolucao CNAS 004 de 11 de fevereiro de 2014.pdf',
      'palavrasChave': 'Rede de Serviços (Programas e Projetos)',
      'categoria': 'legislacao',
      'nome': 'Resolução 004/2014'
    },
    {
      'arquivo': 'Resolucao CNAS 009 de 15 de abril de 2014.pdf',
      'palavrasChave': 'Recursos Humanos',
      'categoria': 'legislacao',
      'nome': 'Resolução 009/2014'
    },
    {
      'arquivo': 'Resolucao CNAS 032 de 11 de dezembro de 2014.pdf',
      'palavrasChave': 'Plano de Acolhimento',
      'categoria': 'legislacao',
      'nome': 'Resolução 032/2014'
    },
    {
      'arquivo': 'Resolucao CNAS - CONANDA 001 de 15 de dezembro de 2016.pdf',
      'palavrasChave': 'Criança e adolescente em situação de rua',
      'categoria': 'legislacao',
      'nome': 'Resolução Conjunta 001/2016'
    },
    {
      'arquivo': 'Resolucao CNAS 002 de 16 de março de 2017.pdf',
      'palavrasChave': 'Pacto de Aprimoramento do Sistema Único de Assistência Social',
      'categoria': 'legislacao',
      'nome': 'Resolução 002/2017'
    },
    {
      'arquivo': 'Resolucao CNAS 003 de 19 de abril de 2017.pdf',
      'palavrasChave': 'Promoção do Acesso ao Mundo do Trabalho - Programa ACESSUAS , Programa ACESSUAS',
      'categoria': 'legislacao',
      'nome': 'Resolução 003/2017'
    },
    {
      'arquivo': 'Resolucao CNAS 006 de 13 de abril de 2016.pdf',
      'palavrasChave': 'SUAS – PNEP/SUAS',
      'categoria': 'legislacao',
      'nome': 'Resolução 006/2016'
    },
    {
      'arquivo': 'Resolucao CNAS 008 de 04 de agosto de 2015.pdf',
      'palavrasChave': 'Controle Social',
      'categoria': 'legislacao',
      'nome': 'Resolução 008/2015'
    },
    {
      'arquivo': 'Resolucao CNAS 010 de 14 de julho de 2016.pdf',
      'palavrasChave': 'resolução CNAS, microcefalia, BPC, benefício de prestação continuada',
      'categoria': 'legislacao',
      'nome': 'Resolução 010/2016'
    },
    {
      'arquivo': 'Resolucao CNAS 012 de 10 de marco de 2010.pdf',
      'palavrasChave': 'Certificados- Renovação e pedidos prematuros',
      'categoria': 'legislacao',
      'nome': 'Resolução 012/2010'
    },
    {
      'arquivo': 'Resolucao CNAS 015 de 17 de maio de 2012.pdf',
      'palavrasChave': 'Reordenamento de Serviços',
      'categoria': 'legislacao',
      'nome': 'Resolução 015/2012'
    },
    {
      'arquivo': 'Resolucao CNAS 015 de 23 de agosto de 2016.pdf',
      'palavrasChave': 'serviços, programas, projetos e benefícios da Política de Assistência Social',
      'categoria': 'legislacao',
      'nome': 'Resolução 015/2016'
    },
    {
      'arquivo': 'Resolucao CNAS 017 de 26 de fevereiro de 2002.pdf',
      'palavrasChave': 'Certidões',
      'categoria': 'legislacao',
      'nome': 'Resolução 017/2002'
    },
    {
      'arquivo': 'Resolucao CNAS 019 de 24 de novembro de 2016 - Institui o Programa Primeira Infância no SUAS.pdf',
      'palavrasChave': 'Programa Primeira Infância',
      'categoria': 'legislacao',
      'nome': 'Resolução 019/2016'
    },
    {
      'arquivo': 'Resolucao CNAS 020 de 24 de novembro de 2016.pdf',
      'palavrasChave': 'Programa Primeira Infância',
      'categoria': 'legislacao',
      'nome': 'Resolução 020/2016'
    },
    {
      'arquivo': 'Resolucao CNAS 023 de 16 de fevereiro de 2006.pdf',
      'palavrasChave': 'Trabalhadores do SUAS',
      'categoria': 'legislacao',
      'nome': 'Resolução 023/2006'
    },
    {
      'arquivo': 'Resolucao CNAS 025 de 15 de dezembro de 2016 - Altera a Resolução nº 18 de 24 de maio de 2012.pdf',
      'palavrasChave': 'ACESSUAS-TRABALHO',
      'categoria': 'legislacao',
      'nome': 'Resolução 025/2016'
    },
    {
      'arquivo': 'Resolucao CNAS 028 de 18 de fevereiro de 2004.pdf',
      'palavrasChave': '',
      'categoria': 'legislacao',
      'nome': 'Resolução 028/2004'
    },
    {
      'arquivo': 'Resolucao CNAS 032 de 31 de outubro 2013.pdf',
      'palavrasChave': 'Pacto de Aprimoramento e Gestão',
      'categoria': 'legislacao',
      'nome': 'Resolução 032/2013'
    },
    {
      'arquivo': 'Resolucao CNAS 033 de 24 de fevereiro de 1999.pdf',
      'palavrasChave': 'Certificado',
      'categoria': 'legislacao',
      'nome': 'Resolução 033/1999'
    },
    {
      'arquivo': 'Resolucao CNAS 034 DE 10 DE JUNHO DE 1994.pdf',
      'palavrasChave': '',
      'categoria': 'legislacao',
      'nome': 'Resolução 034/1994'
    },
    {
      'arquivo': 'Resolucao CNAS 038 de 22 de maio de 1995.pdf',
      'palavrasChave': '',
      'categoria': 'legislacao',
      'nome': 'Resolução 038/1995'
    },
    {
      'arquivo': 'Resolucao CNAS 053 de 04 de março de 1999.pdf',
      'palavrasChave': '',
      'categoria': 'legislacao',
      'nome': 'Resolução 053/1999'
    },
    {
      'arquivo': 'Resolucao CNAS 066 de 11 de setembro de 2008.pdf',
      'palavrasChave': 'Certidões',
      'categoria': 'legislacao',
      'nome': 'Resolução 066/2008'
    },
    {
      'arquivo': 'Resolucao CNAS 081 de 14 de novembro de 2008.pdf',
      'palavrasChave': 'Co-financiamento',
      'categoria': 'legislacao',
      'nome': 'Resolução 081/2008'
    },
    {
      'arquivo': 'Resolucao CNAS 112 de 24 de junho de 2005.pdf',
      'palavrasChave': 'Entidade',
      'categoria': 'legislacao',
      'nome': 'Resolução 112/2005'
    },
    {
      'arquivo': 'Resolucao CNAS 116 de 19 de maio de 1999.pdf',
      'palavrasChave': 'Gratuidade de Entidade Beneficente',
      'categoria': 'legislacao',
      'nome': 'Resolução 116/1999'
    },
    {
      'arquivo': 'Resolucao CNAS 130 de 15 de julho de 2005.pdf',
      'palavrasChave': 'NOB/SUAS 2005',
      'categoria': 'legislacao',
      'nome': 'Resolução 130/2005'
    },
    {
      'arquivo': 'Resolucao CNAS 144 de 15 de  outubro de 2004.pdf',
      'palavrasChave': 'Manual de Prossedimento- Registro e Certificado',
      'categoria': 'legislacao',
      'nome': 'Resolução 144/2004'
    },
    {
      'arquivo': 'Resolucao CNAS 155 de 16 de outubro de 2002.pdf',
      'palavrasChave': 'Certidões',
      'categoria': 'legislacao',
      'nome': 'Resolução 155/2002'
    },
    {
      'arquivo': 'Resolucao CNAS 165 de 19 de novembro de 2004.pdf',
      'palavrasChave': 'Certidões',
      'categoria': 'legislacao',
      'nome': 'Resolução 165/2004'
    },
    {
      'arquivo': 'Resolucao CNAS 177 de 20 de novembro de 2002.pdf',
      'palavrasChave': 'Certidões',
      'categoria': 'legislacao',
      'nome': 'Resolução 177/2002'
    },
    {
      'arquivo': 'Resolucao CNAS 182 de  20 de julho de 1999.pdf',
      'palavrasChave': 'Municipalização da Assistência Social',
      'categoria': 'legislacao',
      'nome': 'Resolução 182/1999'
    },
    {
      'arquivo': 'Resolucao CNAS 188 de 20 de outubro de 2005.pdf',
      'palavrasChave': 'Convênio',
      'categoria': 'legislacao',
      'nome': 'Resolução 188/2005'
    },
    {
      'arquivo': 'Resolucao CNAS 278 de 20 de outubro de 1999.pdf',
      'palavrasChave': 'Fundo  Nacional',
      'categoria': 'legislacao',
      'nome': 'Resolução 278/1999'
    },
    {
      'arquivo': 'Resolucao Conjunta CNAS e CONANDA 001 de 07 de junho de 2017.pdf',
      'palavrasChave': 'Crianças e adolescentes em situação de rua',
      'categoria': 'legislacao',
      'nome': 'Resolução Conjunta 001/2017'
    },
    {
      'arquivo': 'cartilha_suas.pdf',
      'palavrasChave': '',
      'categoria': 'cartilha',
      'nome': 'O Ministério Público na Fiscalização do SUAS'
    },
    {
      'arquivo': 'cartilha_tutela_populacao_situacao_rua.pdf',
      'palavrasChave': '',
      'categoria': 'cartilha',
      'nome': 'A Tutela da População em situação de Rua'
    },
    {
      'arquivo': 'Centro POP - Belford Roxo.pdf',
      'palavrasChave': '2015',
      'categoria': 'inspecoes',
      'nome': 'Centro POP - Belford Roxo'
    },
    {
      'arquivo': 'Centro POP - CAPR- Centro de atenção a população de rua.pdf',
      'palavrasChave': 'Angra dos Reis, 2016',
      'categoria': 'inspecoes',
      'nome': 'Centro POP - CAPR- Centro de atenção a população de rua'
    },
    {
      'arquivo': 'Centro POP - Centro de Referência Especializada para pessoas em situação de rua.pdf',
      'palavrasChave': 'Niterói, 2016',
      'categoria': 'inspecoes',
      'nome': 'Centro POP - Centro de Referência Especializada para pessoas em situação de rua'
    },
    {
      'arquivo': 'Centro POP - Centro POP Campos dos Goytacazes.pdf',
      'palavrasChave': '2017',
      'categoria': 'inspecoes',
      'nome': 'Centro POP - Campos dos Goytacazes'
    },
    {
      'arquivo': 'Centro POP - Centro POP Itaboraí.pdf',
      'palavrasChave': '2017',
      'categoria': 'inspecoes',
      'nome': 'Centro POP - Itaboraí'
    },
    {
      'arquivo': 'Centro POP - José Saramago.pdf',
      'palavrasChave': 'Rio de Janeiro, 2016',
      'categoria': 'inspecoes',
      'nome': 'Centro POP - José Saramago'
    },
    {
      'arquivo': 'Centro POP - Marcelino da Conceição Garcia.pdf',
      'palavrasChave': 'Petrópolis, 2016',
      'categoria': 'inspecoes',
      'nome': 'Centro POP - Marcelino da Conceição Garcia'
    },
    {
      'arquivo': 'CRAS - Afonso Arinos.pdf',
      'palavrasChave': 'Comendador Levy Gasparian, 2017',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Afonso Arinos'
    },
    {
      'arquivo': 'CRAS - CRAS Bananeiras.pdf',
      'palavrasChave': 'Araruama, 2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Bananeiras'
    },
    {
      'arquivo': 'CRAS - Cras Bracuí.pdf',
      'palavrasChave': 'Angra dos Reis, 2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Bracuí'
    },
    {
      'arquivo': 'CRAS - CRAS Centro - Barra do Piraí.pdf',
      'palavrasChave': '2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Centro - Barra do Piraí'
    },
    {
      'arquivo': 'CRAS - CRAS Centro - Niterói.pdf',
      'palavrasChave': '2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Centro - Niterói'
    },
    {
      'arquivo': 'CRAS - CRAS CENTRO (Nova Iguaçu).pdf',
      'palavrasChave': '2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - CENTRO (Nova Iguaçu)'
    },
    {
      'arquivo': 'CRAS - Cras Centro (Paraíba do Sul).pdf',
      'palavrasChave': '2017',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Centro (Paraíba do Sul)'
    },
    {
      'arquivo': 'CRAS - CRAS Centro (Petrópolis).pdf',
      'palavrasChave': '2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Centro (Petrópolis)'
    },
    {
      'arquivo': 'CRAS - CRAS do Mutirão.pdf',
      'palavrasChave': 'Araruama, 2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - CRAS do Mutirão'
    },
    {
      'arquivo': 'CRAS - CRAS do Outeiro.pdf',
      'palavrasChave': 'Araruama, 2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - CRAS do Outeiro'
    },
    {
      'arquivo': 'CRAS - CRAS Fazendinha.pdf',
      'palavrasChave': 'Araruama, 2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Fazendinha'
    },
    {
      'arquivo': 'CRAS - Cras Itambi.pdf',
      'palavrasChave': 'Itaboraí, 2017',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Itambi'
    },
    {
      'arquivo': 'CRAS - CRAS Jardim Carioca.pdf',
      'palavrasChave': 'Campos dos Goytacazes, 2017',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Jardim Carioca'
    },
    {
      'arquivo': 'CRAS - CRAS Jardim do Ipê.pdf',
      'palavrasChave': 'Belford Roxo, 2015',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Jardim do Ipê'
    },
    {
      'arquivo': 'CRAS - CRAS José Gonçalves.pdf',
      'palavrasChave': 'Armação dos Búzios, 2017',
      'categoria': 'inspecoes',
      'nome': 'CRAS - José Gonçalves'
    },
    {
      'arquivo': 'CRAS - CRAS São Vicente.pdf',
      'palavrasChave': 'Araruama, 2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - São Vicente'
    },
    {
      'arquivo': 'CRAS - Fonseca Almeida.pdf',
      'palavrasChave': 'Comendador Levy Gasparian, 2017',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Fonseca Almeida'
    },
    {
      'arquivo': 'CRAS - Luiza Mahim.pdf',
      'palavrasChave': 'Rio de Janeiro, 2017',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Luiza Mahim'
    },
    {
      'arquivo': 'CRAS - Maria Thereza Freire Moura.pdf',
      'palavrasChave': 'Rio de Janeiro, 2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Maria Thereza Freire Moura'
    },
    {
      'arquivo': 'CRAS - Maria Vieira Bazani.pdf',
      'palavrasChave': 'Rio de Janeiro, 2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Maria Vieira Bazani'
    },
    {
      'arquivo': 'CRAS - Rubens Corrêa.pdf',
      'palavrasChave': 'Rio de Janeiro, 2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Rubens Corrêa'
    },
    {
      'arquivo': 'CRAS - Sebastião Teodoro Filho.pdf',
      'palavrasChave': 'Rio de Janeiro, 2016',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Sebastião Teodoro Filho'
    },
    {
      'arquivo': 'CRAS - Vila Salutaris.pdf',
      'palavrasChave': 'Paraíba do Sul, 2017',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Vila Salutaris'
    },
    {
      'arquivo': 'CRAS - Visconde de Itaboraí.pdf',
      'palavrasChave': '2017',
      'categoria': 'inspecoes',
      'nome': 'CRAS - Visconde de Itaboraí'
    },
    {
      'arquivo': 'CREAS - Arlindo Rodrigues.pdf',
      'palavrasChave': 'Rio de Janeiro, 2016',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Arlindo Rodrigues'
    },
    {
      'arquivo': 'CREAS - CREAS - Angra dos Reis.pdf',
      'palavrasChave': '2016',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Angra dos Reis'
    },
    {
      'arquivo': 'CREAS - CREAS Alair Pedroso.pdf',
      'palavrasChave': 'Paraíba do Sul, 2017',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Alair Pedroso'
    },
    {
      'arquivo': 'CREAS - Creas Barra do Piraí.pdf',
      'palavrasChave': '2016',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Barra do Piraí'
    },
    {
      'arquivo': 'CREAS - CREAS Centro - Niterói.pdf',
      'palavrasChave': '2016',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Centro - Niterói'
    },
    {
      'arquivo': 'CREAS - CREAS Comendador Levy Gasparian.pdf',
      'palavrasChave': '2015',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Comendador Levy Gasparian'
    },
    {
      'arquivo': 'CREAS - Creas Daniela Perez.pdf',
      'palavrasChave': 'Rio de Janeiro, 2016',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Daniela Perez'
    },
    {
      'arquivo': 'CREAS - Creas III.pdf',
      'palavrasChave': 'Campos dos Goytacazes, 2017',
      'categoria': 'inspecoes',
      'nome': 'CREAS - III'
    },
    {
      'arquivo': 'CREAS - CREAS Itaboraí.pdf',
      'palavrasChave': '2017',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Itaboraí'
    },
    {
      'arquivo': 'CREAS - CREAS Professora Bernadete Rabelo.pdf',
      'palavrasChave': 'Araruama, 2016',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Professora Bernadete Rabelo'
    },
    {
      'arquivo': 'CREAS - Dom Pedro I.pdf',
      'palavrasChave': 'Petrópolis, 2016',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Dom Pedro I'
    },
    {
      'arquivo': 'CREAS - Irmã Filomena.pdf',
      'palavrasChave': 'Belford Roxo, 2015',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Irmã Filomena'
    },
    {
      'arquivo': 'CREAS - Largo da Batalha.pdf',
      'palavrasChave': 'Niterói, 2016',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Largo da Batalha'
    },
    {
      'arquivo': 'CREAS - Rocha Sobrinho.pdf',
      'palavrasChave': 'Mesquita, 2017',
      'categoria': 'inspecoes',
      'nome': 'CREAS - Rocha Sobrinho'
    },
    {
      'arquivo': 'Orçamento 2016 - Angra dos Reis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Angra dos Reis'
    },
    {
      'arquivo': 'Orçamento 2016 - Aperibé.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Aperibé'
    },
    {
      'arquivo': 'Orçamento 2016 - Araruama.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal - Araruama'
    },
    {
      'arquivo': 'Orçamento 2016 - Areal.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal - Areal'
    },
    {
      'arquivo': 'Orçamento 2016 - Armação dos Búzios.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Armação dos Búzios'
    },
    {
      'arquivo': 'Orçamento 2016 - Arraial do Cabo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Arraial do Cabo'
    },
    {
      'arquivo': 'Orçamento 2016 - Barra do Piraí.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Barra do Piraí'
    },
    {
      'arquivo': 'Orçamento 2016 - Barra Mansa.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Barra Mansa'
    },
    {
      'arquivo': 'Orçamento 2016 - Belford Roxo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Belford Roxo'
    },
    {
      'arquivo': 'Orçamento 2016 - Bom Jardim.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Bom Jardim'
    },
    {
      'arquivo': 'Orçamento 2016 - Bom Jesus do Itabapoana.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Bom Jesus do Itabapoana'
    },
    {
      'arquivo': 'Orçamento 2016 - Cabo Frio.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Cabo Frio'
    },
    {
      'arquivo': 'Orçamento 2016 - Cachoeiras de Macacu.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Cachoeiras de Macacu'
    },
    {
      'arquivo': 'Orçamento 2016 - Cambuci.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Cambuci'
    },
    {
      'arquivo': 'Orçamento 2016 - Campos dos Goytacazes.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Campos dos Goytacazes'
    },
    {
      'arquivo': 'Orçamento 2016 - Cantagalo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Cantagalo'
    },
    {
      'arquivo': 'Orçamento 2016 - Carapebus.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Carapebus'
    },
    {
      'arquivo': 'Orçamento 2016 - Cardoso Moreira.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Cardoso Moreira'
    },
    {
      'arquivo': 'Orçamento 2016 - Carmo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Carmo'
    },
    {
      'arquivo': 'Orçamento 2016 - Casimiro de Abreu.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Casimiro de Abreu'
    },
    {
      'arquivo': 'Orçamento 2016 - Comendador Levy Gasparian.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Comendador Levy Gasparian'
    },
    {
      'arquivo': 'Orçamento 2016 - Conceição de Macabu.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Conceição de Macabu'
    },
    {
      'arquivo': 'Orçamento 2016 - Cordeiro.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Cordeiro'
    },
    {
      'arquivo': 'Orçamento 2016 - Duas Barras.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Duas Barras'
    },
    {
      'arquivo': 'Orçamento 2016 - Duque de Caxias.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Duque de Caxias'
    },
    {
      'arquivo': 'Orçamento 2016 - Engenheiro Paulo de Frontin.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Engenheiro Paulo de Frontin'
    },
    {
      'arquivo': 'Orçamento 2016 - Estado do Rio de Janeiro.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Estado do Rio de Janeiro'
    },
    {
      'arquivo': 'Orçamento 2016 - Guapimirim.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Guapimirim'
    },
    {
      'arquivo': 'Orçamento 2016 - Iguaba Grande.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Iguaba Grande'
    },
    {
      'arquivo': 'Orçamento 2016 - Itaboraí.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Itaboraí'
    },
    {
      'arquivo': 'Orçamento 2016 - Itaguaí.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Itaguaí'
    },
    {
      'arquivo': 'Orçamento 2016 - Italva.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Italva'
    },
    {
      'arquivo': 'Orçamento 2016 - Itaocara.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Itaocara'
    },
    {
      'arquivo': 'Orçamento 2016 - Itaperuna.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Itaperuna'
    },
    {
      'arquivo': 'Orçamento 2016 - Itatiaia.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Itatiaia'
    },
    {
      'arquivo': 'Orçamento 2016 - Japeri.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Japeri'
    },
    {
      'arquivo': 'Orçamento 2016 - Laje do Muriaé.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Laje do Muriaé'
    },
    {
      'arquivo': 'Orçamento 2016 - Macaé.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Macaé'
    },
    {
      'arquivo': 'Orçamento 2016 - Macuco.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Macuco'
    },
    {
      'arquivo': 'Orçamento 2016 - Magé.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Magé'
    },
    {
      'arquivo': 'Orçamento 2016 - Mangaratiba.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Mangaratiba'
    },
    {
      'arquivo': 'Orçamento 2016 - Maricá.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Maricá'
    },
    {
      'arquivo': 'Orçamento 2016 - Mendes.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Mendes'
    },
    {
      'arquivo': 'Orçamento 2016 - Mesquita.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Mesquita'
    },
    {
      'arquivo': 'Orçamento 2016 - Miguel Pereira.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Miguel Pereira'
    },
    {
      'arquivo': 'Orçamento 2016 - Miracema.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Miracema'
    },
    {
      'arquivo': 'Orçamento 2016 - Natividade.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Natividade'
    },
    {
      'arquivo': 'Orçamento 2016 - Nilópolis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Nilópolis'
    },
    {
      'arquivo': 'Orçamento 2016 - Niterói.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Niterói'
    },
    {
      'arquivo': 'Orçamento 2016 - Nova Friburgo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Nova Friburgo'
    },
    {
      'arquivo': 'Orçamento 2016 - Nova Iguaçu.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Nova Iguaçu'
    },
    {
      'arquivo': 'Orçamento 2016 - Paracambi.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Paracambi'
    },
    {
      'arquivo': 'Orçamento 2016 - Paraíba do Sul.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Paraíba do Sul'
    },
    {
      'arquivo': 'Orçamento 2016 - Parati.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Paraty'
    },
    {
      'arquivo': 'Orçamento 2016 - Paty dos Alferes.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Paty dos Alferes'
    },
    {
      'arquivo': 'Orçamento 2016 - Petrópolis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Petrópolis'
    },
    {
      'arquivo': 'Orçamento 2016 - Pinheiral.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Pinheiral'
    },
    {
      'arquivo': 'Orçamento 2016 - Piraí.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Piraí'
    },
    {
      'arquivo': 'Orçamento 2016 - Porciúncula.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Porciúncula'
    },
    {
      'arquivo': 'Orçamento 2016 - Porto Real.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Porto Real'
    },
    {
      'arquivo': 'Orçamento 2016 - Quatis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Quatis'
    },
    {
      'arquivo': 'Orçamento 2016 - Queimados.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Queimados'
    },
    {
      'arquivo': 'Orçamento 2016 - Quissamã.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Quissamã'
    },
    {
      'arquivo': 'Orçamento 2016 - Resende.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Resende'
    },
    {
      'arquivo': 'Orçamento 2016 - Rio Bonito.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Rio Bonito'
    },
    {
      'arquivo': 'Orçamento 2016 - Rio Claro.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Rio Claro'
    },
    {
      'arquivo': 'Orçamento 2016 - Rio das Flores.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Rio das Flores'
    },
    {
      'arquivo': 'Orçamento 2016 - Rio das Ostras.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Rio das Ostras'
    },
    {
      'arquivo': 'Orçamento 2016 - Rio de Janeiro.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Rio de Janeiro'
    },
    {
      'arquivo': 'Orçamento 2016 - Santa Maria Madalena.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Santa Maria Madalena'
    },
    {
      'arquivo': 'Orçamento 2016 - Santo Antônio de Pádua.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Santo Antônio de Pádua'
    },
    {
      'arquivo': 'Orçamento 2016 - São Fidélis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - São Fidélis'
    },
    {
      'arquivo': 'Orçamento 2016 - São Francisco de Itabapoana.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - São Francisco de Itabapoana'
    },
    {
      'arquivo': 'Orçamento 2016 - São Gonçalo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - São Gonçalo'
    },
    {
      'arquivo': 'Orçamento 2016 - São João da Barra.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - São João da Barra'
    },
    {
      'arquivo': 'Orçamento 2016 - São João de Meriti.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - São João de Meriti'
    },
    {
      'arquivo': 'Orçamento 2016 - São José de Ubá.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - São José de Ubá'
    },
    {
      'arquivo': 'Orçamento 2016 - São José do Vale do Rio Preto.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - São José do Vale do Rio Preto'
    },
    {
      'arquivo': 'Orçamento 2016 - São Pedro da Aldeia.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - São Pedro da Aldeia'
    },
    {
      'arquivo': 'Orçamento 2016 - São Sebastião do Alto.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - São Sebastião do Alto'
    },
    {
      'arquivo': 'Orçamento 2016 - Sapucaia.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Sapucaia'
    },
    {
      'arquivo': 'Orçamento 2016 - Saquarema.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Saquarema'
    },
    {
      'arquivo': 'Orçamento 2016 - Seropédica.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Seropédica'
    },
    {
      'arquivo': 'Orçamento 2016 - Silva Jardim.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Silva Jardim'
    },
    {
      'arquivo': 'Orçamento 2016 - Sumidouro.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Sumidouro'
    },
    {
      'arquivo': 'Orçamento 2016 - Tanguá.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Tanguá'
    },
    {
      'arquivo': 'Orçamento 2016 - Teresópolis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Teresópolis'
    },
    {
      'arquivo': 'Orçamento 2016 - Trajano de Morais.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Trajano de Moraes'
    },
    {
      'arquivo': 'Orçamento 2016 - Três Rios.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Três Rios'
    },
    {
      'arquivo': 'Orçamento 2016 - Valença.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Valença'
    },
    {
      'arquivo': 'Orçamento 2016 - Varre-sai.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Varre-sai'
    },
    {
      'arquivo': 'Orçamento 2016 - Vassouras.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Vassouras'
    },
    {
      'arquivo': 'Orçamento 2016 - Volta Redonda.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2016 - Volta Redonda'
    },
    {
      'arquivo': 'Orçamento 2017 - Angra dos Reis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Angra dos Reis'
    },
    {
      'arquivo': 'Orçamento 2017 - Aperibé.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Aperibé'
    },
    {
      'arquivo': 'Orçamento 2017 - Araruama.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Araruama'
    },
    {
      'arquivo': 'Orçamento 2017 - Areal.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Areal'
    },
    {
      'arquivo': 'Orçamento 2017 - Armação dos Búzios.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Armação dos Búzios'
    },
    {
      'arquivo': 'Orçamento 2017 - Arraial do Cabo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Arraial do Cabo'
    },
    {
      'arquivo': 'Orçamento 2017 - Barra do Piraí.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Barra do Piraí'
    },
    {
      'arquivo': 'Orçamento 2017 - Barra Mansa.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Barra Mansa'
    },
    {
      'arquivo': 'Orçamento 2017 - Belford Roxo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Belford Roxo'
    },
    {
      'arquivo': 'Orçamento 2017 - Bom Jardim.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Bom Jardim'
    },
    {
      'arquivo': 'Orçamento 2017 - Bom Jesus do Itabapoana.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Bom Jesus do Itabapoana'
    },
    {
      'arquivo': 'Orçamento 2017 - Cabo Frio.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Cabo Frio'
    },
    {
      'arquivo': 'Orçamento 2017 - Cachoeiras de Macacu.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Cachoeiras de Macacu'
    },
    {
      'arquivo': 'Orçamento 2017 - Cambuci.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Cambuci'
    },
    {
      'arquivo': 'Orçamento 2017 - Campos dos Goytacazes.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Campos dos Goytacazes'
    },
    {
      'arquivo': 'Orçamento 2017 - Cantagalo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Cantagalo'
    },
    {
      'arquivo': 'Orçamento 2017 - Carapebus.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Carapebus'
    },
    {
      'arquivo': 'Orçamento 2017 - Cardoso Moreira.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Cardoso Moreira'
    },
    {
      'arquivo': 'Orçamento 2017 - Carmo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Carmo'
    },
    {
      'arquivo': 'Orçamento 2017 - Casimiro de Abreu.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Casimiro de Abreu'
    },
    {
      'arquivo': 'Orçamento 2017 - Comendador Levy Gasparian.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Comendador Levy Gasparian'
    },
    {
      'arquivo': 'Orçamento 2017 - Conceição de Macabu.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Conceição de Macabu'
    },
    {
      'arquivo': 'Orçamento 2017 - Cordeiro.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Cordeiro'
    },
    {
      'arquivo': 'Orçamento 2017 - Duas Barras.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Duas Barras'
    },
    {
      'arquivo': 'Orçamento 2017 - Duque de Caxias.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Duque de Caxias'
    },
    {
      'arquivo': 'Orçamento 2017 - Engenheiro Paulo de Frontin.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Engenheiro Paulo de Frontin'
    },
    {
      'arquivo': 'Orçamento 2017 - Estado do Rio de Janeiro.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Estado do Rio de Janeiro'
    },
    {
      'arquivo': 'Orçamento 2017 - Guapimirim.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Guapimirim'
    },
    {
      'arquivo': 'Orçamento 2017 - Iguaba Grande.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Iguaba Grande'
    },
    {
      'arquivo': 'Orçamento 2017 - Itaboraí.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Itaboraí'
    },
    {
      'arquivo': 'Orçamento 2017 - Itaguaí.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Itaguaí'
    },
    {
      'arquivo': 'Orçamento 2017 - Italva.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Italva'
    },
    {
      'arquivo': 'Orçamento 2017 - Itaocara.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Itaocara'
    },
    {
      'arquivo': 'Orçamento 2017 - Itaperuna.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Itaperuna'
    },
    {
      'arquivo': 'Orçamento 2017 - Itatiaia.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Itatiaia'
    },
    {
      'arquivo': 'Orçamento 2017 - Japeri.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Japeri'
    },
    {
      'arquivo': 'Orçamento 2017 - Laje do Muriaé.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Laje do Muriaé'
    },
    {
      'arquivo': 'Orçamento 2017 - Macaé.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Macaé'
    },
    {
      'arquivo': 'Orçamento 2017 - Macuco.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Macuco'
    },
    {
      'arquivo': 'Orçamento 2017 - Magé.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Magé'
    },
    {
      'arquivo': 'Orçamento 2017 - Mangaratiba.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Mangaratiba'
    },
    {
      'arquivo': 'Orçamento 2017 - Maricá.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Maricá'
    },
    {
      'arquivo': 'Orçamento 2017 - Mendes.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Mendes'
    },
    {
      'arquivo': 'Orçamento 2017 - Mesquita.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Mesquita'
    },
    {
      'arquivo': 'Orçamento 2017 - Miguel Pereira.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Miguel Pereira'
    },
    {
      'arquivo': 'Orçamento 2017 - Miracema.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Miracema'
    },
    {
      'arquivo': 'Orçamento 2017 - Natividade.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Natividade'
    },
    {
      'arquivo': 'Orçamento 2017 - Nilópolis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Nilópolis'
    },
    {
      'arquivo': 'Orçamento 2017 - Niterói.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Niterói'
    },
    {
      'arquivo': 'Orçamento 2017 - Nova Friburgo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Nova Friburgo'
    },
    {
      'arquivo': 'Orçamento 2017 - Nova Iguaçu.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Nova Iguaçu'
    },
    {
      'arquivo': 'Orçamento 2017 - Paracambi.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Paracambi'
    },
    {
      'arquivo': 'Orçamento 2017 - Paraíba do Sul.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Paraíba do Sul'
    },
    {
      'arquivo': 'Orçamento 2017 - Parati.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Paraty'
    },
    {
      'arquivo': 'Orçamento 2017 - Paty dos Alferes.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Paty dos Alferes'
    },
    {
      'arquivo': 'Orçamento 2017 - Petrópolis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Petrópolis'
    },
    {
      'arquivo': 'Orçamento 2017 - Pinheiral.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Pinheiral'
    },
    {
      'arquivo': 'Orçamento 2017 - Piraí.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Piraí'
    },
    {
      'arquivo': 'Orçamento 2017 - Porciúncula.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Porciúncula'
    },
    {
      'arquivo': 'Orçamento 2017 - Porto Real.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Porto Real'
    },
    {
      'arquivo': 'Orçamento 2017 - Quatis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Quatis'
    },
    {
      'arquivo': 'Orçamento 2017 - Queimados.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Queimados'
    },
    {
      'arquivo': 'Orçamento 2017 - Quissamã.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Quissamã'
    },
    {
      'arquivo': 'Orçamento 2017 - Resende.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Resende'
    },
    {
      'arquivo': 'Orçamento 2017 - Rio Bonito.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Rio Bonito'
    },
    {
      'arquivo': 'Orçamento 2017 - Rio Claro.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Rio Claro'
    },
    {
      'arquivo': 'Orçamento 2017 - Rio Das Flores.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Rio Das Flores'
    },
    {
      'arquivo': 'Orçamento 2017 - Rio Das Ostras.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Rio Das Ostras'
    },
    {
      'arquivo': 'Orçamento 2017 - Rio de Janeiro.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Rio de Janeiro'
    },
    {
      'arquivo': 'Orçamento 2017 - Santa Maria Madalena.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Santa Maria Madalena'
    },
    {
      'arquivo': 'Orçamento 2017 - Santo Antônio de Pádua.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Santo Antônio de Pádua'
    },
    {
      'arquivo': 'Orçamento 2017 - São Fidélis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - São Fidélis'
    },
    {
      'arquivo': 'Orçamento 2017 - São Francisco de Itabapoana.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - São Francisco de Itabapoana'
    },
    {
      'arquivo': 'Orçamento 2017 - São Gonçalo.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - São Gonçalo'
    },
    {
      'arquivo': 'Orçamento 2017 - São João da Barra.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - São João da Barra'
    },
    {
      'arquivo': 'Orçamento 2017 - São João de Meriti.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - São João de Meriti'
    },
    {
      'arquivo': 'Orçamento 2017 - São José de Ubá.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - São José de Ubá'
    },
    {
      'arquivo': 'Orçamento 2017 - São José do Vale do Rio Preto.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - São José do Vale do Rio Preto'
    },
    {
      'arquivo': 'Orçamento 2017 - São Pedro da Aldeia.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - São Pedro da Aldeia'
    },
    {
      'arquivo': 'Orçamento 2017 - São Sebastião do Alto.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - São Sebastião do Alto'
    },
    {
      'arquivo': 'Orçamento 2017 - Sapucaia.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Sapucaia'
    },
    {
      'arquivo': 'Orçamento 2017 - Saquarema.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Saquarema'
    },
    {
      'arquivo': 'Orçamento 2017 - Seropédica.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Seropédica'
    },
    {
      'arquivo': 'Orçamento 2017 - Silva Jardim.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Silva Jardim'
    },
    {
      'arquivo': 'Orçamento 2017 - Sumidouro.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Sumidouro'
    },
    {
      'arquivo': 'Orçamento 2017 - Tanguá.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Tanguá'
    },
    {
      'arquivo': 'Orçamento 2017 - Teresópolis.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Teresópolis'
    },
    {
      'arquivo': 'Orçamento 2017 - Trajano de Morais.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Trajano de Moraes'
    },
    {
      'arquivo': 'Orçamento 2017 - Três Rios.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Três Rios'
    },
    {
      'arquivo': 'Orçamento 2017 - Valença.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Valença'
    },
    {
      'arquivo': 'Orçamento 2017 - Varre-sai.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Varre-sai'
    },
    {
      'arquivo': 'Orçamento 2017 - Vassouras.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Vassouras'
    },
    {
      'arquivo': 'Orçamento 2017 - Volta Redonda.pdf',
      'palavrasChave': '',
      'categoria': 'repasse',
      'nome': 'Repasse Financeiro Federal 2017 - Volta Redonda'
    },
    {
      'arquivo': 'ANGRA DOS REIS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Angra dos Reis'
    },
    {
      'arquivo': 'APERIBE_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Aperibé'
    },
    {
      'arquivo': 'ARARUAMA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Araruama'
    },
    {
      'arquivo': 'AREAL_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Areal'
    },
    {
      'arquivo': 'ARMAÇÃO DE BÚZIOS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Armação dos Búzios'
    },
    {
      'arquivo': 'ARRAIAL DO CABO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Arraial do Cabo'
    },
    {
      'arquivo': 'BARRA DO PIRAÍ_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Barra do Piraí'
    },
    {
      'arquivo': 'BARRA MANSA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Barra Mansa'
    },
    {
      'arquivo': 'BELFORD ROXO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Belford Roxo'
    },
    {
      'arquivo': 'BOM JARDIM_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Bom Jardim'
    },
    {
      'arquivo': 'BOM JESUS DO ITABAPOANA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Bom Jesus do Itabapoana'
    },
    {
      'arquivo': 'CABO FRIO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Cabo Frio'
    },
    {
      'arquivo': 'CACHOEIRAS DE MACACU_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Cachoeiras de Macacu'
    },
    {
      'arquivo': 'CAMBUCI_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Cambuci'
    },
    {
      'arquivo': 'CAMPOS DOS GOYTACAZES_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Campos dos Goytacazes'
    },
    {
      'arquivo': 'CANTAGALO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Cantagalo'
    },
    {
      'arquivo': 'CARAPEBUS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Carapebus'
    },
    {
      'arquivo': 'CARDOSO MOREIRA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Cardoso Moreira'
    },
    {
      'arquivo': 'CARMO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Carmo'
    },
    {
      'arquivo': 'CASIMIRO DE ABREU_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Casimiro de Abreu'
    },
    {
      'arquivo': 'COMENDADOR LEVY GASPARIAN_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Comendador Levy Gasparian'
    },
    {
      'arquivo': 'CONCEICAO DE MACABU_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Conceição de Macabu'
    },
    {
      'arquivo': 'CORDEIRO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Cordeiro'
    },
    {
      'arquivo': 'DUAS BARRAS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Duas Barras'
    },
    {
      'arquivo': 'DUQUE DE CAXIAS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Duque de Caxias'
    },
    {
      'arquivo': 'ENGENHEIRO PAULO DE FRONTIN_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Engenheiro Paulo de Frontin'
    },
    {
      'arquivo': 'GUAPIMIRIM_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Guapimirim'
    },
    {
      'arquivo': 'IGUABA GRANDE_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Iguaba Grande'
    },
    {
      'arquivo': 'ITABORAI_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Itaboraí'
    },
    {
      'arquivo': 'ITAGUAI_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Itaguaí'
    },
    {
      'arquivo': 'ITALVA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Italva'
    },
    {
      'arquivo': 'ITAOCARA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Itaocara'
    },
    {
      'arquivo': 'ITAPERUNA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Itaperuna'
    },
    {
      'arquivo': 'ITATIAIA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Itatiaia'
    },
    {
      'arquivo': 'JAPERI_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Japeri'
    },
    {
      'arquivo': 'LAJE DO MURIAE_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Laje do Muriaé'
    },
    {
      'arquivo': 'MACAE_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Macaé'
    },
    {
      'arquivo': 'MACUCO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Macuco'
    },
    {
      'arquivo': 'MAGE_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Magé'
    },
    {
      'arquivo': 'MANGARATIBA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Mangaratiba'
    },
    {
      'arquivo': 'MARICA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Maricá'
    },
    {
      'arquivo': 'MENDES_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Mendes'
    },
    {
      'arquivo': 'MESQUITA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Mesquita'
    },
    {
      'arquivo': 'MIGUEL PEREIRA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Miguel Pereira'
    },
    {
      'arquivo': 'MIRACEMA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Miracema'
    },
    {
      'arquivo': 'NATIVIDADE_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Natividade'
    },
    {
      'arquivo': 'NILOPOLIS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Nilópolis'
    },
    {
      'arquivo': 'NITEROI_2015.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2015 - Niterói'
    },
    {
      'arquivo': 'NOVA FRIBURGO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Nova Friburgo'
    },
    {
      'arquivo': 'NOVA IGUACU_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Nova Iguaçu'
    },
    {
      'arquivo': 'PARACAMBI_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Paracambi'
    },
    {
      'arquivo': 'PARAIBA DO SUL_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Paraíba do Sul'
    },
    {
      'arquivo': 'PARATY_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Paraty'
    },
    {
      'arquivo': 'PATY DO ALFERES_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Paty dos Alferes'
    },
    {
      'arquivo': 'PETROPOLIS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Petrópolis'
    },
    {
      'arquivo': 'PINHEIRAL_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Pinheiral'
    },
    {
      'arquivo': 'PIRAI_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Piraí'
    },
    {
      'arquivo': 'PORCIUNCULA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Porciúncula'
    },
    {
      'arquivo': 'PORTO REAL_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Porto Real'
    },
    {
      'arquivo': 'QUATIS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Quatis'
    },
    {
      'arquivo': 'QUEIMADOS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Queimados'
    },
    {
      'arquivo': 'QUISSAMA_2017.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Quissamã'
    },
    {
      'arquivo': 'RESENDE_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Resende'
    },
    {
      'arquivo': 'RIO BONITO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Rio Bonito'
    },
    {
      'arquivo': 'RIO CLARO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Rio Claro'
    },
    {
      'arquivo': 'RIO DAS FLORES_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Rio das Flores'
    },
    {
      'arquivo': 'RIO DAS OSTRAS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Rio das Ostras'
    },
    {
      'arquivo': 'RIO DE JANEIRO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Rio de Janeiro'
    },
    {
      'arquivo': 'SANTA MARIA MADALENA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Santa Maria Madalena'
    },
    {
      'arquivo': 'SANTO ANTONIO DE PADUA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Santo Antônio de Pádua'
    },
    {
      'arquivo': 'SAO FIDELIS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - São Fidélis'
    },
    {
      'arquivo': 'SAO FRANCISCO DO ITABAPOANA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - São Francisco de Itabapoana'
    },
    {
      'arquivo': 'SAO GONCALO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - São Gonçalo'
    },
    {
      'arquivo': 'SAO JOAO DA BARRA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - São João da Barra'
    },
    {
      'arquivo': 'SAO JOAO DE MERITI_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - São João de Meriti'
    },
    {
      'arquivo': 'SAO JOSE DE UBA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - São José de Ubá'
    },
    {
      'arquivo': 'SAO JOSE DO VALE DO RIO PRETO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - São José do Vale do Rio Preto'
    },
    {
      'arquivo': 'SAO PEDRO DA ALDEIA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - São Pedro da Aldeia'
    },
    {
      'arquivo': 'SAO SEBASTIAO DO ALTO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - São Sebastião do Alto'
    },
    {
      'arquivo': 'SAPUCAIA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Sapucaia'
    },
    {
      'arquivo': 'SAQUAREMA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Saquarema'
    },
    {
      'arquivo': 'SEROPEDICA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Seropédica'
    },
    {
      'arquivo': 'SILVA JARDIM_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Silva Jardim'
    },
    {
      'arquivo': 'SUMIDOURO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Sumidouro'
    },
    {
      'arquivo': 'TANGUA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Tanguá'
    },
    {
      'arquivo': 'TERESOPOLIS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Teresópolis'
    },
    {
      'arquivo': 'TRAJANO DE MORAIS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Trajano de Moraes'
    },
    {
      'arquivo': 'TRES RIOS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Três Rios'
    },
    {
      'arquivo': 'VALENÇA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Valença'
    },
    {
      'arquivo': 'VARRE-SAI-2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Varre-Sai'
    },
    {
      'arquivo': 'VASSOURAS_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Vassouras'
    },
    {
      'arquivo': 'VOLTA REDONDA_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoMunicipal',
      'nome': 'Orçamento 2016 - Volta Redonda'
    },
    {
      'arquivo': 'ESTADO DO RIO DE JANEIRO_2016.pdf',
      'palavrasChave': '',
      'categoria': 'orcamentoEstadual',
      'nome': 'Orçamento Estadual 2016'
    }
  ];

  constructor(private injector: Injector, public routerext: RouterExtensions, private route: ActivatedRoute,
              private router: Router,) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pesquisa = params['pesquisa'];
      this.categoria = params['categoria'];
      this.pesquisar(this.categoria, this.pesquisa);
    });

  }

  public pesquisar(categoria: string, value: string): void {
    this.documentosProcurados = [];
    if(value === '0') {
      if(categoria === '0') {
        this.documentosProcurados = this.documentos;
        this.resultadosEncontrados = this.documentos.length;
      }else {
        for (let i: number = 0; i<this.documentos.length; i++) {
          if (this.documentos[i].categoria.toUpperCase().indexOf(categoria.toUpperCase()) !== -1) {
            this.documentosProcurados.push(this.documentos[i]);
            this.resultadosEncontrados++;
          }else if(categoria.toUpperCase().indexOf('ORCAMENTO') !== -1 && ((this.documentos[i].categoria.toUpperCase().indexOf('REPASSE')) !== -1 )) {
            this.documentosProcurados.push(this.documentos[i]);
            this.resultadosEncontrados++;
          }
        }
      }

    }else {
      if(categoria === '0') {
        for (let i: number = 0; i<this.documentos.length; i++) {
          if (this.documentos[i].nome.toUpperCase().indexOf(value.toUpperCase()) !== -1) {
            this.documentosProcurados.push(this.documentos[i]);
            this.resultadosEncontrados++;
          } else {
            if (this.documentos[i].palavrasChave.toUpperCase().indexOf(value.toUpperCase()) !== -1) {
              this.documentosProcurados.push(this.documentos[i]);
              this.resultadosEncontrados++;
            }
          }
        }
      }else {
        for (let i: number = 0; i<this.documentos.length; i++) {
          if (this.documentos[i].nome.toUpperCase().indexOf(value.toUpperCase()) !== -1 && (( this.documentos[i].categoria.toUpperCase().indexOf(categoria.toUpperCase()) !== -1) || (categoria.toUpperCase().indexOf('ORCAMENTO') !== -1) && ((this.documentos[i].categoria.toUpperCase().indexOf('REPASSE')) !== -1 ) )) {
            this.documentosProcurados.push(this.documentos[i]);
            this.resultadosEncontrados++;
          } else {
            if (this.documentos[i].palavrasChave.toUpperCase().indexOf(value.toUpperCase()) !== -1 && ((this.documentos[i].categoria.toUpperCase().indexOf(categoria.toUpperCase()) !== -1) || (categoria.toUpperCase().indexOf('ORCAMENTO') !== -1) && ((this.documentos[i].categoria.toUpperCase().indexOf('REPASSE')) !== -1 ) )) {
              this.documentosProcurados.push(this.documentos[i]);
              this.resultadosEncontrados++;
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.resultadosEncontrados = 0;
    let campoPesquisa = document.getElementById('_mprjbusca_WAR_mprjbuscaportlet_keywords_param2') as HTMLInputElement;
    let campoCategoria = document.getElementsByName('categoria')[0] as HTMLInputElement;
    this.pesquisar(campoCategoria.value, campoPesquisa.value);
  }

}

// TODO refatorar como serviço
interface IPesquisa {
  arquivo:       string;
  palavrasChave: string;
  categoria:     string;
  nome:          string;
}
