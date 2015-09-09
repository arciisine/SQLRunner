import {ASTNode} from '../index';
import {Query} from './index';
import {OrderBy} from './orderby';
import {SearchCondition} from './search-condition';
import {Ref, ColumnRef, TableRef} from '../common/ref';
import {ScalarExpr} from '../common/scalar';

export class QueryScalarExpr extends ASTNode {
	constructor(
		public expr:ScalarExpr, 
		public alias:string = null
	) {
		super()
	}
}

export class QuerySelection extends ASTNode {}
export class AllSelection extends QuerySelection {}
export class ScalarSelection extends QuerySelection {
	constructor(public columns:Array<QueryScalarExpr>) {
		super()
	}
}

export class FromTableRef extends Ref {
	constructor(public alias:string = null) {
		super()
	}
}

export const enum JoinType  {
	LEFT, RIGHT, INNER, FULL
}

export class JoinRef extends Ref {
	constructor(
		public type:JoinType,
		public table:FromTableRef,
		public on:SearchCondition
	) {
		super();
	}
}

export class NamedFromTableRef extends FromTableRef {
	constructor(
		public table:TableRef,
		alias:string = null	
	) {
		super(alias)
	}
}

export class QueryFromTableRef extends FromTableRef {
	constructor(
		public query:SelectQuery,
		alias:string = null
	) {
		super(alias)
	}
}

export const enum BinaryQueryOperator {
	UNION, INTERSECTION, EXCEPT
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
}

export class BinarySelectQuery extends SelectQuery {
	constructor(
		public left:SelectQuery,
		public operator:BinaryQueryOperator,
		public right:SelectQuery
	) {
		super()
	}
}

export class SortableSelectQuery extends Query {
	constructor(
		public query:SelectQuery,
		public orderBy:Array<OrderBy>
	) {
		super()
	}
}

export class WritableSelectQuery extends Query {
	constructor(
		public query:SelectQuery,
		public into:TableRef,
		public orderBy:Array<OrderBy>
	) {
		super()
	}
}