import {ASTNode} from '../index';

export class SearchCondition extends ASTNode {}

export enum SearchConditionOperator {
	AND, OR
}

export class BinarySearchCondition extends SearchCondition {
	constructor(
		public left:SearchCondition,
		public op:SearchConditionOperator,
		public right:SearchCondition
	) {
		super()
	}
}

export class NotSearchCondition extends SearchCondition {
	constructor(
		public 	condition:SearchCondition
	) {
		super()
	}
}