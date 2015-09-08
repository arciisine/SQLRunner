import {ASTNode, Statement} from '../index';

import {TableRef} from '../common/ref'; 
import {NullableLiteral} from '../common/literal'

import {SelectQuery} from '../query/select';
import {SearchCondition} from '../query/search-condition';

import {ColumnType} from './column-type';
import {ForeignKeyConstraint,TableConstraint} from './constraint';

export class Schema extends ASTNode {}

export class ColumnSchema extends Schema {
	name:String;
	type:ColumnType;
	notNull:boolean;
	unique:boolean;
	primaryKey:boolean;
	defaultValue:NullableLiteral;
	check:SearchCondition;
	reference:ForeignKeyConstraint;
}

export class TableSchema extends Schema {
	name:TableRef;
	columns:Array<ColumnSchema>;
	constraints:Array<TableConstraint>;
}

export class ViewSchema extends Schema {
	name:TableRef;
	columns:Array<string>;
	query:SelectQuery;
	checkOption:boolean;
}

export class CreateSchemaStatement extends Statement {
	user:string;
	schemas:Array<Schema>;
}