/// <reference path="../../../../typings/angular2/angular2.d.ts" />
/// <reference path="../../custom-typings/sqljs.d.ts" />
import {Component, View, CORE_DIRECTIVES, EventEmitter} from 'angular2/angular2';

@Component({
  selector: 'db-results',
  properties:['results'],
  events: ['orderBy']
})
@View({
  templateUrl: 'script/app/component/results.html',
  directives: [CORE_DIRECTIVES]
})
export class DatabaseResults {
	
 	results:sql.Result = { values : [], columns : []}
	orderBy:EventEmitter = new EventEmitter()
	 
	setOrderBy(column:string) {
		this.orderBy.next({column:column});
	}
	 
}