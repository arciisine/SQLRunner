import {ASTNode} from '../index';
import {ColumnRef} from '../common/ref';

export enum OrderByDirection {
	ASC = <any>"ASC", DESC = <any>"DESC"
}

export class OrderBy extends ASTNode {
	public dir:OrderByDirection
	constructor(public column:ColumnRef, dir:OrderByDirection|boolean) {
		super()
		if (typeof dir === 'boolean') {
			this.dir = dir ? OrderByDirection.ASC : OrderByDirection.DESC
		} else {
			this.dir = dir
		}
	}
	toString() {
		return `${this.column}${this.dir? ' '+this.dir : ''}`
	}
}