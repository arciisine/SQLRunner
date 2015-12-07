export class ASTNode {
	toIndentedString(prefix:string = '', suffix:string = ''):string {
		return `${prefix}${this.toString().replace(/\n/mg, '\n  ')}${suffix}`;
	}
}
export class Statement extends ASTNode {}
export class ManipulativeStatement extends Statement {}
