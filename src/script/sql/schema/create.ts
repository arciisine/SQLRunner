import {ASTNode, Statement} from '../index';

import {TableRef} from '../common/ref'; 
import {NullableLiteral} from '../common/literal'

import {SelectQuery} from '../query/select';
import {SearchCondition} from '../query/search-condition';

import {ColumnType} from './column-type';
import {ForeignKeyConstraint,TableConstraint} from './constraint';

export class Schema extends ASTNode {}

export class ColumnConstraints extends ASTNode {
	constructor(
		public notNull:boolean,
		public unique:boolean,
		public primaryKey:boolean,
		public defaultValue:NullableLiteral,
		public check:SearchCondition,
		public reference:ForeignKeyConstraint
	) {
		super()
	}
}

export class ColumnSchema extends ASTNode {
	constructor(
		public name:String,
		public type:ColumnType,
		public constraints:ColumnConstraints
	) {
		super()
	}
}

export class TableSchema extends Schema {
	public columns:Array<ColumnSchema>;
	public constraints:Array<TableConstraint>;

	constructor(
		public name:TableRef,
		created:Array<ColumnSchema|TableConstraint>
	) {
		super();
		this.columns = <Array<ColumnSchema>>created.filter(id => id instanceof ColumnSchema);
		this.constraints = created.filter(id => id instanceof TableConstraint);
	}
}

export class ViewSchema extends Schema {
	constructor(
		public name:TableRef,
		public columns:Array<string>,
		public query:SelectQuery,
		public checkOption:boolean = false
	) {
		super();
	}
}

export class CreateSchemaStatement extends Statement {
	constructor(
		public user:string,
		public schemas:Array<Schema>
	) {
		super();
	}
}