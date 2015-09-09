import {ASTNode} from '../index';
import {TableRef} from '../common/ref';

export enum BasicQueryGrantOperationType {
	SELECT, INSERT, DELETE
}

export enum ComplexQueryGrantOperationType {
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

export class PrivilegeSchema extends ASTNode {
	constructor (
		public table:TableRef,
		public grantees:Array<Grantee>,
		public operations:Array<GrantOperation>,
		public withGrant:boolean
	) {
		super();
	}
}
