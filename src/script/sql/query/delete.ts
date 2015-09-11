import {Query} from './index';
import {JoinRef} from './select';
import {SearchCondition} from './search-condition';
import {TableRef} from '../common/ref';
import * as util from '../util';

export class DeleteQuery extends Query {
	constructor(
		public from:TableRef,
		public joins:Array<JoinRef>,
		public where:SearchCondition = null
	) {
		super()
	}
	toString() {
		return `DELETE FROM ${this.from} ${util.join(this.joins)} ${this.where||''}`
	}
}