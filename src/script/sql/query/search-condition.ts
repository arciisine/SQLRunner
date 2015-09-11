import {ASTNode} from '../index';

export class SearchCondition extends ASTNode {}

export enum SearchConditionOperator {
	AND = <any>"AND", 
	OR = <any>"OR"
}

export class BinarySearchCondition extends SearchCondition {
	constructor(
		public left:SearchCondition,
		public op:SearchConditionOperator,
		public right:SearchCondition
	) {
		super()
	}
	toString() {
		return `(${this.left} ${this.op} ${this.right})`
	}
}

export class NotSearchCondition extends SearchCondition {
	constructor(
		public 	condition:SearchCondition
	) {
		super()
	}
	toString() {
		return `(NOT ${this.condition})`
	}
}