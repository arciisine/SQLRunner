/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="custom-typings/sqljs.d.ts" />
import {DomainNode} from 'app/database/domain-node'
import {Database} from 'app/database/database';
import {ZippedCSVDataSource} from 'app/database/zipped-csv-datasource';
import {Component, Injectable, View,bootstrap, FormBuilder, Control, ControlGroup, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';
import {DatabaseResults} from 'app/component/results';
import {Query} from 'sql/query/index'
import * as select from 'sql/query/select'
import * as order from 'sql/query/orderby'
import * as ref from 'sql/common/ref'

export function start() {
	bootstrap(AppComponent);
}

@Component({
  selector: 'db-app',
  properties : [ 'table' ]
})
@View({
  templateUrl: 'script/app.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES].concat([DatabaseResults])
})
export class AppComponent {
  select:select.SelectQuery
  queryText:string
  database:Database
  error:string
	table:string
  results:sql.Result = { values : [], columns: []}

  constructor() {
    this.database = new Database()
    ZippedCSVDataSource.load('assets/data.zip').then(sql => {
      this.database.parse(sql)
        .forEach(stmt => {
          this.database.execStatement(stmt)
        })
    })
  }

  buildTableQuery() {
    return new select.SortableSelectQuery(
      new select.SingleSelectQuery(
        new select.AllSelection(),
        [new select.NamedFromTableRef(this.database.tables[this.table].name)]
      ),
      [new order.OrderBy(this.database.tables[this.table].columns[0].name, true)]
    );
  }

  updateQuery() {
    try {
      let query = this.database.parse(this.queryText)[0]
      if (query instanceof select.SelectQuery || query instanceof select.SortableSelectQuery) {
        this.select = query
      }
    } catch (e) {
      console.log(this.select.toString());
      this.error = e.message.replace(/^\s+/g, '')
    }
  }

  rebuildSelection() {
    this.select = this.buildTableQuery()
    this.runQuery(this.select)
  }

  sortColumn(event) {
    if (!(this.select instanceof select.SortableSelectQuery)) {
      this.select = new select.SortableSelectQuery(this.select, [])
    }

    if (this.select instanceof select.SortableSelectQuery) {
      let sortableQuery = this.select as select.SortableSelectQuery

      let orderBy = sortableQuery.orderBy && sortableQuery.orderBy[0]

      if (!orderBy || orderBy.column.toString() !== event.column) {
        sortableQuery.orderBy = [new order.OrderBy(event.column, true)]
      } else if (event.column === orderBy.column.toString()) {
        orderBy.dir = orderBy.dir === order.OrderByDirection.ASC ? order.OrderByDirection.DESC : order.OrderByDirection.ASC;
      }
      this.runQuery(this.select);
    }
  }


  runQuery(query?:string|Query) {
    try {
      if (!query && this.queryText) {
        query = this.queryText
      } else if (!this.queryText && !query) {
        query = this.select
      }
      
      if (typeof query === 'string') {
        query = this.database.parse(query as string)[0] as select.SelectQuery
      }
      
      console.log(query)
      
      this.queryText = query.toString()
      this.select = query

      this.results = this.database.execStatement(query);
      if (this.results && Object.keys(this.results).length) {
        this.results = this.results[0]
      }

      console.log(this.results);
      this.error = 'Valid Query!'
    } catch (e) {
      this.error = e.message.replace(/^\s+/g, '')
    }
  }
}
