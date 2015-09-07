import {ASTNode} from '../index';

export enum BasicQueryGrantOperation {
	SELECT, INSERT, DELETE
}

export enum ComplexQueryGrantOperation {
	UPDATE, REFERENCES
}

export class Grantee extends ASTNode {}
export class GrantOperation extends ASTNode {}

export class PublicGrantee extends Grantee {}

export class UserGrantee extends Grantee {
	name:string;
}

export class AllGrantOperation extends GrantOperation {}

export class BasicQueryGrantOperation extends GrantOperation {
	type:BasicQueryOperation;
}

export class ComplexQueryGrantOperation extends GrantOperation {
	type:ComplexQueryGrantOperation;
	columns:Array<string>;
}

export class PrivilegeSchema extends ASTNode {
	table:TableRef;
	grantees:List<Grantee>;
	operations:List<GrantOperation>;
	withGrant:boolean;
}
