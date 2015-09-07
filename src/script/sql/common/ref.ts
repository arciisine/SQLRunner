import {ASTNode} from '../index';

export class Ref extends ASTNode {}

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
