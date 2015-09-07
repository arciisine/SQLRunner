import {Constraint, SearchCondition, TableRef} from '../common/base';

class ForeignKeyConstaint extends Constraint {
	table:TableRef;
	columns:Array<string>;
}

class TableConstraint extends Constraint {}

class TableForeignKeyConstraint extends TableConstraint {
	sourceColumns:Array<string>;
	table:TableRef;
	columns:Array<string>;
}

class UniqueKeyConstraint extends TableConstraint {
	columns:Array<string>;
}

class PrimaryKeyConstraint extends TableConstraint {
	columns:Array<string>;
}

class CheckConstraint extends TableConstraint {
	searchCondition:SearchCondition;
}