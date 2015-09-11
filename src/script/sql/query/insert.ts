import {ASTNode} from '../index';
import {Query} from './index';
import {SelectQuery} from './select';
import {NamedColumnRef, TableRef} from '../common/ref';
import {ScalarExpr} from '../common/scalar';
import {Literal, NullableAtom} from '../common/literal';

export class InsertValues extends ASTNode {}
export class QueryValues extends InsertValues {
	constructor(public query:SelectQuery) {
		super();
	}
	toString() { 
		return this.query.toString() 
	}
}
export class AtomValues extends InsertValues {
	constructor(public atoms:Array<NullableAtom>) {
		super();
	}
	toString() { 
		return `(${this.atoms.map(x => x.toString()).join(',')})`; 
	}
}

export class InsertQuery extends Query {
	static build(table:string, values:Array<any>, columns?:Array<string>) {		
		return new InsertQuery(table, columns.map(c => new NamedColumnRef(c)), new AtomValues(values.map(Literal.build)));
	}
	
	public table:TableRef;
	
	constructor (
		table:TableRef|string,
		public columns:Array<NamedColumnRef>,
		public values:InsertValues
	) {
		super()
		if (typeof table === 'string') {
			this.table = new TableRef(table)
		} else {
			this.table = table;
		}
	}
	
	toString() {
		return `INSERT INTO ${this.table} ${this.columns?`(${this.columns.map(x => x.toString()).join(',')})`:''} VALUES ${this.values}`
	}
}