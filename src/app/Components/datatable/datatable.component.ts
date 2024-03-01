import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit, OnChanges {

  sortCls = "fa fa-angle-double-down";
  header: any;
  @Input() tableData: any;
  @Input() columns: any;

  @Input() userSelections: any;
  @Input() selectedQuestions: any;
  @Input() tblbtns: any[];
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();
  @Output() onCalculateTestResults = new EventEmitter<any>();

  filteredData: any;

  reverse: boolean = false;
  searchText: string = '';
  currentPage = 1;
  pageSize = 10;
  testPagedSearchResult: any[] = [];

  scrollCallback;

  constructor() {
    this.scrollCallback = this.lazyLoading.bind(this);
  }

  ngOnInit() {
     this.header = this.columns.filter((k) => k.name !== '_id');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableData) {
      this.tableData = changes.tableData.currentValue;
    }

    this.filteredData = this.tableData;
    if (this.filteredData && this.filteredData.length > 0) {
      this.header = this.columns.filter((k) => k.name !== '_id');
      this.header = this.header.map((key) => {
        return { label: key.label, name: key.name, sort: false };
      });
    }
    this.currentPage = 1;
    this.testPagedSearchResult = [];
    this.getPagedData(this.currentPage++);
  }

  lazyLoading() {
    return this.getPagedData(this.currentPage++);
  }

  search(key, event) {
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      this.filteredData = this.tableData;
    } else {
      this.filteredData = this.tableData.filter((row) => {
        if (row[key] && row[key].toString().toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return row;
        }

      });
    }
    this.currentPage = 1;
    this.testPagedSearchResult = [];
    this.getPagedData(this.currentPage++);
  }

  toggleSort(key) {
    this.header = this.header.map((col) => {
      (col.name === key) ? col.sort = true : col.sort = false;
      return col;
    });
    this.reverse = !this.reverse;
    if (this.reverse) {
      this.tableData.sort((a, b) => (a[key].toLowerCase() > b[key].toLowerCase()) ? 1 : ((b[key].toLowerCase() > a[key].toLowerCase()) ? -1 : 0));
    } else {
      this.tableData.sort((a, b) => (b[key].toLowerCase() > a[key].toLowerCase()) ? 1 : ((a[key].toLowerCase() > b[key].toLowerCase()) ? -1 : 0));
    }
    this.filteredData = this.tableData;
    this.currentPage = 1;
    this.testPagedSearchResult = [];
    this.getPagedData(this.currentPage++);
  }

  getPagedData(pageNo) {
    const testRecords: any[] = [];
    if (this.filteredData && this.filteredData.length > 0) {
      const totalRecords = this.filteredData.length - 1;

      let startRecord = 0;

      let endRecord = (pageNo * this.pageSize) - 1;
      if (totalRecords < this.pageSize) {
        endRecord = totalRecords;
      }
      startRecord = (pageNo - 1) * this.pageSize;
      if (endRecord > totalRecords) {
        endRecord = totalRecords;
      }
      for (let i = startRecord; i <= endRecord; i++) {
        testRecords.push(this.filteredData[i]);
      }

      this.testPagedSearchResult = [...this.testPagedSearchResult, ...testRecords];
    } else {
      this.currentPage = 1;
    }
    return this.testPagedSearchResult;
  }

  edit(obj) {
    this.onEdit.emit(obj);
  }

  delete(obj) {
    this.onDelete.emit(obj);
  }

  calculateTestResults(obj) {
    this.onCalculateTestResults.emit(obj);
  }

  selecteUser(option, event, index) {
    let obj = [{ "option": option, "event": event, "index": index }];
    this.onSelect.emit(obj);
  }
}
