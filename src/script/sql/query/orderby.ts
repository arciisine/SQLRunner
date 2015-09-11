import {ASTNode} from '../index';
import {ColumnRef} from '../common/ref';

export enum OrderByDirection {
	ASC = <any>"ASC", DESC = <any>"DESC"
}

export class OrderBy extends ASTNode {
	constructor(public column:ColumnRef, public dir:OrderByDirection) {
		super()
	}
	toString() {
		return `${this.column}${this.dir? ' '+this.dir : ''}`
	}
}