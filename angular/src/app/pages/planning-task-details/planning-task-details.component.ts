import {
  Component, OnInit, NgModule
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  DxButtonModule,
  DxDropDownButtonModule,
  DxTabPanelModule,
  DxValidationGroupModule,
  DxScrollViewModule,
} from 'devextreme-angular';
import {
  CardActivitiesModule,
  CardNotesModule,
  CardMessagesModule,
  StatusIndicatorModule,
} from 'src/app/components';
import { Task } from 'src/app/types/task';
import { DataService } from 'src/app/services';
import { TaskFormModule } from 'src/app/components/library/task-form/task-form.component';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { CotationService } from 'src/app/services/cotation.service';
import { Cotation } from 'src/app/services/model/cotation';
import { FrameworkSalireService } from 'src/app/services/framework-salire.service';
import { SensCotationService } from 'src/app/services/sens-cotation.service';
import { NatureCotationService } from 'src/app/services/nature-cotation.service';
import { IncotermServiceService } from 'src/app/services/incoterm-service.service';
import { PaysService } from 'src/app/services/pays.service';
import { PortService } from 'src/app/services/port.service';
import { TypeOperationService } from 'src/app/services/type-operation.service';
import { FrameworkSalarie } from 'src/app/services/model/FrameworkSalaire';
import { TradeTypeOperationCotation } from 'src/app/services/model/typeOperation';
import { TradeSensCotation } from 'src/app/services/model/sens';
import { TradeNatureCotation } from 'src/app/services/model/nature';
import { FrameworkIncoterm } from 'src/app/services/model/incoterm';
import { FrameworkPay } from 'src/app/services/model/pays';
import { FrameworkPort } from 'src/app/services/model/port';

const DEFAULT_TASK_ID = 1;
const DEFAULT_COTATION_ID = 1;


@Component({
  templateUrl: './planning-task-details.component.html',
  styleUrls: ['./planning-task-details.component.scss'],
  providers: [DataService, CotationService],
})
export class PlanningTaskDetailsComponent implements OnInit {
  task: Task;
  cotation: Cotation;
  frameworkSalaire: FrameworkSalarie[] = [];
  typeOperation: TradeTypeOperationCotation[] = [];
  sensCotation: TradeSensCotation[] = [];
  natureCotation: TradeNatureCotation[] = [];
  incoterms: FrameworkIncoterm[] = [];
  pays: FrameworkPay[] = [];
  port: FrameworkPort[] = [];

  cotationId: number;


  taskId: number;

  taskName = 'Loading...';

  isLoading = false;

  constructor(
    private service: DataService,
    private route: ActivatedRoute,
    private location: Location,
    private serviceCotation: CotationService,
    private frameworkSalireService: FrameworkSalireService,
    private sensCotationService: SensCotationService,
    private natureCotationService: NatureCotationService,
    private incotermService: IncotermServiceService,
    private payService: PaysService,
    private portService: PortService,
    private tradeTypeOperationService: TypeOperationService
  ) {
    // const id = parseInt(this.route.snapshot.queryParamMap.get('id'), 10);
    // this.taskId = id || DEFAULT_TASK_ID;
    const id = parseInt(this.route.snapshot.queryParamMap.get('id'), 10);
    this.cotationId = id || DEFAULT_COTATION_ID;
  }

  loadData = () => {
    this.service.getTask(this.taskId).subscribe((data) => {
      this.task = data;
      this.taskName = data.text;
      this.isLoading = false;
    });
  };
  // loadCotationData = () => {
  //   this.serviceCotation.getById(this.cotationId).subscribe((data) => {
  //     this.cotation = data;
  //     console.log("data est ", data)
  //     this.isLoading = false;
  //   });
  // };
  loadCotationData(): void {
    this.isLoading = true;
  
    // Load the cotation by ID
    this.serviceCotation.getById(this.cotationId).subscribe({
      next: (data) => {
        this.cotation = data;
  
        //  Parallel load of related lookups to show readable labels
        this.loadPort();
        this.loadPays();
        this.loadIncoterms();
        this.loadNatureCotation();
        this.loadTradeSens();
        this.loadTradeTypeOperation();
        this.loadFrameworkSalaire();
  
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cotation:', err);
        this.isLoading = false;
      },
    });
  }
  
//this.loadData();
  ngOnInit(): void {
    
    this.loadCotationData();
  }

  refresh = () => {
    this.isLoading = true;
    //this.loadData();
    this.loadCotationData();
  }

  navigateBack(): void {
    this.location.back()
  }


  //all load 
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
//all parameter id

// 🔹 Generic lookup helper
private getLabel<T extends { id: number; libelle: string }>(
  list: T[] | undefined,
  id: number | undefined
): string {
  if (!id || !list) return '';
  const item = list.find(x => x.id === id);
  return item ? item.libelle : '';
}

// 🔹 Specific getters using the generic one
// getDemandeurName(id: number | undefined): string {
//   return this.getLabel(this.frameworkSalaire, id);
// }

// getCommercialName(id: number | undefined): string {
//   return this.getLabel(this.frameworkSalaire, id);
// }

// getTypeOperationName(id: number | undefined): string {
//   return this.getLabel(this.typeOperation, id);
// }

// getSensName(id: number | undefined): string {
//   return this.getLabel(this.sensCotation, id);
// }

// getNatureName(id: number | undefined): string {
//   return this.getLabel(this.natureCotation, id);
// }

// getIncotermName(id: number | undefined): string {
//   return this.getLabel(this.incoterms, id);
// }

getPaysName(id: number | undefined): string {
  return this.getLabel(this.pays, id);
}

getPortName(id: number | undefined): string {
  return this.getLabel(this.port, id);
}

getDemandeurName(idDemandeur: number): string {
  return this.frameworkSalaire?.find(f => f.id === idDemandeur)?.fullName || '';
}
getLibelle(list: any[], id: number, field: string = 'libelle'): string {
  return list?.find(item => item.id === id)?.[field] || '';
}


}



//all


@NgModule({
  imports: [
    DxButtonModule,
    DxDropDownButtonModule,
    DxTabPanelModule,
    DxValidationGroupModule,
    DxToolbarModule,

    CardActivitiesModule,
    CardNotesModule,
    CardMessagesModule,
    TaskFormModule,
    StatusIndicatorModule,
    DxScrollViewModule,
    CommonModule,
  ],
  providers: [],
  exports: [],
  declarations: [PlanningTaskDetailsComponent],
})
export class PlanningTaskDetailsModule { }
