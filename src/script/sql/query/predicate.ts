import {StringLiteral,Literal} from '../common/literal';
import {ScalarExpr, ComparisonExprOperator} from '../common/scalar';
import {ColumnRef} from '../common/ref';

import {SearchCondition} from './search-condition'
import {SelectQuery} from './select';
import * as util from '../util';

export enum QueryComparisonOperator {
	ANY = <any>"ANY",
	ALL = <any>"ALL", 
	SOME = <any>"SOME"
}

export abstract class Predicate extends SearchCondition {}

export class ComparisonPredicate extends Predicate {
	constructor(
		public left:ScalarExpr,
		public comparison:ComparisonExprOperator,
		public right:ScalarExpr
	) {
		super()
	}
	toString() {
		return `${this.left} ${this.comparison} ${this.right}`;
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
	toString() {
		return `${this.source} ${this.inverse ? 'NOT ':''}BETWEEN ${this.lower} AND ${this.upper}`;
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
	toString() {
		return `${this.left} ${this.inverse ? 'NOT ':''}LIKE ${this.right}${this.escape?` ESCAPE ${this.escape}` : ''}`;
	}

}

export class NullCheckPredicate extends Predicate {
	constructor(
		public column:ColumnRef,
		public inverse:boolean = false
	) {
		super()
	}
	toString() {
		return `${this.column} IS${this.inverse?' NOT':''} NULL`;
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
	toString() {
		return `${this.left} IN${this.inverse?' NOT':''} (${this.right})`;
	}
}

export class InArrayPredicate extends Predicate {
	constructor(
		public left:ScalarExpr,
		public right:Array<Literal>,
		public inverse:boolean = false
	) {
		super()
	}
	toString() {
		return `${this.left} IN${this.inverse?' NOT':''} ${util.join(this.right, ',', '(', ')')}`;
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
	toString() {
		return `${this.left} ${this.comparison} ${this.mode} ${this.right}`
	}
}

export class ExistenceCheckPredicate extends Predicate {
	constructor(
		public query:SelectQuery,
		public inverse:boolean = false
	) {
		super()
	}
	toString() {
		return `${this.inverse ? 'NOT ':''}EXISTS (${this.query})`
	}
}