import {ASTNode} from '../index';
import {Query} from './index';
import {SelectQuery} from './select';
import {ColumnRef, TableRef} from '../common/ref';
import {ScalarExpr} from '../common/scalar';
import {NullableAtom} from '../common/literal';

export class InsertValues extends ASTNode {}
export class QueryValues extends InsertValues {
	query:SelectQuery;
}
export class AtomValues extends InsertValues {
	atoms:Array<NullableAtom>;
}

export class InsertQuery extends Query {
	table:TableRef;
	columns:Array<ColumnRef>;
	values:InsertValues;
}