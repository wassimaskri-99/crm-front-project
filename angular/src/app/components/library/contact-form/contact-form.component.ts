import {
  Component, NgModule, Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxButtonModule,
  DxFormModule,
  DxLoadPanelModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxToolbarModule,
  DxValidatorModule,
  DxValidationGroupModule,
} from 'devextreme-angular';
import {
  ContactStatusModule,
  FormTextboxModule,
  FormPhotoModule,
  StatusSelectBoxModule,
} from 'src/app/components';
import { Contact } from 'src/app/types/contact';
import { ValidationRule } from 'devextreme-angular/common';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { ToolbarFormModule } from 'src/app/components/utils/toolbar-form/toolbar-form.component';
import { US_STATES } from 'src/app/shared/constants';
import { Cotation } from 'src/app/services/model/cotation';
import { FrameworkSalarie } from 'src/app/services/model/FrameworkSalaire';
import { TradeTypeOperationCotation } from 'src/app/services/model/typeOperation';
import { TradeSensCotation } from 'src/app/services/model/sens';
import { TradeNatureCotation } from 'src/app/services/model/nature';
import { FrameworkIncoterm } from 'src/app/services/model/incoterm';
import { FrameworkPay } from 'src/app/services/model/pays';
import { FrameworkPort } from 'src/app/services/model/port';
import { FrameworkSalireService } from 'src/app/services/framework-salire.service';
import { SensCotationService } from 'src/app/services/sens-cotation.service';
import { NatureCotationService } from 'src/app/services/nature-cotation.service';
import { IncotermServiceService } from 'src/app/services/incoterm-service.service';
import { PaysService } from 'src/app/services/pays.service';
import { PortService } from 'src/app/services/port.service';
import { TypeOperationService } from 'src/app/services/type-operation.service';
import { CotationService } from 'src/app/services/cotation.service';

@Component({
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent {
  @Input() contactData: Contact;

  @Input() isLoading: boolean;

  //cotation

  

  savedData: Contact = null;

  isEditing = false;

  zipCodeValidator: ValidationRule = { type: 'pattern', pattern: /^\d{5}$/, message: 'Zip is invalid' };

  usStates = US_STATES;

  constructor(){}


  handleEditClick() {
    this.savedData = { ...this.contactData };
    this.isEditing = true;
  }

  handleSaveClick({ validationGroup }: DxButtonTypes.ClickEvent) {
    if(!validationGroup.validate().isValid) return;
    this.isEditing = false;
    this.savedData = null;
  }

  handleCancelClick() {
    this.contactData = { ...this.savedData };
    this.isEditing = false;
  }
  
//load cotation

}


@NgModule({
  imports: [
    DxFormModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxLoadPanelModule,
    DxValidationGroupModule,

    FormTextboxModule,
    ContactStatusModule,
    FormPhotoModule,
    DxValidatorModule,
    ToolbarFormModule,
    CommonModule,
    StatusSelectBoxModule,
  ],
  providers: [],
  exports: [ContactFormComponent],
  declarations: [ContactFormComponent],
})
export class ContactFormModule { }
