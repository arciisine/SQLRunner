import {Statement} from '../index';
import {SelectQuery} from '../query/index';
import {OrderBy} from '../query/orderby';

export class CursorDefinitionStatement extends Statement {
	name:string;
	select:SelectQuery;
	orderBy:List<OrderBy>;	
}