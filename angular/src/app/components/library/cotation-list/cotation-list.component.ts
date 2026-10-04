
import {
  Component, NgModule, ViewChild, EventEmitter, Output, Input, SimpleChanges, OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { taskPanelItems } from 'src/app/types/resource';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDropDownButtonModule,
  DxLoadPanelModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxTabsModule, DxTabsTypes } from 'devextreme-angular/ui/tabs';
import {
  FormPopupModule,
  StatusIndicatorModule,
} from 'src/app/components';
import { exportDataGrid as exportToPdf } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportToXLSX } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { jsPDF } from 'jspdf';
import { taskPriorityList, taskStatusList } from 'src/app/types/task';
import { Task } from 'src/app/types/task';
import 'jspdf-autotable';
import { Cotation } from 'src/app/services/model/cotation';
import { CotationService } from 'src/app/services/cotation.service';
import { FrameworkSalarie } from 'src/app/services/model/FrameworkSalaire';
import { FrameworkSalireService } from 'src/app/services/framework-salire.service';
import { TradeTypeOperationCotation } from 'src/app/services/model/typeOperation';
import { TypeOperationService } from 'src/app/services/type-operation.service';
import { TradeSensCotation } from 'src/app/services/model/sens';
import { SensCotationService } from 'src/app/services/sens-cotation.service';
import { TradeNatureCotation } from 'src/app/services/model/nature';
import { NatureCotationService } from 'src/app/services/nature-cotation.service';
import { FrameworkIncoterm } from 'src/app/services/model/incoterm';
import { IncotermServiceService } from 'src/app/services/incoterm-service.service';
import { FrameworkPay } from 'src/app/services/model/pays';
import { FrameworkPort } from 'src/app/services/model/port';
import { PaysService } from 'src/app/services/pays.service';
import { PortService } from 'src/app/services/port.service';
import { ToolbarAnalyticsModule } from '../../utils/toolbar-analytics/toolbar-analytics.component';
import { ScreenService } from 'src/app/services';
import { TaskFormModule } from '../task-form/task-form.component';
import { TaskListKanbanModule } from '../task-list-kanban/task-list-kanban.component';
import { TaskListModule } from '../task-list-grid/task-list-grid.component';
import { TaskListGanttModule } from '../task-list-gantt/task-list-gantt.component';


@Component({
  selector: 'app-cotation-list',
  templateUrl: './cotation-list.component.html',
  styleUrl: './cotation-list.component.scss'
})
export class CotationListComponent implements OnChanges {
  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;

  @Input() dataSource: Task[];
  //@Input() dataSource: Cotation[];



  @Output() tabValueChanged: EventEmitter<any> = new EventEmitter<EventEmitter<any>>();

  isAddTaskPopupOpened = false;

  tasks: Task[];
  //cotation

  cotations: Cotation[] = [];
  frameworkSalaire: FrameworkSalarie[] = [];
  typeOperation: TradeTypeOperationCotation[] = [];
  sensCotation: TradeSensCotation[] = [];
  natureCotation: TradeNatureCotation[] = [];
  incoterms: FrameworkIncoterm[] = [];
  pays: FrameworkPay[] = [];
  port: FrameworkPort[] = [];
  taskPanelItems = taskPanelItems;
  displayTaskComponent = this.taskPanelItems[0].text;


  displayGrid = this.displayTaskComponent === this.taskPanelItems[0].text;
  displayKanban = this.displayTaskComponent === this.taskPanelItems[1].text;

  private readonly viewToParam: Record<string, string> = {
    [this.taskPanelItems[0].text]: 'list',
    [this.taskPanelItems[1].text]: 'kanban-board',
    [this.taskPanelItems[2].text]: 'gantt'
  };

  private readonly paramToView: Record<string, string> = Object.fromEntries(
    Object.entries(this.viewToParam).map(([k, v]) => [v, k])
  );
  selectedIndex = 0;


  priorityList = taskPriorityList;

  statusList = taskStatusList;

  isLoading = true;

  useNavigation = true;

  constructor(private frameworkSalireService: FrameworkSalireService,
    private sensCotationService: SensCotationService,
    private natureCotationService: NatureCotationService,
    private incotermService: IncotermServiceService,
    private payService: PaysService,
    private portService: PortService,
    private tradeTypeOperationService: TypeOperationService,protected screen: ScreenService, private router: Router,private serviceCotation: CotationService,
    private route: ActivatedRoute
    
  ) {
  }

  refresh() {
    this.grid.instance.refresh();
  }

  showColumnChooser() {
    this.grid.instance.showColumnChooser();
  }

  search(text: string) {
    this.grid.instance.searchByText(text);
  }

  onExportingToPdf() {
    const doc = new jsPDF();
    exportToPdf({
      jsPDFDocument: doc,
      component: this.grid.instance,
    }).then(() => {
      doc.save('Tasks.pdf');
    });
  };

  addTask = () => {
    this.isAddTaskPopupOpened = true;
  };
  private updateQueryParam() {
    const qp = this.viewToParam[this.displayTaskComponent];
    if (qp) {
      this.router.navigate([], { queryParams: { view: qp }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }
  tabValueChange(e: DxTabsTypes.ItemClickEvent) {
    const { itemData } = e;
    this.displayTaskComponent = itemData.text;
    this.updateFlags();
    this.updateQueryParam();
  }
private updateFlags() {
  this.displayGrid = this.displayTaskComponent === this.taskPanelItems[0].text;
 this.displayGrid = this.displayTaskComponent === this.taskPanelItems[0].text;
 this.displayKanban = this.displayTaskComponent === this.taskPanelItems[1].text;
 const idx = this.taskPanelItems.findIndex(i => i.text === this.displayTaskComponent);
 this.selectedIndex = idx >= 0 ? idx : 0;
}





  onExportingToXLSX() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Tasks');

    exportToXLSX({
      component: this.grid.instance,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Tasks.xlsx');
      });
    });
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataSource) {
      this.cotations = changes.dataSource.currentValue.filter((item) => !!item.status && !!item.priority);
    }
  };

  toogleUseNavigation = () => {
    this.useNavigation = !this.useNavigation;
  };

  tabsItemClick = (e: DxTabsTypes.ItemClickEvent) => {
    this.tabValueChanged.emit(e);
  };

  navigateToDetails = (e: DxDataGridTypes.RowClickEvent) => {
    if(this.useNavigation && e.rowType !== 'detailAdaptive') {
      this.router.navigate(['/planning-task-details'], {
        queryParams: { id: e.data.id }
      });
    }
  };
  ngOnInit(): void {
    this.loadCotations();
    this.loadFrameworkSalaire();
    this.loadTradeTypeOperation();
    this.loadTradeSens();
    this.loadNatureCotation();
    this.loadIncoterms();
    this.loadPort();
    this.loadPays();
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
}






@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxToolbarModule,

    StatusIndicatorModule,

    HttpClientModule,
    CommonModule,
    DxTabsModule,
    
    DxLoadPanelModule,
    FormPopupModule,

    TaskFormModule,
    TaskListKanbanModule,
    TaskListModule,
    TaskListGanttModule,

    CommonModule,
    
  ],
  providers: [],
  exports: [CotationListComponent],
  declarations: [CotationListComponent],
})
export class CotationListModule { }
