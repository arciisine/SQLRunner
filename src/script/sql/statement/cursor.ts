import {Statement,ManipulativeStatement} from '../index';
import {TableRef,ParameterRef} from '../common/ref';
import {SortableSelectQuery, JoinRef} from '../query/select';
import {OrderBy} from '../query/orderby';
import {Assignment} from '../query/update';
import * as util from '../util';

export class CursorDefinitionStatement extends Statement {
	constructor(
		public name:string,
		public select:SortableSelectQuery
	) {
		super();
	}
	
	toString() {
		return `DECLARE CURSOR ${this.name} FOR ${this.select}`;
	}
}

export class DeleteCursorQuery extends ManipulativeStatement {
	constructor(
		public from:TableRef,
		public joins:Array<JoinRef>,
		public cursor:string
	) {
		super()
	}
	
	toString() {
		return `DELETE FROM ${this.from.toString()} ${util.join(this.joins)} WHERE CURRENT OF ${this.cursor}`
	}
}

export class UpdateCursorQuery extends ManipulativeStatement {
	constructor(
		public table:TableRef,
		public joins:Array<JoinRef>,
		public assignments:Array<Assignment>,
		public cursor:string
	) {
		super();
	}
	
	toString() {
		return `UPDATE ${this.table} ${util.join(this.joins)} SET ${util.join(this.assignments, ',')} WHERE CURRENT OF ${this.cursor}`
	}
}

export class CursorStatement extends ManipulativeStatement {
	constructor(public cursor:string) {
		super()
	}
	toString() { return this.cursor; }
}

export class FetchStatement extends CursorStatement {
	constructor(
		cursor:string,
		public parameters:Array<ParameterRef>) 
	{
		super(cursor)
	}
	toString() {
		return `FETCH ${super.toString()} INTO ${util.join(this.parameters, ',')}`
	}
}

export class OpenStatement extends CursorStatement {
	toString() { return `OPEN ${super.toString()}`; }
}
export class CloseStatement extends CursorStatement {
	toString() { return `CLOSE ${super.toString()}`; }
}
