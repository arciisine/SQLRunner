import { ASTNode } from '../index';
export class Null extends ASTNode {
}
export class Atom extends ASTNode {
}
export class Literal extends Atom {
}
export class Parameter extends Atom {
}
export class StringLiteral extends Literal {
}
export class NumberLiteral extends Literal {
}
export class ScientificNumberLiteral extends Literal {
}
