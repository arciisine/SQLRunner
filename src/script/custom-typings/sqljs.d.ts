declare class sql {}

declare module sql {
	type Params = {}|Array<any>
	
	type Result = {
		columns : Array<string>,
		values  : Array<Array<string>>
	}
	
	class Statement {
		get:(parameters?:{}) => Array<any>
		getAsObject:(parameters?:Params) => {}
		getColumnNames:() => Array<String>
		bind:(parameters:Params) => void
		run:(parameters?:Params) => void
		step:() => boolean
		free:() => void
	}
	
	class Database {
		exec:(command:string) => Result
		export:() => Uint8Array
		close:() => void
		handleError:() => void
		run:(command:string, parameters?:Params) => Database
		prepare:(command:string, parameters?:Params) => Statement
		each:{
			(command:string, callback:(row:Array<any>) => void, done:() => void):Database,
			(command:string, params:any, callback:(row:Array<any>) => void, done:() => void):Database
		};
	}
}