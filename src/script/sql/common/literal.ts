import {ASTNode} from '../index';
import {ParameterRef} from '../common/ref';

export class Null extends ASTNode {}
export class Atom extends ASTNode {}
export class Literal extends Atom {}
export type NullableLiteral = Literal|Null;
export type NullableAtom = Atom|Null;


export class Parameter extends Atom {
	constructor(public parameter:ParameterRef) {
		super()
    }
}

export class StringLiteral extends Literal {
	constructor(public value:string) {
		super()
	}
}

export class NumberLiteral extends Literal {
	constructor(public value:number) {
		super()
	}
}

export class ScientificNumberLiteral extends Literal {
	static fromString(rep:string):ScientificNumberLiteral {
		let [left,right] = rep.split(/e/i).map(v => parseFloat(v));
		
		let ret = new ScientificNumberLiteral(left, right);
		return ret;
	}
	
	constructor(public value:number, precision:number) {
		super()
	}
}