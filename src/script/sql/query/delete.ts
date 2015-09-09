import {Query} from './index';
import {JoinRef} from './select';
import {SearchCondition} from './search-condition';
import {TableRef} from '../common/ref';

export class DeleteQuery extends Query {
	constructor(
		public from:TableRef,
		public joins:Array<JoinRef>,
		public where:SearchCondition = null
	) {
		super()
	}
}