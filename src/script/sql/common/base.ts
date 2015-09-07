class ASTNode {}
export class Statement extends ASTNode {}
export class Null extends ASTNode {}
export class Atom extends ASTNode {}
export class Constraint extends ASTNode {}
export class SearchCondition extends ASTNode {}
export class Predicate extends SearchCondition {}
export class Query extends Statement {}
export class Ref extends ASTNode {}
export class ScalarExpr extends ASTNode {}
export class ColumnType extends ASTNode {
	size:number
}

export class ColumnRef extends Ref {
	name:string;
	table:string;
	tablespace:string;
}

export class ParameterRef extends Ref {
	name:string;
	indicator:string;
}

export class TableRef extends Ref {
	name:string;
	tablespace:string;
}
