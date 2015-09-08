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
	name:string;
}

export class AllGrantOperation extends GrantOperation {}

export class BasicQueryGrantOperation extends GrantOperation {
	type:BasicQueryGrantOperationType;
}

export class ComplexQueryGrantOperation extends GrantOperation {
	type:ComplexQueryGrantOperationType;
	columns:Array<string>;
}

export class PrivilegeSchema extends ASTNode {
	table:TableRef;
	grantees:Array<Grantee>;
	operations:Array<GrantOperation>;
	withGrant:boolean;
}
