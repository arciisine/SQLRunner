import {ASTNode, Statement} from '../index';

export class WhenAction extends ASTNode {}
export class ContinueWhenAction extends WhenAction {}
export class GotoWhenAction extends WhenAction {
	constructor(public name:string) {
		super()
	}
}

export class WheneverStatement extends Statement {
	constructor(public action:WhenAction) {
		super();
	}
}

export class WheneverNotFound extends WheneverStatement {}
export class WheneverSQLError extends WheneverStatement {}