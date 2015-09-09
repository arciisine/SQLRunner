import {ASTNode} from '../index';
import {Atom} from '../common/literal';
import {ColumnRef} from '../common/ref';
import {SelectQuery} from '../query/select';

export enum BinaryExprOperator {
	PLUS, MINUS, MULTIPLY, DIVIDE
}

export enum UnaryExprOperator {
	PLUS, MINUS
}

export enum ComparisonExprOperator {
	EQUAL, NOT_EQUAL, 
	LESS_THAN, GREATER_THAN,
	LESS_THAN_EQUAL, GREATER_THAN_EQUAL 
}

export class ScalarExpr extends ASTNode {}

export class AtomExpr extends ScalarExpr {
	constructor(public value:Atom) {
		super();
	}
}

export class BinaryExpr extends ScalarExpr {
	constructor(
		public left:ScalarExpr,
		public op:BinaryExprOperator,
		public right:ScalarExpr
	) {
		super()
	}
	
}

export class ColumnRefExpr extends ScalarExpr {
	constructor(public column:ColumnRef) {
		super();
	}
}

export class FunctionRefExpr extends ScalarExpr {
	constructor(public name:string) {
		super();		
	}
}

export class QueryExpr extends ScalarExpr {
	constructor(public query:SelectQuery) {
		super()		
	}
}

export class FunctionRefWithScalarExpr extends FunctionRefExpr {
	constructor(name:string, public expr:ScalarExpr, all:boolean = false) {
		super(name);
	}
}

export class FunctionRefByColumnExpr extends FunctionRefExpr {}

export class FunctionRefWithAllColumnExpr extends FunctionRefExpr {}

export class FunctionRefWithDistinctColumnExpr extends FunctionRefExpr {
	constructor(name:string, public column:ColumnRef) {
		super(name);
	}
}

export class UnaryExpr extends ScalarExpr {
	constructor(public source:ScalarExpr, public op:UnaryExprOperator) {
		super();
	}
}
