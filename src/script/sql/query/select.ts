import {Query} from './index';
import {SearchCondition} from './search-condition';
import {ColumnRef, TableRef, ParameterRef} from '../common/ref';
import {ScalarExpr} from '../common/scalar';

export class Selection extends ASTNode {}
export class AllSelection extends QuerySelection {}

export class ScalarSelection extends QuerySelection {
	columns:Array<ScalarExpr>;
}

export class SelectQuery extends Query {
	distinct:boolean;
	selection:QuerySelection;
	from:Array<TableRef>;
	where:SearchCondition;
	groupBy:Array<ColumnRef>;
	having:SearchCondition;
}

export class SortableSelectQuery extends SelectQuery {
	orderBy:Array<OrderBy>;
}

export class SelectWritableQuery extends SortableSelectQuery {
	into:Array<ParameterRef>;
}