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
import {Statement} from 'sql/index'
import {Queries} from './queries';

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
  results:sql.Result = { values : [], columns: []}
  history:Array<Statement> = []
  canned:Array<any[]> = []

  constructor() {
    this.database = new Database()
    ZippedCSVDataSource.load('assets/data.zip').then(sql => {
      this.database.parse(sql)
        .forEach(stmt => {
          this.history.unshift(stmt)
          this.database.execStatement(stmt)
        })
              
      for (let key in Queries) {
        try {
          this.canned.push([key, this.database.parse(Queries[key])]);
        } catch (e) {
          console.log(e)
        }
      }
      
      this.database.tableNames.forEach( name => {
        this.canned.push([`Select * from ${name}`, this.database.parse(`SELECT * FROM "${name}"`)]) 
      })      
    })
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
      if (!query) {
        if (this.queryText) {
          query = this.queryText  
        } else if (this.select) {
          query = this.select  
        }
      }
      
      if (typeof query === 'string') {
        this.select = this.database.parse(query as string)[0] as select.SelectQuery
      } else if (query instanceof Query) {
        this.select = query
      }

      this.queryText = this.select.toString()      
      
      if (this.queryText != this.history[0].toString()) {
        this.history.unshift(this.database.parse(this.queryText)[0])
      }

      this.results = this.database.execStatement(this.select);
      if (this.results && Object.keys(this.results).length) {
        this.results = this.results[0]
      }

      console.log(this.results);
    } catch (e) {
      this.error = e.message.replace(/^\s+/g, '')
    }
  }
}
