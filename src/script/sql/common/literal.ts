import {ASTNode} from '../index';
import {ParameterRef} from '../common/ref';

export class Null extends ASTNode {
	toString() {
		return 'NULL'
	}
}
export abstract class Atom extends ASTNode {}
export abstract class Literal extends Atom {
	static build(value:any):Literal {
		if (typeof value === 'string') {
			return new StringLiteral(value)
		} else if (typeof value === 'number') {
			return new NumberLiteral(value);
		}
		return new Null();
	}
}
export type NullableLiteral = Literal|Null;
export type NullableAtom = Atom|Null;

export class Parameter extends Atom {
	constructor(public parameter:ParameterRef) {
		super()
    }
	toString() {
		return `:${this.parameter}`
	}
}

export class StringLiteral extends Literal {
	constructor(public value:string) {
		super()
	}
	toString() {
		return `'${this.value.replace(/'/g, "''")}'`;
	}
}

export class NumberLiteral extends Literal {
	constructor(public value:number) {
		super()
	}
	toString() {
		return this.value.toString()
	}
}

export class ScientificNumberLiteral extends Literal {
	static fromString(rep:string):ScientificNumberLiteral {
		let [left,right] = rep.split(/e/i).map(v => parseFloat(v));
		
		let ret = new ScientificNumberLiteral(left, right);
		return ret;
	}
	
	constructor(public value:number, public precision:number) {
		super()
	}
	toString() {
		return `${this.value}E${this.precision}`;
	}
}