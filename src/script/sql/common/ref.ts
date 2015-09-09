import {ASTNode} from '../index';

export class Ref extends ASTNode {}

export class ColumnRef extends Ref {
	constructor(
		public name:string, 
		public table:string = null, 
		public tablespace:string = null, 
		public alias:string = null
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
		public tablespace:string = "", 
		public alias:string = ""
	) {
		super();		
	}
}