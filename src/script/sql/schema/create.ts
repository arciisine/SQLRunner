import {ASTNode, Statement} from '../index';

import {TableRef} from '../common/ref'; 
import {NullableLiteral} from '../common/literal'

import {SelectQuery} from '../query/select';
import {SearchCondition} from '../query/search-condition';

import {ColumnType} from './column-type';
import {TableConstraint, ColumnConstraint} from './constraint';
import * as util from '../util';

export abstract class Schema extends ASTNode {}

export class ColumnSchema extends ASTNode {
	constructor(
		public name:string,
		public type:ColumnType,
		public constraints:Array<ColumnConstraint> = []
	) {
		super()
	}
	toString() {
		return `${util.quoteOnKeyword(this.name)} ${this.type} ${util.join(this.constraints)}`
	}
}

export class CreateSchema extends Schema {}

export class TableSchema extends CreateSchema {
	public columns:Array<ColumnSchema>;
	public constraints:Array<TableConstraint>;
	public name:TableRef;

	constructor(
		name:TableRef|string,
		created:Array<ColumnSchema|TableConstraint>,
		public force: Boolean = true
	) {
		super();
		if (typeof name === 'string') {
			this.name = new TableRef(name);
		} else {
			this.name = name; 
		}
		
		this.columns = <Array<ColumnSchema>>created.filter(id => id instanceof ColumnSchema);
		this.constraints = created.filter(id => id instanceof TableConstraint);
	}
	toString() {
		return `CREATE TABLE ${this.name} (
			${util.join(this.columns, ',\n')}
		)`
	}
}

export class ViewSchema extends CreateSchema {
	constructor(
		public name:TableRef,
		public columns:Array<string>,
		public query:SelectQuery,
		public checkOption:boolean = false,
		public force: Boolean = true
	) {
		super();
	}
	toString() {
		return `CREATE VIEW ${this.name} ${util.join(this.columns, ',', '(' ,')')} AS
		${this.query} ${this.checkOption ? '\nWITH CHECK OPTION' : ''}`
	}
}

export class AuthorizationSchema extends Schema {
	constructor(
		public table:TableRef,
		public user:string,
		public schemas:Array<CreateSchema>
	) {
		super();
	}
	toString() {
		return `CREATE SCHEMA ${this.table} AUTHORIZATION ${this.user}
		${util.join(this.schemas, '\n')}`
	}
}