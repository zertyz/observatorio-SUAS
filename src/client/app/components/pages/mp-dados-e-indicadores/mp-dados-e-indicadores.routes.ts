import { MPDadosEIndicadoresComponent } from './mp-dados-e-indicadores.component';

export const MPDadosEIndicadoresRoutes: Array<any> = [

  {component:  MPDadosEIndicadoresComponent,               path: 'dados-e-indicadores/:municipio'},
  {redirectTo: '/dados-e-indicadores/Rio de Janeiro - RJ', path: 'dados-e-indicadores'},

];
