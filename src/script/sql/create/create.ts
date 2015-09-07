import {ASTNode} from '../common/base';

class Schema extends ASTNode {
	
}

class ColumnSchema extends Schema {
	name:String;
	type:ColumnType;
	notNull:boolean;
	unique:boolean;
	primaryKey:boolean;
	defaultValue:NullableLiteral;
	check:SearchCondition;
	reference:ForeignKeyConstraint;
}

class TableSchema extends Schema {
	name:TableRef;
	columns:Array<ColumnSchema>;
	constraints:Array<TableConstraint>;
}

class ViewSchema extends Schema {
	name:TableRef;
	columns:Array<string>;
	query:SelectQueryNode;
	checkOption:boolean;
}



export class CreateSchemaStatement extends Statement {
	user:string;
	schemas:Array<Schema>;
}