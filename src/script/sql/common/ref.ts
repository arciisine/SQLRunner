import {ASTNode} from '../index';

export class Ref extends ASTNode {}

export class ColumnRef extends Ref {}

export class NamedColumnRef extends ColumnRef {
	constructor(
		public name:string, 
		public table:string = null, 
		public tablespace:string = null 
	) {
		super();		
	}
}

export class NumberColumnRef extends ColumnRef {
	constructor(
		position:number
	) {
		super();		
	}
}


export class ParameterRef extends Ref {
	constructor(public name:string, public indicator:string = null) {
		super();
	}
}

export class TableRef extends Ref {
	constructor(
		public name:string, 
		public tablespace:string = ""
	) {
		super();		
	}
}