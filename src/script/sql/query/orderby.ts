import {ASTNode} from '../index';
import {ColumnRef} from '../common/ref';

export enum OrderByDirection {
	ASC, DESC
}

export class OrderBy extends ASTNode {
	constructor(public column:ColumnRef, public dir:OrderByDirection) {
		super()
	}
}