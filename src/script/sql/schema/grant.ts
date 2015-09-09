import {ASTNode} from '../index';
import {TableRef} from '../common/ref';
import {CreateSchema} from './create';

export const enum BasicQueryGrantOperationType {
	SELECT, INSERT, DELETE
}

export const enum ComplexQueryGrantOperationType {
	UPDATE, REFERENCES
}

export class Grantee extends ASTNode {}
export class GrantOperation extends ASTNode {}

export class PublicGrantee extends Grantee {}

export class UserGrantee extends Grantee {
	constructor(
		public name:string
	) {
		super()
	}
}

export class AllGrantOperation extends GrantOperation {}

export class BasicQueryGrantOperation extends GrantOperation {
	constructor(
		public type:BasicQueryGrantOperationType
	) {
		super()
	}
}

export class ComplexQueryGrantOperation extends GrantOperation {
	constructor( 
		public type:ComplexQueryGrantOperationType,
		public columns:Array<string>
	) {
		super()
	}
}

export class PrivilegeSchema extends CreateSchema {
	constructor (
		public operations:Array<GrantOperation>,
		public table:TableRef,
		public grantees:Array<Grantee>,
		public withGrant:boolean = false
	) {
		super();
	}
}
