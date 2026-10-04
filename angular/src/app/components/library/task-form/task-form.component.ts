import {
  Component, NgModule, Input, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxButtonModule,
  DxFormModule,
  DxLoadPanelModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxTextAreaModule,
  DxToolbarModule,
  DxValidatorModule,
  DxCheckBoxModule,
  DxRadioGroupModule,
} from 'devextreme-angular';
import {
  StatusIndicatorModule,
  FormItemDateModule,
  FormTextboxModule,
} from 'src/app/components';
import { taskPriorityList, taskStatusList } from 'src/app/types/task';
import { Task } from 'src/app/types/task';
import { getSizeQualifier } from 'src/app/services/screen.service';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { ScreenService } from '../../../services';
import { ToolbarFormModule } from 'src/app/components/utils/toolbar-form/toolbar-form.component';
import { FrameworkPort } from 'src/app/services/model/port';
import { FrameworkPay } from 'src/app/services/model/pays';
import { FrameworkIncoterm } from 'src/app/services/model/incoterm';
import { TradeNatureCotation } from 'src/app/services/model/nature';
import { TradeSensCotation } from 'src/app/services/model/sens';
import { TradeTypeOperationCotation } from 'src/app/services/model/typeOperation';
import { FrameworkSalarie } from 'src/app/services/model/FrameworkSalaire';
import { Cotation } from 'src/app/services/model/cotation';
import { FrameworkSalireService } from 'src/app/services/framework-salire.service';
import { SensCotationService } from 'src/app/services/sens-cotation.service';
import { NatureCotationService } from 'src/app/services/nature-cotation.service';
import { IncotermServiceService } from 'src/app/services/incoterm-service.service';
import { PaysService } from 'src/app/services/pays.service';
import { PortService } from 'src/app/services/port.service';
import { TypeOperationService } from 'src/app/services/type-operation.service';
import { CotationService } from 'src/app/services/cotation.service';
import dxRadioGroup from 'devextreme/ui/radio_group';
import { raisonSociale } from 'src/app/services/model/raisonSociale';
import { RaisonSocialeService } from 'src/app/services/raison-sociale.service';
import { TiersContact } from 'src/app/services/model/tiersContact';
import { TiersContactService } from 'src/app/services/tiers-contact.service';


@Component({
  selector: 'task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task;

  @Input() isLoading: boolean = false;

  @Input() isCreateMode: boolean = false;
  cotation: Cotation;


  //model cotation 


  cotationss =  new Cotation();
  raisonSociales = new raisonSociale;


  cotations: Cotation[] = [];
  frameworkSalaire: FrameworkSalarie[] = [];
  typeOperation: TradeTypeOperationCotation[] = [];
  sensCotation: TradeSensCotation[] = [];
  natureCotation: TradeNatureCotation[] = [];
  incoterms: FrameworkIncoterm[] = [];
  pays: FrameworkPay[] = [];
  port: FrameworkPort[] = [];
  raisonSocialeModel: raisonSociale[] = [];
  tierContact: TiersContact[] = [];


  cotationsWithClientName: any[] = [];
  cotationsWithComercilName: any[] = [];
  typeOperationDesignation: any[] = [];
  natureDesignation: any[] = [];
  CotationraisonSociale: any[] = [];
  ContactRaisonSociale: any[] = [];
  incotermCotation: any[] = [];




  savedData: Task = null;

  isEditing = false;

  statusList = taskStatusList;

  priorityList = taskPriorityList;

  getSizeQualifier = getSizeQualifier;

  constructor(protected screen: ScreenService,private frameworkSalireService: FrameworkSalireService,
    private sensCotationService: SensCotationService,
    private natureCotationService: NatureCotationService,
    private incotermService: IncotermServiceService,
    private payService: PaysService,
    private portService: PortService,
    private raisonSocialeService: RaisonSocialeService,
    private serviceTiersContact: TiersContactService,
    private tradeTypeOperationService: TypeOperationService,private serviceCotation: CotationService) {}

  ngOnInit() {
    this.isEditing = this.isCreateMode;

    // if (this.isCreateMode && !this.cotation.dateDemande) {
    //   this.cotation.dateDemande = new Date(); // set current system date
    //this.cotation.dateDemande = new Date();
    // }
    


    this.loadCotations();
    this.loadFrameworkSalaire();
    this.loadTradeTypeOperation();
    this.loadTradeSens();
    this.loadNatureCotation();
    this.loadIncoterms();
    this.loadPort();
    this.loadPays();
    this.loadRaisonSociale();
    this.loadContact();
  }


  //load cotation 
  loadContact(): void {
    this.serviceTiersContact.getAllContact().subscribe({
      next: (data) => {
        this.tierContact = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading Tiers contact:', err);
        this.isLoading = false;
      }
    });
  }
//   loadRaisonSociale(): void {
//     this.raisonSocialeService.getAllRaisonSocialeFirst10().subscribe({
//       next: (data) => {
//         this.raisonSocialeModel = data;

//           //RaisonSociale 
//       this.CotationraisonSociale = this.raisonSocialeModel.map(cot => ({
//         ...cot,
//         raisonSoc: this.raisonSocialeModel.find(f => f.id)?.raisonSociale || 'N/A'
//       }));

//        //Contact raison Sociale  
//        this.ContactRaisonSociale = this.raisonSocialeModel.map(cot => ({
//         ...cot,
//         raisonContact: this.tierContact.find(f => f.id === cot.id)?.prenom || 'N/A'

//  //clientName: this.frameworkSalaire.find(f => f.id === cot.idDemandeur)?.fullName || 'N/A'

//       }));
//       console.log('raison sociale ', data);
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error loadig raison sociale ', err);
//         this.isLoading = false;
//       }
//     });
//   }
loadRaisonSociale(): void {
  this.raisonSocialeService.getRaisonSociale(1, 10).subscribe({
    next: (data) => {
      this.raisonSocialeModel = data;

      // Raison sociale list
      this.CotationraisonSociale = data.map(cot => ({
        ...cot,
        raisonSoc: cot.raisonSociale || 'N/A'
      }));

      // 👉 At start: no contact loaded until raison sociale is selected
      this.ContactRaisonSociale = [];

      console.log('raison sociale ', this.CotationraisonSociale);

      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading raison sociale ', err);
      this.isLoading = false;
    }
  });
}
loadContactsByRaisonSociale(raisonSocialeId: number): void {
  this.ContactRaisonSociale = this.tierContact
    .filter(c => c.idTiers === raisonSocialeId) // match contacts for that raison sociale
    .map(c => ({
      ...c,
      raisonContact: c.idTiers || 'N/A'
    }));

  // Auto-select first contact if exists
  if (this.ContactRaisonSociale.length > 0) {
    this.raisonSociales.id = this.ContactRaisonSociale[0].prenom;
  } else {
    this.raisonSociales.id = null;
  }
}



  loadPort(): void {
    this.portService.getAllPort().subscribe({
      next: (data) => {
        this.port = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loadig port:', err);
        this.isLoading = false;
      }
    });
  }
  loadPays(): void {
    this.payService.getAllPays().subscribe({
      next: (data) => {
        this.pays = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loadig pays:', err);
        this.isLoading = false;
      }
    });
  }
  loadIncoterms(): void {
    this.incotermService.getAllIncoterms().subscribe({
      next: (data) => {
        this.incoterms = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading incoterms:', err);
        this.isLoading = false;
      }
    });
  }
  loadNatureCotation(): void {
    this.natureCotationService.getAllNature().subscribe({
      next: (data) => {
        this.natureCotation = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trade nature:', err);
        this.isLoading = false;
      }
    });
  }
  loadTradeSens(): void {
    this.sensCotationService.getAllSens().subscribe({
      next: (data) => {
        this.sensCotation = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trade sens:', err);
        this.isLoading = false;
      }
    });
  }
  loadTradeTypeOperation(): void {
    this.tradeTypeOperationService.getAllOperation().subscribe({
      next: (data) => {
        this.typeOperation = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trade type:', err);
        this.isLoading = false;
      }
    });
  }
  loadCotations(): void {
  this.serviceCotation.getAllCotation().subscribe({
    next: (data) => {
      this.cotations = data;
      console.log('Error loading cotations:');
      //return the name 
       // Map cotations to include client name
       this.cotationsWithClientName = this.cotations.map(cot => ({
        ...cot,
        clientName: this.frameworkSalaire.find(f => f.id === cot.idDemandeur)?.fullName || 'N/A'
      }));

      //commerciale
      this.cotationsWithComercilName = this.cotations.map(cot => ({
        ...cot,
        commercialName: this.frameworkSalaire.find(f => f.id === cot.idCommercial)?.fullName || 'N/A'
      }));

      //typ oper

      this.typeOperationDesignation = this.cotations.map(cot => ({
        ...cot,
        typeOp: this.typeOperation.find(f => f.id === cot.idTypeOperation)?.designation || 'N/A'
      }));

      //nature 
      this.natureDesignation = this.cotations.map(cot => ({
        ...cot,
        natureDes: this.natureCotation.find(f => f.id === cot.idNature)?.designation || 'N/A'
      }));

      //incoterm
      this.incotermCotation = this.cotations.map(cot => ({
        ...cot,
        incotermName: this.incoterms.find(f => f.id === cot.idIncoterm)?.designation || 'N/A'
      }));

    


      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading cotations:', err);
      this.isLoading = false;
    }
  });
  }
  loadFrameworkSalaire(): void {
  this.frameworkSalireService.getAllClient().subscribe({
    next: (data) => {
      this.frameworkSalaire = data;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading client ', err);
      this.isLoading = false;
    }
  });
  }

  handleEditClick = () => {
    this.savedData = { ...this.task }
    this.isEditing = true;
  };

  // handleSaveClick = ({ validationGroup }: DxButtonTypes.ClickEvent) => {
  //   if(!validationGroup.validate().isValid) return;
  //   this.savedData = null;
  //   this.isEditing = false;
  // };
  handleSaveClick = ({ validationGroup }: DxButtonTypes.ClickEvent) => {
    if (!validationGroup.validate().isValid) return;
  
    this.onSave(); // call the API save method
  
    this.savedData = null;
    this.isEditing = false;
  };
  


  onSave(): void {
    if (!this.cotationss) return;
  
    this.serviceCotation.create(this.cotationss).subscribe({
      next: (res: any) => {
        console.log("Cotation created successfully, reference:", res.reference);
        alert("Cotation créée avec référence: " + res.reference);
        this.isEditing = false;
        this.savedData = null;
      },
      error: (err: any) => console.error("Error creating cotation", err)
    });
  };
  

  handleCancelClick = () => {
    this.task = { ...this.savedData };
    this.isEditing = false;
  };

  getNewTaskData = ()=> ({ ...this.task });
}

//test 


@NgModule({
  imports: [
    DxButtonModule,
    DxFormModule,
    DxLoadPanelModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxToolbarModule,
    DxValidatorModule,
    DxCheckBoxModule,
    DxRadioGroupModule,

    FormTextboxModule,
    StatusIndicatorModule,
    FormItemDateModule,
    ToolbarFormModule,
    CommonModule
    
  ],
  providers: [],
  exports: [TaskFormComponent],
  declarations: [TaskFormComponent],
})
export class TaskFormModule { }
