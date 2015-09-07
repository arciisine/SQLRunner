import {ASTNode} from '../index';
import {TableRef} from '../common/ref';
import {SearchCondition} from '../query/search-condition';

export class Constraint extends ASTNode {}
export class TableConstraint extends Constraint {}

export class ForeignKeyConstaint extends Constraint {
	table:TableRef;
	columns:Array<string>;
}

export class TableForeignKeyConstraint extends TableConstraint {
	sourceColumns:Array<string>;
	table:TableRef;
	columns:Array<string>;
}

export class UniqueKeyConstraint extends TableConstraint {
	columns:Array<string>;
}

export class PrimaryKeyConstraint extends TableConstraint {
	columns:Array<string>;
}

export class CheckConstraint extends TableConstraint {
	searchCondition:SearchCondition;
}