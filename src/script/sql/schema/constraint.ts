import {ASTNode} from '../index';
import {NullableLiteral} from '../common/literal';
import {TableRef} from '../common/ref';
import {SearchCondition} from '../query/search-condition';

export class Constraint extends ASTNode {}
export class TableConstraint extends Constraint {}
export class ColumnConstraint extends Constraint {}
export class ColumnedTableConstraint extends TableConstraint {
	constructor(
		public columns:Array<string>
	) {
		super()
	}
}


export class ForeignKeyTableConstraint extends ColumnedTableConstraint {
	constructor(
		public sourceColumns:Array<string>,
		public table:TableRef,
		columns:Array<string> = null
	) {
		super(columns);
	}
}

export class UniqueKeyTableConstraint extends ColumnedTableConstraint {}

export class PrimaryKeyTableConstraint extends ColumnedTableConstraint {}

export class CheckTableConstraint extends TableConstraint {
	constructor (
		public searchCondition:SearchCondition
	) {
		super();
	}
}

export class ForeignKeyConstraint extends ColumnConstraint {
	constructor(
		table:TableRef,
		columns:Array<string> = null
	) {
		super()
	}
}

export class NullConstraint extends ColumnConstraint {}
export class NotNullConstraint extends ColumnConstraint {}
export class UniqueKeyConstraint extends ColumnConstraint {}
export class PrimaryKeyConstraint extends ColumnConstraint 
{}
export class DefaultNullConstraint extends ColumnConstraint {}
export class DefaultConstraint extends ColumnConstraint {
	constructor(
		public value:NullableLiteral
	) {
		super()
	}
}
export class CheckConstraint extends ColumnConstraint {
	constructor (
		public searchCondition:SearchCondition
	) {
		super();
	}
}