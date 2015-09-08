import {ASTNode} from '../index';
import {Query} from './index';
import {SearchCondition} from './search-condition';
import {Ref, ColumnRef, TableRef, ParameterRef} from '../common/ref';
import {ScalarExpr} from '../common/scalar';

export class Selection extends ASTNode {}
export class AllSelection extends QuerySelection {}
export class ScalarSelection extends QuerySelection {
	columns:Array<ScalarExpr>;
}

export class FromTableRef extends Ref {
	
}

export enum JoinType  {
	LEFT, RIGHT, INNER, FULL
}

export class JoinRef extends Ref {
	type:JoinType;
	table:FromTableRef;
	on:SearchCondition;
}

export class NamedFromTableRef extends FromTableRef {
	table:TableRef;
}

export class QueryFromTableRef extends FromTableRef {
	query:SelectQuery;
}

export class FromClause extends ASTNode {
	
}


export enum BinaryQueryOperator {
	UNION, INTERSECT, EXCEPT
}

class SelectQuery extends Query {}

export class SingleSelectQuery extends SelectQuery {
	distinct:boolean;
	selection:QuerySelection;
	from:Array<FromTableRef>;
	joins:Array<JoinRef>;
	
	where:SearchCondition;
	groupBy:Array<ColumnRef>;
	having:SearchCondition;	
}

export class BinarySelectQuery extends SelectQuery {
	left:SelectQuery;
	right:SelectQuery;
	operator:BinaryQueryOperator;
}

export class SortableSelectQuery extends SingleSelectQuery {
	orderBy:Array<OrderBy>;
}

export class SelectWritableQuery extends SortableSelectQuery {
	into:Array<ParameterRef>;
}