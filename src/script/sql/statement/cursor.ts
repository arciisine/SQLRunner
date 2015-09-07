import {Statement,ManipulativeStatement} from '../index';
import {SelectQuery} from '../query/select';
import {OrderBy} from '../query/orderby';
import {Assignment} from '../query/update';

export class CursorDefinitionStatement extends Statement {
	name:string;
	select:SelectQuery;
	orderBy:List<OrderBy>;	
}

export class DeleteCursorQuery extends ManipulativeStatement {
	from:TableRef;
	cursor:string;
}

export class UpdateCursorQuery extends ManipulativeStatement {
	table:TableRef;
	assignments:Array<Assignment>;
	cursor:string;
}


export class Fetch extends ManipulativeStatement {
	cursor:string;
	parameters:Array<ParameterRef>;
}

export class Open extends ManipulativeStatement {
	cursor:string;
}

export class Close extends ManipulativeStatement {
	cursor:string;
}
