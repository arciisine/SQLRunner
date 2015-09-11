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
		if (name.indexOf('.') > 0) {
			let parts = name.split('.');
			switch (parts.length) {
				case 2: [table, name] = parts
				case 3: [tablespace, table, name] = parts
			}	
		}
	}
	
	toString() {
		return [this.tablespace, this.table, this.name].filter(x => !!x).join('.');
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
	static build(ref:string) {
		let parts = ref.split('.');
		switch (parts.length) {
			case 1: return new TableRef(parts[0]);
			case 2: return new TableRef(parts[1], parts[0]);
		}
		return null
	}
	constructor(
		public name:string, 
		public tablespace:string = ""
	) {
		super();
		if (name.indexOf('.') > 0) {
			let parts = name.split('.');
			[tablespace, name] = parts
		}		
	}
	
	toString() {
		return [this.tablespace, this.name].filter(x => !!x).join('.');
	}
}