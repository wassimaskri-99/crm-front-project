import {
  Component, OnInit, NgModule, ViewChild,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxTabsModule } from 'devextreme-angular/ui/tabs';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { DxTabsTypes } from 'devextreme-angular/ui/tabs';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
import notify from 'devextreme/ui/notify';
import { taskPanelItems } from 'src/app/types/resource';
import { Task, newTask } from 'src/app/types/task';
import { DataService, ScreenService } from 'src/app/services';
import { forkJoin, map, Observable } from 'rxjs';
import { TaskFormComponent, TaskFormModule } from 'src/app/components/library/task-form/task-form.component';
import { FormPopupModule } from 'src/app/components/utils/form-popup/form-popup.component';
import { TaskListGridComponent, TaskListModule } from 'src/app/components/library/task-list-grid/task-list-grid.component';
import { TaskListKanbanModule, TaskListKanbanComponent } from 'src/app/components/library/task-list-kanban/task-list-kanban.component';
import { TaskListGanttComponent, TaskListGanttModule } from 'src/app/components/library/task-list-gantt/task-list-gantt.component';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { ActivatedRoute, Router } from '@angular/router';
import { CotationService } from 'src/app/services/cotation.service';
import { Cotation } from 'src/app/services/model/cotation';
import { CotationListComponent, CotationListModule } from 'src/app/components/library/cotation-list/cotation-list.component';
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
import { DxLoadIndicatorModule, DxSelectBoxModule } from 'devextreme-angular';
//import { CotationListComponent, CotatioistModule } from 'src/app/components/library/cotation-list/cotation-list.component';

@Component({
  templateUrl: './planning-task-list.component.html',
  styleUrls: ['./planning-task-list.component.scss'],
  providers: [DataService, CotationService],
})
export class PlanningTaskListComponent implements OnInit {

  @Input() width!: number | string;

  isLoading = true;
  useNavigation = true;
  
  cotation: Cotation;
  frameworkSalaire: FrameworkSalarie[] = [];
  typeOperation: TradeTypeOperationCotation[] = [];
  sensCotation: TradeSensCotation[] = [];
  natureCotation: TradeNatureCotation[] = [];
  incoterms: FrameworkIncoterm[] = [];
  pays: FrameworkPay[] = [];
  port: FrameworkPort[] = [];

  cotationId: number;
  @ViewChild('planningDataGrid', { static: false }) dataGrid: TaskListGridComponent;
  //@ViewChild('planningDataGrid', { static: false }) dataGrid: CotationListComponent;
  //@ViewChild('planningDataGrid', { static: false }) dataGrid: CotationListComponent;


  @ViewChild('planningGantt', { static: false }) gantt: TaskListGanttComponent;

  @ViewChild('planningKanban', { static: false }) kanban: TaskListKanbanComponent;

  @ViewChild(TaskFormComponent, { static: false }) taskForm: TaskFormComponent;

  newTask = newTask;

  taskPanelItems = taskPanelItems;

  displayTaskComponent = this.taskPanelItems[0].text;

  cotationPanelItems = [{ text: 'Liste cotations' }];
  displayCotationComponent = this.cotationPanelItems[0].text;
  //displayCotationComponent = this.taskPanelItems[0].text;

  selectedIndex = 0;

  isAddTaskPopupOpened = false;

  displayGrid = this.displayTaskComponent === this.taskPanelItems[0].text;

  //displayGrid = this.displayCotationComponent === this.cotationPanelItems[0].text;
  // ajout d’un tableau dédié pour les cotations

// utiliser ce tableau plutôt que taskPanelItems
//datagrid = this.displayCotationComponent = this.cotationPanelItems[0].text;


  displayKanban = this.displayTaskComponent === this.taskPanelItems[1].text;

  taskCollections$: Observable<{ allTasks: Task[]; filteredTasks: Task[] }>;
  taskCollectionsCotation$: Observable<{ getAllCotation: Cotation[] }>;
  cotations: Cotation[] = [];

  private readonly viewToParam: Record<string, string> = {
    [this.taskPanelItems[0].text]: 'list',
    [this.taskPanelItems[1].text]: 'kanban-board',
    [this.taskPanelItems[2].text]: 'gantt'
  };

  private readonly paramToView: Record<string, string> = Object.fromEntries(
    Object.entries(this.viewToParam).map(([k, v]) => [v, k])
  );

  constructor(private service: DataService,
    private serviceCotation: CotationService,
    private frameworkSalireService: FrameworkSalireService,
    private sensCotationService: SensCotationService,
    private natureCotationService: NatureCotationService,
    private incotermService: IncotermServiceService,
    private payService: PaysService,
    private portService: PortService,
    private tradeTypeOperationService: TypeOperationService, protected screen: ScreenService, private route: ActivatedRoute, private router: Router) {}





  ngOnInit(): void {
    this.loadCotations();
    this.loadFrameworkSalaire();
    this.loadTradeTypeOperation();
    this.loadTradeSens();
    this.loadNatureCotation();
    this.loadIncoterms();
    this.loadPort();
    this.loadPays();
    this.taskCollections$ = forkJoin([
      this.service.getFilteredTasks(),
      this.service.getTasks(),
      
  
    ]).pipe(
      map(
        ([filteredTasks, allTasks]) => { return { allTasks, filteredTasks }  })
    );
    this.route.queryParamMap.subscribe(params => {
      const viewParam = params.get('view');
      if (viewParam && this.paramToView[viewParam] && this.paramToView[viewParam] !== this.displayTaskComponent) {
        this.displayTaskComponent = this.paramToView[viewParam];
        this.updateFlags();
      } else if (!viewParam) {
        this.updateQueryParam();
      }
    });

    this.updateFlags();
  }
   //all load 
   
   loadCotations(): void {
    this.serviceCotation.getAllCotation().subscribe({
      next: (data) => {
        this.cotations = data;
        console.log('Error loading cotations:');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cotations:', err);
        this.isLoading = false;
      }
    });
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


  // loadCotations(): void {
  //   this.serviceCotation.getAllCotation().subscribe({
  //     next: (data) => this.cotations = data,
  //     error: (err) => console.error('Error loading cotations:', err)
  //   });
  // }
  
  
  // ngOnInit(): void {
  //   this.loadCotations();
   
  //   }
  // }

  tabValueChange(e: DxTabsTypes.ItemClickEvent) {
    const { itemData } = e;
    this.displayTaskComponent = itemData.text;
    this.updateFlags();
    this.updateQueryParam();
  };

  addTask = () => {
    this.isAddTaskPopupOpened = true;
  };

  onClickSaveNewTask = () => {
    notify({
        message: `New task "${this.taskForm.getNewTaskData().text}" saved`,
        position: { at: 'bottom center', my: 'bottom center' }
      },
      'success');
  };

  refresh = () => {
    if (this.displayGrid) {
      this.dataGrid.refresh();
    } else if (this.displayKanban) {
      this.kanban.refresh();
    } else {
      this.gantt.refresh();
    }
  };

  chooseColumnDataGrid = () => this.dataGrid.showColumnChooser();

  searchDataGrid = (e: DxTextBoxTypes.InputEvent) => this.dataGrid.search(e.component.option('text'));

  exportToPdf = () => {
    if (this.displayGrid) {
      this.dataGrid.onExportingToPdf();
    } else {
      this.gantt.onExporting();
    }
  };

  exportDataGridToXSLX = () => this.dataGrid.onExportingToXLSX();

  private updateFlags() {
     this.displayGrid = this.displayTaskComponent === this.taskPanelItems[0].text;
    this.displayGrid = this.displayCotationComponent === this.cotationPanelItems[0].text;
    this.displayKanban = this.displayTaskComponent === this.taskPanelItems[1].text;
    const idx = this.taskPanelItems.findIndex(i => i.text === this.displayTaskComponent);
    this.selectedIndex = idx >= 0 ? idx : 0;
  }

  private updateQueryParam() {
    const qp = this.viewToParam[this.displayTaskComponent];
    if (qp) {
      this.router.navigate([], { queryParams: { view: qp }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

toogleUseNavigation = () => {
  this.useNavigation = !this.useNavigation;
};

navigateToDetails = (e: DxDataGridTypes.RowClickEvent) => {
  if(this.useNavigation && e.rowType !== 'detailAdaptive') {
    this.router.navigate(['/planning-task-details'], {
      queryParams: { id: e.data.id }
    });
  }
};
}


@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,
    DxTabsModule,
    DxToolbarModule,
    DxLoadPanelModule,
    FormPopupModule,
    DxSelectBoxModule,
    DxLoadIndicatorModule,

    TaskFormModule,
    TaskListKanbanModule,
    TaskListModule,
    TaskListGanttModule,

    CommonModule,
    CotationListModule   
  ],
  providers: [],
  exports: [],
  declarations: [PlanningTaskListComponent],
})
export class PlanningTaskListModule { }
