import {ASTNode} from '../index';

export class SearchCondition extends ASTNode {}

enum SearchConditionOperator {
	AND, OR
}

export class BinarySearchCondition extends SearchCondition {
	left:SearchCondition;
	right:SearchCondition;
	op:SearchConditionOperator;
}

export class NotSearchCondition extends SearchCondition {
	condition:SearchCondition;
}