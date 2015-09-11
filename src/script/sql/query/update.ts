import {ASTNode, ManipulativeStatement} from '../index';
import {TableRef} from '../common/ref';
import {Null} from '../common/literal';
import {ScalarExpr} from '../common/scalar';
import {JoinRef} from './select';
import {SearchCondition} from './search-condition';
import * as util from '../util';

export type NullableScalar = ScalarExpr|Null;

export class Assignment extends ASTNode {
	constructor(
		public column:string,
		public value:NullableScalar
	) {
		super();
	}
	toString() {
		return `${this.column} = ${this.value}`
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
	toString() {
		return `UPDATE ${this.table} ${util.join(this.joins, '')} SET ${util.join(this.assignments, ',')} ${this.where}`;
	}
}
