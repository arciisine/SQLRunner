import {ASTNode} from '../index';

import {TableRef} from '../common/ref'; 
import {PrivilegeSchema} from './grant';

export abstract class DropSchema extends ASTNode {}

export class DropTableSchema extends DropSchema {
	constructor(
		public name:TableRef
	) {
		super();
	}
	toString() {
		return `DROP TABLE ${this.name}`;
	}
}

export class DropViewSchema extends DropSchema {
	constructor(
		public name:TableRef
	) {
		super();
	}
	toString() {
		return `DROP VIEW ${this.name}`;
	}
}

export class DropPrivilegeSchema extends DropSchema {
	constructor(
		public granted:PrivilegeSchema
	) {
		super();
	}
	toString() {
		return `REVOKE ${this.granted}`;
	}
}