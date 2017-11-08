import { MPRankingComponent } from './mp-ranking.component';

export const MPRankingRoutes: Array<any> = [
  {component:  MPRankingComponent,          path: 'ranking/:municipio/:dimensao'},
  {redirectTo: '/ranking/0/geral', path: 'ranking'},
];
