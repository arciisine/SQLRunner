import {ASTNode} from '../index';
import {Query} from './index';
import {SelectQuery} from './select';
import {NamedColumnRef, TableRef} from '../common/ref';
import {ScalarExpr} from '../common/scalar';
import {NullableAtom} from '../common/literal';

export class InsertValues extends ASTNode {}
export class QueryValues extends InsertValues {
	constructor(public query:SelectQuery) {
		super();
	}
}
export class AtomValues extends InsertValues {
	constructor(public atoms:Array<NullableAtom>) {
		super();
	}
}

export class InsertQuery extends Query {
	constructor (
		public table:TableRef,
		public columns:Array<NamedColumnRef>,
		public values:InsertValues
	) {
		super()
	}
}