import {ASTNode} from '../index';
import {Atom} from '../common/literal';
import {NamedColumnRef, ColumnRef} from '../common/ref';
import {SelectQuery, AllSelection, SingleScalarSelection} from '../query/select';

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

export abstract class ScalarExpr extends ASTNode {}

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


export class FunctionInvocation extends ASTNode {
	constructor(public name:string, public selection:AllSelection|SingleScalarSelection) {
		super();
	}
	toString() {
		return `${this.name}(${this.selection})`;
	}
}


export class FunctionExpr extends ScalarExpr {
	constructor(public invocation:FunctionInvocation) {
		super();		
	}
	toString() {
		return this.invocation.toString();
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

export class UnaryExpr extends ScalarExpr {
	constructor(public source:ScalarExpr, public op:UnaryExprOperator) {
		super();
	}
	toString() {
		return `${this.op}${this.source}`;
	}
}