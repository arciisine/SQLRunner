import {ASTNode} from '../index';
import {ParameterRef} from '../common/ref';

export class Null extends ASTNode {}
export class Atom extends ASTNode {}
export class Literal extends Atom {}
export type NullableLiteral = Literal|Null;


export class Parameter extends Atom {
	parameter:ParameterRef;
}

export class StringLiteral extends Literal {
	value:string;
}

export class NumberLiteral extends Literal {
	value:number;
}

export class ScientificNumberLiteral extends Literal {
	value:number;
	precision:number
}