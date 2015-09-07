import {Statement} from '../index';

export class WhenAction {}
export class ContinueWhenAction{}
export class GotoWhenAction {
	name:string;
}

export class WheneverStatement extends Statement {
	action:WhenAction;
}

export class WheneverNotFound extends WheneverStatement {}
export class WheneverSQLError extends WheneverStatement {}