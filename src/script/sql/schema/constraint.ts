import {ASTNode} from '../index';
import {NullableLiteral} from '../common/literal';
import {TableRef} from '../common/ref';
import {SearchCondition} from '../query/search-condition';
import * as util from '../util';

export enum ReferentialAction {
	CASCADE = <any>'CASCADE', 
	SET_NULL = <any>'SET NULL',
	SET_DEFAULT = <any>'SET DEFAULT',
	RESTRICT = <any>'RESTRICT',
	NO_ACTION = <any>'NO ACTION'
}

export enum ReferentialQueryOperation {
	UPDATE = <any>'UPDATE',
	DELETE = <any>'DELETE'
}

export class ReferentialTriggerAction extends ASTNode {
	constructor(
		public operation:ReferentialQueryOperation,
		public action:ReferentialAction
	) {
		super()
	}
	toString() {
		return `ON ${this.operation} ${this.action}`
	}
}


export abstract class Constraint extends ASTNode {}
export abstract class TableConstraint extends Constraint {}
export abstract class ColumnConstraint extends Constraint {}
export abstract class ColumnedTableConstraint extends TableConstraint {
	constructor(
		public columns:Array<string>
	) {
		super()
	}
	toString() {
		return util.join(this.columns, ',')
	}
}

export class ForeignKeyTableConstraint extends ColumnedTableConstraint {
	constructor(
		public sourceColumns:Array<string>,
		public table:TableRef,
		columns:Array<string> = null,
		public triggerActions:Array<ReferentialTriggerAction> = null
	) {
		super(columns);
	}
	toString() {
		return `FOREIGN KEY ${util.join(this.sourceColumns, ',', '(' ,')')} REFERENCES ${this.table} ${super.toString()} ${util.join(this.triggerActions)}`
	}
}

export class UniqueKeyTableConstraint extends ColumnedTableConstraint {
	toString() {
		return `UNIQUE KEY ${super.toString()}`;
	}
}

export class PrimaryKeyTableConstraint extends ColumnedTableConstraint {
	toString() {
		return `PRIMARY KEY ${super.toString()}`;
	}
}

export class CheckTableConstraint extends TableConstraint {
	constructor (
		public searchCondition:SearchCondition
	) {
		super();
	}
	
	toString() {
		return `CHECK ${this.searchCondition.toString()}`;
	}
}

export class ForeignKeyConstraint extends ColumnConstraint {
	public table:TableRef;
	
	constructor(
		table:TableRef|string,
		public columns:Array<string> = null,
		public triggerActions:Array<ReferentialTriggerAction> = null		
	) {
		super()
		if (typeof table === 'string') {
			this.table = new TableRef(table);
		} else {
			this.table = table;
		}
	}
	
	toString() {
		return `REFERENCES ${this.table}${util.join(this.columns, ',', '(' ,')')} ${util.join(this.triggerActions)}`;
	}
}
export class NullConstraint extends ColumnConstraint {
	constructor(
		public inverse:boolean = false
	) {
		super()
	}
	toString() {
		return `${this.inverse ? 'NOT ' : ''} NULL`;
	}
}
export class NotNullConstraint extends ColumnConstraint {
	toString() {
		return 'NOT NULL';
	}
}
export class UniqueKeyConstraint extends ColumnConstraint {
	toString() {
		return 'UNIQUE';
	}
}
export class PrimaryKeyConstraint extends ColumnConstraint {
	toString() {
		return 'PRIMARY KEY';
	}
}
export class DefaultNullConstraint extends ColumnConstraint {
	toString() {
		return 'DEFAULT NULL';
	}
}
export class DefaultConstraint extends ColumnConstraint {
	constructor(
		public value:NullableLiteral
	) {
		super()
	}
	
	toString() {
		return `DEFAULT ${this.value}`;
	}
}
export class CheckConstraint extends ColumnConstraint {
	constructor (
		public searchCondition:SearchCondition
	) {
		super();
	}
	
	toString() {
		return `CHECK ${this.searchCondition}`;
	}
}
export class NamedTableConstraint extends TableConstraint {
	constructor(public name:string, public constraint:TableConstraint) {
		super()
	}
	toString() {
		return `CONSTRAINT ${this.name} ${this.constraint}`;
	}
}