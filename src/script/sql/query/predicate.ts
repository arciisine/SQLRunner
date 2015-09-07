import {ColumnRef,SearchCondition,Predicate} from '../common/base';
import {Literal, StringLiteral} from '../common/literal';
import {ScalarExpr, ComparisonExprOperator} from '../common/scalar';
import {SelectQuery} from './index';

enum QueryComparisonOperator {
	ANY, ALL, SOME
}

export class ComparisonPredicate extends Predicate {
	left:ScalarExpr;
	right:ScalarExpr;
	comparison:ComparisonExprOperator;
}

export class QueryComparisonPredicate extends Predicate {
	left:ScalarExpr;
	right:SelectQuery;
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