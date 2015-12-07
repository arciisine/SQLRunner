import {ASTNode, Statement} from '../index';

export abstract class WhenAction extends ASTNode {}
export class ContinueWhenAction extends WhenAction {
	toString() {
		return 'CONTINUE';
	}
}
export class GotoWhenAction extends WhenAction {
	constructor(public name:string) {
		super()
	}
	toString() {
		return `GOTO ${this.name}`;
	}
}

export class WheneverStatement extends Statement {
	constructor(public action:WhenAction) {
		super();
	}
	toString() {
		return this.action.toString();
	}
}

export class WheneverNotFound extends WheneverStatement {
	toString() {
		return `WHENEVER NOT FOUND ${super.toString()}`
	}
}
export class WheneverSQLError extends WheneverStatement {
	toString() {
		return `WHENEVER SQLERROR ${super.toString()}`
	}
}