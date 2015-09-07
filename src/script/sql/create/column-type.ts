import {ColumnType} from '../common/base';

export class CharacterColumnType extends ColumnType {}
export class IntegerColumnType extends ColumnType {}
export class FloatColumnType extends ColumnType {}
export class DoubleColumnType extends ColumnType {}
export class DecimalColumnType extends ColumnType {
	precision:number;
}

export class NumericColumnType extends ColumnType {
	precision:number;
}