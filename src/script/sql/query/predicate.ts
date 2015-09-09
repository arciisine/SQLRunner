import {StringLiteral,Literal} from '../common/literal';
import {ScalarExpr, ComparisonExprOperator} from '../common/scalar';
import {ColumnRef} from '../common/ref';

import {SearchCondition} from './search-condition'
import {SelectQuery} from './select';

export const enum QueryComparisonOperator {
	ANY, ALL, SOME
}

export class Predicate extends SearchCondition {}

export class ComparisonPredicate extends Predicate {
	constructor(
		public left:ScalarExpr,
		public comparison:ComparisonExprOperator,
		public right:ScalarExpr
	) {
		super()
	}
}

export class BetweenPredicate extends Predicate {
	constructor(
		public source:ScalarExpr,
		public lower:ScalarExpr,
		public upper:ScalarExpr,
		public inverse:boolean = false
	) {
		super()
	}
}

export class LikePredicate extends Predicate {
	constructor(
		public left:ScalarExpr,
		public right:StringLiteral,
		public escape:StringLiteral = null,
		public inverse:boolean = false
	) {
		super()
	}
}

export class NullCheckPredicate extends Predicate {
	constructor(
		public column:ColumnRef,
		public inverse:boolean = false
	) {
		super()
	}
}

export class InQueryPredicate extends Predicate {
	constructor(
		public left:ScalarExpr,
		public right:SelectQuery,
		public inverse:boolean = false
	) {
		super()
	}
}

export class InArrayPredicate extends Predicate {
	constructor(
		public left:ScalarExpr,
		public right:Array<Literal>,
		public inverse:boolean
	) {
		super()
	}
}

export class QueryComparisonPredicate extends Predicate {
	constructor(
		public left:ScalarExpr,
		public comparison:ComparisonExprOperator,
		public mode:QueryComparisonOperator,
		public right:SelectQuery
	) {
		super()
	}
}

export class ExistenceCheckPredicate extends Predicate {
	constructor(
		public query:SelectQuery
	) {
		super()
	}
}