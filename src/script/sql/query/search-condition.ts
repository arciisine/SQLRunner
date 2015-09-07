import {SearchCondition, Predicate} from '../common/base';

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