/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="custom-typings/sqljs.d.ts" />
import {DomainNode} from 'app/database/domain-node'
import {Database} from 'app/database/database';
import {Component, View,bootstrap, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';
import {DatabaseResults} from 'app/component/results';
import {Query} from 'sql/query/index'
import * as select from 'sql/query/select'
import * as order from 'sql/query/orderby'
import * as ref from 'sql/common/ref'


export function start() {
	bootstrap(AppComponent);
}


@Component({
  selector: 'db-app'
})
@View({
  templateUrl: 'script/app.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES].concat([DatabaseResults])
})
export class AppComponent {
  select:select.SortableSelectQuery
  database:Database;
  domain:DomainNode
  error:string
  results:sql.Result = { values : [], columns: []}
  domains:Array<DomainNode>
 
  constructor() {
    this.database = new Database()
    this.database.loadZip('assets/data.zip').then(() => {
      this.domains = this.database.resolvedOrder.slice().sort((a,b) => {
        return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)
      });
    })
  }
 
  buildDomainQuery() {
    return new select.SortableSelectQuery(
      new select.SingleSelectQuery(
        new select.AllSelection(), 
        [new select.NamedFromTableRef(new ref.TableRef(this.domain.name))]
      ),
      [new order.OrderBy(this.domain.columnNames[0], true)]
    );
  }
  
  updateQuery(sql:string) {
    try {
      let query = this.database.sqlParser.parse(sql)[0]
      if (query instanceof select.SelectQuery || query instanceof select.SortableSelectQuery) {
        this.select = query
      }
    } catch (e) {
      this.error = e.message.replace(/^\s+/g, '')
    } 
  }
 
  setDomain(domain:DomainNode) {
    this.domain = domain
    this.select = this.buildDomainQuery()
    this.runQuery()
  }
  
  sortColumn(event) {
    if (!(this.select instanceof select.SortableSelectQuery) {
      this.select = new select.SortableSelectQuery(this.select, [])
    }
    
    let orderBy = this.select.orderBy && this.select.orderBy[0]
    
    if (!orderBy || orderBy.column.toString() !== event.column) {
      this.select.orderBy = [new order.OrderBy(event.column, true)]
    } else if (event.column === orderBy.column.toString()) {
      orderBy.dir = orderBy.dir === order.OrderByDirection.ASC ? order.OrderByDirection.DESC : order.OrderByDirection.ASC;
    }
        
    this.runQuery();
  }

  
  runQuery(query?:string|Query) {
    try {
      if (query && typeof query === 'string') {
        this.results = this.database.execStatement(this.database.sqlParser.parse(query))[0];
      } else  {
        if (!query) {
          query = this.select
        }
        
        this.results = this.database.execStatement(query);
        if (this.results && Object.keys(this.results).length) {
          this.results = this.results[0]    
        }
      }
      console.log(this.results);      
    } catch (e) {
      this.error = e.message.replace(/^\s+/g, '')
    }    
  }
}