import {ASTNode} from '../index';
import {Query} from './index';
import {OrderBy} from './orderby';
import {SearchCondition} from './search-condition';
import {Ref, ColumnRef, TableRef} from '../common/ref';
import {ScalarExpr} from '../common/scalar';
import * as util from '../util';

export enum JoinType  {
	LEFT = <any>"LEFT", 
	RIGHT = <any>"RIGHT", 
	INNER = <any>"INNER", 
	FULL = <any>"FULL"
}
export enum BinaryQueryOperator {
	UNION = <any>"UNION", 
	INTERSECTION = <any>"INTERSECTION", 
	EXCEPT = <any>"EXCEPT"
}

export class QueryScalarExpr extends ASTNode {
	constructor(
		public expr:ScalarExpr, 
		public alias:string = null
	) {
		super()
	}
	toString() {
		return `${this.expr}${this.alias ? ' AS ' + this.alias : ''}`;
	}
}

export class QuerySelection extends ASTNode {}
export class AllSelection extends QuerySelection {
	toString() {
		return '*';
	}
}
export class ScalarSelection extends QuerySelection {
	constructor(public columns:Array<QueryScalarExpr>) {
		super()
	}
	toString() {
		return  util.join(this.columns, ',');
	}
}

export class FromTableRef extends Ref {
	constructor(public alias:string = null) {
		super()
	}
	toString() {
		return this.alias ? ` AS ${this.alias}` : '';
	}
}

export class JoinRef extends Ref {
	constructor(
		public type:JoinType,
		public table:FromTableRef,
		public on:SearchCondition
	) {
		super();
	}
	toString() {
		return `${this.type} JOIN ${this.table} ${this.on ? `ON ${this.on}` : ''}`;
	}
}

export class NamedFromTableRef extends FromTableRef {
	constructor(
		public table:TableRef,
		alias:string = null	
	) {
		super(alias)
	}
	toString() {
		return `${this.table}${super.toString()}`;
	}
}

export class QueryFromTableRef extends FromTableRef {
	constructor(
		public query:SelectQuery,
		alias:string = null
	) {
		super(alias)
	}
	toString() {
		return `(${this.query})${super.toString()}`;
	}
}

export class SelectQuery extends Query {}

export class SingleSelectQuery extends SelectQuery {
	constructor(
		public selection:QuerySelection,
		public from:Array<FromTableRef>,
		public joins:Array<JoinRef>,
		
		public where:SearchCondition,
		public groupBy:Array<ColumnRef>,
		public having:SearchCondition,
		public distinct:boolean = false
	) {
		super()
	}
	toString(postSelection:string ='') {
		`SELECT ${this.distinct ? ' DISTINCT' : ''}${this.selection} ${postSelection || ''} 
		FROM ${util.join(this.from, ',')} 
		${util.join(this.joins, '\n')}
		${this.where ? `WHERE ${this.where}` : ''}
		${this.groupBy ? `GROUP BY ${util.join(this.groupBy, ',')}` : ''}
		${this.having ? `HAVING ${this.having}` : ''}`		
	}
}

export class BinarySelectQuery extends SelectQuery {
	constructor(
		public left:SelectQuery,
		public operator:BinaryQueryOperator,
		public right:SelectQuery
	) {
		super()
	}
	toString() {
		return `${this.left} ${this.operator} ${this.right}`;
	}
}

export class SortableSelectQuery extends Query {
	constructor(
		public query:SelectQuery,
		public orderBy:Array<OrderBy>
	) {
		super()
	}
	toString() {
		return `${this.query}${util.join(this.orderBy, ',', ' ORDER BY ')}`;
	}

}

export class WritableSelectQuery extends Query {
	constructor(
		public query:SingleSelectQuery,
		public into:TableRef,
		public orderBy:Array<OrderBy>
	) {
		super()
	}
	toString() {
		return this.query.toString(this.into ? `INTO ${this.into}` : '') + util.join(this.orderBy, ',', ' ORDER BY ');
	}
}