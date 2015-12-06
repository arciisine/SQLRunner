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

export abstract class SelectionExpr extends ASTNode {}

export class ScalarSelectionExpr extends SelectionExpr {
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

export class TableAllSelectionExpr extends ScalarSelectionExpr {
	constructor(
		public name:string
	) {
		super(null, null);
	}
	toString() {
		return `"${this.name}".*`;
	}
}

export class QuerySelection extends ASTNode {
	constructor(public distinct:boolean = false) {
		super();
	}
	toString() {
		return this.distinct ? 'DISTINCT ' : ''
	}
}

export class AllSelection extends QuerySelection {
	constructor(distinct:boolean = false) {
		super(distinct);
	}
	toString() {
		return super.toString() + '*';
	}
}
export class ScalarSelection extends QuerySelection {
	constructor(public columns:Array<ScalarSelectionExpr>, distinct:boolean = false) {
		super(distinct)
	}
	toString() {
		return  super.toString() + util.join(this.columns, ',');
	}
}

export class SingleScalarSelection extends QuerySelection {
	constructor(public column:ScalarSelectionExpr, distinct:boolean = false) {
		super(distinct)
	}
	toString() {
		return  super.toString() + this.column.toString();
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
		return `(\n\t${this.query.toString().replace(/\n/m, '\n\t')}\n)${super.toString()}`;
	}
}

export abstract class SelectQuery extends Query {}

export class SingleSelectQuery extends SelectQuery {
	constructor(
		public selection:QuerySelection,
		public from:Array<FromTableRef>,
		public joins:Array<JoinRef>  = null,

		public where:SearchCondition  = null,
		public groupBy:Array<ColumnRef>  = null,
		public having:SearchCondition = null
	) {
		super()
	}
	toString(postSelection:string ='') {
		return util.join([
			`SELECT ${this.selection}`,
			postSelection || null,
			`FROM ${util.join(this.from, ',')}`,
			util.join(this.joins, '\n') || null,
			this.where ? `WHERE ${this.where}` : null,
			this.groupBy ? `GROUP BY ${util.join(this.groupBy, ',')}` : null,
			this.having ? `HAVING ${this.having}` : null
		], '\n')
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
		return `${this.left}\n\n${this.operator}\n\n${this.right}`;
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
		return `${this.query}${util.join(this.orderBy, ',', '\nORDER BY ')}`;
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
