import {ASTNode, ColumnRef} from '../common/base';

enum OrderByDirection {
	ASC, DESC
}

export class OrderBy extends ASTNode {
	dir:OrderByDirection;
}

export class ColumnOrderBy extends OrderBy {
	column:ColumnRef;
}

export class NumberOrderBy extends OrderBy {
	column:number;
}
