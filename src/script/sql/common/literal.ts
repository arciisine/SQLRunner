import {Atom,Null} from './base';

class Parameter extends Atom {
	parameter:ParameterRef;
}

class Literal extends Atom {}

class StringLiteral extends Literal {
	value:string;
}

class NumberLiteral extends Literal {
	value:number;
}

class ScientificNumberLiteral extends Literal {
	value:number;
	precision:number
}

type NullableLiteral = Literal|Null;