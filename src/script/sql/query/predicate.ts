import {StringLiteral,Literal} from '../common/literal';
import {ScalarExpr, ComparisonExprOperator} from '../common/scalar';
import {ColumnRef} from '../common/ref';

import {SearchCondition} from './search-condition'
import {SelectQuery} from './select';

enum QueryComparisonOperator {
	ANY, ALL, SOME
}

export class Predicate extends SearchCondition {}

export class ComparisonPredicate extends Predicate {
	left:ScalarExpr;
	right:ScalarExpr;
	comparison:ComparisonExprOperator;
}

export class BetweenPredicate extends Predicate {
	source:ScalarExpr;
	lower:ScalarExpr;
	upper:ScalarExpr;
	inverse:boolean;
}

export class LikePredicate extends Predicate {
	left:ScalarExpr;
	inverse:boolean;
	right:StringLiteral;
	escape:StringLiteral;
}

export class NullCheckPredicate extends Predicate {
	column:ColumnRef;
	inverse:boolean;
}

export class InQueryPredicate extends Predicate {
	left:ScalarExpr;
	right:SelectQuery;
	inverse:boolean;
}

export class InArrayPredicate extends Predicate {
	left:ScalarExpr;
	right:Array<Literal>;
	inverse:boolean;
}

export class QueryComparisonPredicate extends Predicate {
	left:ScalarExpr;
	comparison:ComparisonExprOperator;
	mode:QueryComparisonOperator;
	right:SelectQuery;
}

export class ExistenceCheckPredicate extends Predicate {
	query:SelectQuery;
}