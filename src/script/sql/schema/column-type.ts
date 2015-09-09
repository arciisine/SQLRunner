import {ASTNode} from '../index';

export class ColumnType extends ASTNode {}

export class BooleanColumnType extends ColumnType {}
export class SmallIntegerColumnType extends ColumnType {}
export class BigIntegerColumnType extends ColumnType {}
export class RealColumnType extends ColumnType {}
export class DoubleColumnType extends ColumnType {}

export class SizedColumnType extends ColumnType {
	constructor (public size:number = null) {
		super()
	}
}

export class TemporalColumnType extends SizedColumnType {
	constructor(size:number, public timezone:boolean = false) {
		super(size)
	}
}

export class VariableSizedColumnType extends SizedColumnType {
	constructor(size:number, public variable:boolean = false) {
		super(size)
	}
}

export class DateColumnType extends TemporalColumnType {}
export class TimeColumnType extends TemporalColumnType {}
export class TimestampColumnType extends TemporalColumnType {}

export class BinaryColumnType extends VariableSizedColumnType {}
export class IntegerColumnType extends SizedColumnType {}
export class FloatColumnType extends SizedColumnType {}
export class CharacterColumnType extends VariableSizedColumnType {}
export class DecimalColumnType extends SizedColumnType {
	constructor(size:number, public precision:number) {
		super(size);
	}
}

export class NumericColumnType extends SizedColumnType {
	constructor(size:number, public precision:number) {
		super(size);
	}
}