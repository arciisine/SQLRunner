import {ASTNode} from '../index';
import {Atom} from '../common/literal';
import {NamedColumnRef} from '../common/ref';
import {SelectQuery} from '../query/select';

export const enum BinaryExprOperator {
	PLUS, MINUS, MULTIPLY, DIVIDE
}

export const enum UnaryExprOperator {
	PLUS, MINUS
}

export const enum ComparisonExprOperator {
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

export class NamedColumnRefExpr extends ScalarExpr {
	constructor(public column:NamedColumnRef) {
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
	constructor(name:string, public column:NamedColumnRefExpr) {
		super(name);
	}
}

export class UnaryExpr extends ScalarExpr {
	constructor(public source:ScalarExpr, public op:UnaryExprOperator) {
		super();
	}
}
