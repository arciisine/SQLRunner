import {ASTNode} from '../index';
import {TableRef} from '../common/ref';
import {CreateSchema} from './create';
import * as util from '../util';

export enum BasicQueryGrantOperationType {
	SELECT = <any>"SELECT", 
	INSERT = <any>"INSERT", 
	DELETE = <any>"DELETE"
}

export enum ComplexQueryGrantOperationType {
	UPDATE = <any>"UPDATE",
	REFERENCES = <any>"REFERENCES"
}

export class Grantee extends ASTNode {}
export class GrantOperation extends ASTNode {}

export class PublicGrantee extends Grantee {
	toString() {
		return 'PUBLIC';
	}
}

export class UserGrantee extends Grantee {
	constructor(
		public name:string
	) {
		super()
	}
	toString() {
		return `'${this.name}'`;
	}
}

export class AllGrantOperation extends GrantOperation {}

export class BasicQueryGrantOperation extends GrantOperation {
	constructor(
		public type:BasicQueryGrantOperationType
	) {
		super()
	}
	toString() {
		return this.type.toString();
	}
}

export class ComplexQueryGrantOperation extends GrantOperation {
	constructor( 
		public type:ComplexQueryGrantOperationType,
		public columns:Array<string>
	) {
		super()
	}
	toString() {
		return `${this.type}${util.join(this.columns, ',')}`;
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
	toString() {
		return `${util.join(this.operations,',')} ON ${this.table} TO ${util.join(this.grantees,',')} ${this.withGrant? ' WITH GRANT OPTION':''}`
	}
}
