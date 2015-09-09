import {ASTNode} from '../index';

import {TableRef} from '../common/ref'; 
import {PrivilegeSchema} from './grant';

export class DropSchema extends ASTNode {}

export class DropTableSchema extends DropSchema {
	constructor(
		public name:TableRef
	) {
		super();
	}
}

export class DropViewSchema extends DropSchema {
	constructor(
		public name:TableRef
	) {
		super();
	}
}

export class DropPrivilegeSchema extends DropSchema {
	constructor(
		public granted:PrivilegeSchema
	) {
		super();
	}
}