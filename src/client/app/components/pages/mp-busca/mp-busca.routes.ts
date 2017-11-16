import { MPBuscaComponent } from './mp-busca.component';

export const MPBuscaRoutes: Array<any> = [
  {
    path: 'busca/:categoria/:pesquisa',
    component: MPBuscaComponent
  },
  {
    path: 'busca/:categoria',
    redirectTo: '/busca/:categoria/0'
  },
  {
    path: 'busca',
    redirectTo: '/busca/0/0'
  }
];
