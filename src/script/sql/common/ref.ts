import {ASTNode} from '../index';
import * as util from '../util';

export class Ref extends ASTNode {}

export class ColumnRef extends Ref {}

export class NamedColumnRef extends ColumnRef {
	constructor(
		public name:string, 
		public table:string = null, 
		public tablespace:string = null 
	) {
		super();		
		if (name.indexOf('.') > 0) {
			let parts = name.split('.');
			switch (parts.length) {
				case 2: [this.table, this.name] = parts
				case 3: [this.tablespace, this.table, this.name] = parts
			}	
		}
	}
	
	toString() {
		return util.join([this.tablespace, this.table, this.name].filter(x => !!x), '"."', '"', '"');
	}
}

export class NumberColumnRef extends ColumnRef {
	constructor(
		public position:number
	) {
		super();		
	}
	toString() {
		return this.position.toString();
	}
}


export class ParameterRef extends Ref {
	constructor(public name:string, public indicator:string = null) {
		super();
	}
	toString() {
		return `:${this.name} ${this.indicator ? `AS ${this.indicator}` : '' }`;
	}
}

export class TableRef extends Ref {
	constructor(
		public name:string, 
		public tablespace:string = ""
	) {
		super();
		if (name.indexOf('.') > 0) {
			let parts = name.split('.');
			[this.tablespace, this.name] = parts
		}		
	}
	
	toString() {
		return util.join([this.tablespace, this.name].filter(x => !!x), '"."', '"', '"');
	}
}