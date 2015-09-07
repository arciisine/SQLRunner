import {ASTNode} from '../index';


enum BasicQueryGrantOperation {
	SELECT, INSERT, DELETE
}

enum ComplexQueryGrantOperation {
	UPDATE, REFERENCES
}

class Grantee extends ASTNode {}
class GrantOperation extends ASTNode {}

class PublicGrantee extends Grantee {}

class UserGrantee extends Grantee {
	name:string;
}

class AllGrantOperation extends GrantOperation {}

class BasicQueryGrantOperation extends GrantOperation {
	type:BasicQueryOperation;
}

class ComplexQueryGrantOperation extends GrantOperation {
	type:ComplexQueryGrantOperation;
	columns:Array<string>;
}

class PrivilegeSchema extends ASTNode {
	table:TableRef;
	grantees:List<Grantee>;
	operations:List<GrantOperation>;
	withGrant:boolean;
}
