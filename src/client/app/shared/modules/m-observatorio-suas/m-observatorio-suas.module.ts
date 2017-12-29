// angular
import { NgModule, ModuleWithProviders, Optional, SkipSelf, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';

// app
import { Config } from '../../../modules/core/index';

// services
import { DadosEIndicadoresService } from './services/dados-e-indicadores.service';
import { AjudaService } from './services/ajuda.service';
import { BuscaService } from './services/busca.service';

// bootstrap?
import { NgbModule,
         NgbDropdown, NgbDropdownModule,
         NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpModule,
    NgbModule,
    NgbDropdownModule,
  ],
   declarations: [

  ],
  exports: [
    
  ],
  entryComponents: [
  ],
  providers: [
    DadosEIndicadoresService,
    AjudaService,
    BuscaService,
    NgbModule,
    NgbDropdown,
    NgbActiveModal,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MObservatorioSUASModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MObservatorioSUASModule,
      providers: [DadosEIndicadoresService, AjudaService, BuscaService, NgbModule, NgbDropdown]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: MObservatorioSUASModule) {
    if (parentModule) {
      throw new Error('MObservatorioSUASModule already loaded; Import in root module only.');
    }
  }
}
