import {ASTNode} from '../index';
import {TableRef} from '../common/ref';
import {NullableAtom} from '../common/literal';
import {SearchCondition} from '../search-condition';

export class Assignment extends ASTNode {
	column:string;
	value:NullableAtom;
}

export class UpdateQuery extends ManipulativeStatement {
	table:TableRef;
	assignments:Array<Assignment>;
	where:SearchCondition;
}
