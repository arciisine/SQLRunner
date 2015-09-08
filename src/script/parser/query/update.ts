import {ASTNode, ManipulativeStatement} from '../index';
import {TableRef} from '../common/ref';
import {NullableAtom} from '../common/literal';
import {JoinRef} from './select';
import {SearchCondition} from './search-condition';

export class Assignment extends ASTNode {
	column:string;
	value:NullableAtom;
}

export class UpdateQuery extends ManipulativeStatement {
	table:TableRef;
	joins:Array<JoinRef>;
	assignments:Array<Assignment>;
	where:SearchCondition;
}
