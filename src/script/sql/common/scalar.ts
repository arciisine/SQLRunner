import {ASTNode} from '../index';
import {Atom} from '../common/literal';
import {NamedColumnRef} from '../common/ref';
import {SelectQuery} from '../query/select';

export enum BinaryExprOperator {
	PLUS = <any>"+", 
	MINUS = <any>"-", 
	MULTIPLY = <any>"*", 
	DIVIDE = <any>"/"
}

export enum UnaryExprOperator {
	PLUS = <any>"", 
	MINUS = <any>"-"
}

export enum ComparisonExprOperator {
	EQUAL = <any>"=", 
	NOT_EQUAL = <any>"<>", 
	LESS_THAN = <any>"<", 
	GREATER_THAN = <any>">",
	LESS_THAN_EQUAL = <any>"<=", 
	GREATER_THAN_EQUAL = <any>">=" 
}

export class ScalarExpr extends ASTNode {}

export class AtomExpr extends ScalarExpr {
	constructor(public value:Atom) {
		super();
	}
	
	toString() {
		return this.value.toString();
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
	
	toString() {
		return `(${this.left} ${this.op} ${this.right})`
	}
}

export class NamedColumnRefExpr extends ScalarExpr {
	constructor(public column:NamedColumnRef) {
		super();
	}
	toString() {
		return this.column.toString();
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
	toString() {
		return this.query.toString();
	}
}

export class FunctionRefWithScalarExpr extends FunctionRefExpr {
	constructor(name:string, public expr:ScalarExpr, all:boolean = false) {
		super(name);
	}
	toString() {
		return `${this.name}(${this.expr})`;
	}
}

export class FunctionRefByColumnExpr extends FunctionRefExpr {}

export class FunctionRefWithAllColumnExpr extends FunctionRefExpr {
	toString() {
		return `${this.name}(*)`;
	}
}

export class FunctionRefWithDistinctColumnExpr extends FunctionRefExpr {
	constructor(name:string, public column:NamedColumnRefExpr) {
		super(name);
	}
	toString() {
		return `${this.name}(${this.column})`;
	}
}

export class UnaryExpr extends ScalarExpr {
	constructor(public source:ScalarExpr, public op:UnaryExprOperator) {
		super();
	}
	toString() {
		return `${this.op}${this.source}`;
	}
}
