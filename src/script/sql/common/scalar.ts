import {Atom} from '../common/literal';
import {ColumnRef} from '../common/ref';
import {SelectQuery} from '../query/select';

export enum BinaryExprOperator {
	PLUS, MINUS, ASTERISK, DIVIDE;
}

export enum UnaryExprOperator {
	PLUS, MINUS;
}

export enum ComparisonExprOperator {
	EQUAL, NOT_EQUAL, 
	LESS_THAN, GREATER_THAN,
	LESS_THAN_EQUAL, GREATER_THAN_EQUAL 
}

export class ScalarExpr extends ASTNode {}

export class AtomExpr extends ScalarExpr {
	value:Atom;
}

export class BinaryExpr extends ScalarExpr {
	left:ScalarExpr;
	right:ScalarExpr;
	op:BinaryExprOperator;
}

export class ColumnRefExpr extends ScalarExpr {
	column:ColumnRef
}

export class FunctionRefExpr extends ScalarExpr {
	name:string;
}

export class QueryExpr extends ScalarExpr {
	query:SelectQuery;
}

export class FunctionRefWithScalarExpr extends FunctionRefExpr {
	expr:ScalarExpr;
}

export class FunctionRefByColumnExpr extends FunctionRefExpr {}

export class FunctionRefWithAllColumnExpr extends FunctionRefExpr {}

export class FunctionRefWithDistinctColumnExpr extends FunctionRefExpr {
	column:ColumnRef;
}

export class UnaryExpr extends ScalarExpr {
	source:ScalarExpr;
	op:UnaryExprOperator;
}
