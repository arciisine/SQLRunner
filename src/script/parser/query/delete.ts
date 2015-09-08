import {Query} from './index';
import {SearchCondition} from './search-condition';
import {TableRef} from '../common/ref';

export class DeleteQuery extends Query {
	from:TableRef;
	where:SearchCondition;
}