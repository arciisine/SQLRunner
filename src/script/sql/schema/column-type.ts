import {ASTNode} from '../index';
import * as util from '../util';

export class ColumnType extends ASTNode {}

export class BooleanColumnType extends ColumnType {
	toString() {
		return 'BOOLEAN';
	}
}
export class SmallIntegerColumnType extends ColumnType {
	toString() {
		return 'SMALLINT';
	}
}
export class BigIntegerColumnType extends ColumnType {
	toString() {
		return 'BIGINT';
	}
}
export class RealColumnType extends ColumnType {
	toString() {
		return 'REALINT';
	}
}
export class DoubleColumnType extends ColumnType {
	toString() {
		return 'DOUBLE';
	}
}

export class SizedColumnType extends ColumnType {
	constructor (public size:number = null) {
		super()
	}
	toString() {
		return this.size ? `(${this.size})` : '';
	}
}

export class TemporalColumnType extends SizedColumnType {
	constructor(size:number = null, public timezone:boolean = false) {
		super(size)
	}
	toString() {
		return super.toString() + (this.timezone? ' WITH TIMEZONE' : '');
	}
}

export class VariableSizedColumnType extends SizedColumnType {
	constructor(size:number, public variable:boolean = false) {
		super(size)
	}
}

export class DateColumnType extends TemporalColumnType {
	toString() {
		return `DATE${super.toString()}`;
	}
}
export class TimeColumnType extends TemporalColumnType {
	toString() {
		return `TIME${super.toString()}`;
	}	
}
export class TimestampColumnType extends TemporalColumnType {
	toString() {
		return `TIMESTAMP${super.toString()}`;
	}
}

export class BinaryColumnType extends VariableSizedColumnType {
	toString() {
		return `${this.variable?'VAR':''}BINARY${super.toString()}`;
	}
}
export class IntegerColumnType extends SizedColumnType {
	toString() {
		return `INTEGER${super.toString()}`;
	}
}
export class FloatColumnType extends SizedColumnType {
	toString() {
		return `FLOAT${super.toString()}`;
	}	
}
export class CharacterColumnType extends VariableSizedColumnType {
	toString() {
		return `${this.variable?'VAR':''}CHAR${super.toString()}`;
	}	
}
export class DecimalColumnType extends SizedColumnType {
	constructor(size:number = null, public precision:number = null) {
		super(size);
	}
	toString() {
		return `DECIMAL${util.join([this.size, this.precision], ',' ,'(',')')}`;
	}
}

export class NumericColumnType extends SizedColumnType {
	constructor(size:number = null, public precision:number = null) {
		super(size);
	}
	toString() {
		return `NUMERIC${util.join([this.size, this.precision], ',' ,'(',')')}`;
	}	
}