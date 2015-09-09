import {ASTNode, ManipulativeStatement} from '../index';
import {TableRef} from '../common/ref';
import {Null} from '../common/literal';
import {ScalarExpr} from '../common/scalar';
import {JoinRef} from './select';
import {SearchCondition} from './search-condition';

export type NullableScalar = ScalarExpr|Null;

export class Assignment extends ASTNode {
	constructor(
		public column:string,
		public value:NullableScalar
	) {
		super();
	}
}

export class UpdateQuery extends ManipulativeStatement {
	constructor(
		public table:TableRef,
		public joins:Array<JoinRef>,
		public assignments:Array<Assignment>,
		public where:SearchCondition
	) {
		super();
	}
}
