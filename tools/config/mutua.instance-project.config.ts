/** <pre>
 * mutua.instance-project.config.ts
 * ================================
 * (created by luiz on Thu, Feb, 2, 2017)
 *
 * Used by 'mutuatech.building.config' and 'mutuatech.loading.config' to tell them which
 * angular modules should be bundled and bootstrapped along with this instance project.
 *
 * This file should not be bundled nor loaded by the application for it is a buildtime module.
 *
 * Whenever a new module or component is added to 'mutua.available.modules.and.components.config.ts'
 * this file should be regenerated with the command:
 *
 * @see mutua.available.modules.and.components.config.ts
 * @see mutuatech.building.config
 * @see mutuatech.loading.config
 * @author luiz
 */

import { IInstanceProjectsComponentActivationConfiguration,
         IInstanceProjectsModuleActivationConfiguration     } from './mutua.available.modules.and.components.config';

/** Application Title: please, also define it in:
 * 1) package.json, nativescript/package.json and src/client/package.json
 * 2) ./src/client/main.desktop.ts
 * 3) ./tools/config/seed-advanced.config.ts
 * 4) Search for 'Angular Seed' in ./tools/install.js
 * 5) nativescript/platforms/android/src/main/res/values/strings.xml
 * */
export const appTitle: string = 'Observatório SUAS';

export const appDescription: string = 'Consultas aos dados do Censo SUAS e Internos do MPRJ';

/** theme configuration
 *  NOTE 1: currently, when changing themes and testing on the mobile, you must manually clean things by 'rm -fr nativescript/platforms/android/build' -- maybe you'll need that for iPhone too.
 *  NOTE 2: for now, when switching themes, you'll need to manually remove all .html, .scss and .css files under the following directories:
 *          - src/client/app/{components,shared,modules}
 *          - src/client/{css,scss}
 *          - nativescript/src
 *          - src/client/index.html */

export const appTheme    : string = 'observatorio-SUAS';   /** One of the directories in 'themes/' */
export const primeNGTheme: string = 'kasper';   /** One of the directories in 'node-modules/primeng/resources/themes/' -- If you have 'PRIMENG_MODULES' enabled */

/** Defines the components this application should bundle and load, for html (web and desktop) and mobile platforms.
 *  All 'component' entries must have been previously defined by 'MutuaAvailableComponentsConfiguration', from
 *  'mutua.available.modules.and.components.config.ts' */
export const MutuaInstanceProjectComponentsActivationConfiguration: IInstanceProjectsComponentActivationConfiguration[] = [
  {componentName: 'NG2AppComponent', htmlEnabled: true,  mobileEnabled: false},
  {componentName: 'AppComponent',    htmlEnabled: false, mobileEnabled: true},
/*
  {componentName: 'AboutComponent',  htmlEnabled: true,  mobileEnabled: true},
  {componentName: 'HomeComponent',   htmlEnabled: true,  mobileEnabled: true},
  {componentName: 'GvHomeComponent', htmlEnabled: true,  mobileEnabled: true},
 */


  // componentes do projeto observatorio-SUAS
  {componentName: 'MPHomeComponent',              htmlEnabled: true,  mobileEnabled: true},
  {componentName: 'MPDadosEIndicadoresComponent', htmlEnabled: true,  mobileEnabled: true},
  // {componentName: 'MPInspecoesComponent',         htmlEnabled: true,  mobileEnabled: true},
  {componentName: 'MPBuscaComponent',             htmlEnabled: true,  mobileEnabled: true},
  {componentName: 'MPAjudaComponent',             htmlEnabled: true,  mobileEnabled: true},
  {componentName: 'MPRankingComponent',           htmlEnabled: true,  mobileEnabled: true},
  {componentName: 'MPMetodologiaComponent',       htmlEnabled: true,  mobileEnabled: true},
];

/** Defines the modules this application should bundle and load, for html (web and desktop) and mobile platforms.
 *  All 'module' entries must have been previously defined by 'MutuaAvailableModulesConfiguration', from
 *  'mutua.available.modules.and.components.config.ts' */
export const MutuaInstanceProjectModulesActivationConfiguration: IInstanceProjectsModuleActivationConfiguration[] = [
  {moduleName: 'MNg2AdminModule',         htmlEnabled: true,  mobileEnabled: false},  // Modules from ng2-admin project. Use it along with 'ng2-admin' theme
  {moduleName: 'BrowserAnimationsModule', htmlEnabled: true,  mobileEnabled: false},  // angular4 module. Required by 'PRIMENG_MODULES'
//  {moduleName: 'MHelloWorldModule',       htmlEnabled: false, mobileEnabled: false},  // sample module with some SaaS components
  {moduleName: 'NgbModule',               htmlEnabled: true,  mobileEnabled: false},  // bootstrap for angular
  {moduleName: 'PRIMENG_MODULES',         htmlEnabled: true,  mobileEnabled: false},  // form components. depends on 'BrowserAnimationsModule'

  // módulos do projeto angular-seed-advanced-mprj
  {moduleName: 'MPRJModule', htmlEnabled: true, mobileEnabled: false},

  // módulos do projeto Edificando o Controle Interno
  {moduleName: 'MEdificandoOControleInternoModule', htmlEnabled: true, mobileEnabled: false},

  // módulos do projeto Observatório SUAS
  {moduleName: 'MObservatorioSUASModule', htmlEnabled: true, mobileEnabled: false},

];

// app components
export const MutuaHTMLAppComponentName   :string = 'NG2AppComponent';
export const MutuaMobileAppComponentName :string = 'AppComponent';
