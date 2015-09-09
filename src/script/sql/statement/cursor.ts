import {Statement,ManipulativeStatement} from '../index';
import {TableRef,ParameterRef} from '../common/ref';
import {SortableSelectQuery, JoinRef} from '../query/select';
import {OrderBy} from '../query/orderby';
import {Assignment} from '../query/update';

export class CursorDefinitionStatement extends Statement {
	constructor(
		public name:string,
		public select:SortableSelectQuery
	) {
		super();
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
}

export class CursorStatement extends ManipulativeStatement {
	constructor(public cursor:string) {
		super()
	}
}

export class FetchStatement extends CursorStatement {
	constructor(
		cursor:string,
		public parameters:Array<ParameterRef>) 
	{
		super(cursor)
	}
}

export class OpenStatement extends CursorStatement {}
export class CloseStatement extends CursorStatement {}
