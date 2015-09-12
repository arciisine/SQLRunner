export function join(data:Array<any>, sep:string = ' ', prefix:string='', suffix:string=''):string {
	data = (data || []).filter(x => x !== null && x !== undefined)
	return data.length ? prefix + data.map(x => x.toString()).join(sep) + suffix : '';
}

export const KEYWORDS = {
	'ACTION':1,  'ALL':1,  'AND':1,  'ANY':1,  'AS':1,  'ASC':1,  'AUTHORIZATION':1,  
	'BETWEEN':1,  'BIGINT':1,  'BINARY':1,  'BOOLEAN':1,  'BY':1,  
	'CASCADE':1,  'CHAR,CHARACTER,CHECK':1,  'CLOSE':1,  'COMMIT':1,  'CONSTRAINT':1,  'CONTINUE':1,  'CREATE':1,  'CURRENT':1,  'CURSOR':1,  
	'DATE':1,  'DECIMAL':1,  'DECLARE':1,  'DEFAULT':1,  'DELETE':1,  'DESC':1,  'DISTINCT':1,  'DOUBLE':1,  'DROP':1,  
	'ESCAPE':1,  'EXCEPT':1,  'EXISTS':1,  	
	'FETCH':1,  'FLOAT':1,  'FOR':1,  'FOREIGN':1,  'FOUND':1,  'FROM':1,  'FULL':1,  
	'GO':1,  'GRANT':1,  'GROUP':1,  
	'HAVING':1,  
	'IN':1,  'INDICATOR':1,  'INNER':1,  'INSERT':1,  'INT,INTEGER,INTERSECTION':1,  'INTO':1,  'IS':1,  
	'JOIN':1,  
	'KEY':1,  
	'LANGUAGE':1,  'LEFT':1,  'LIKE':1,  
	'NO':1,  'NOT':1,  'NULL':1,  'NUMERIC':1,  	
	'OF':1,  'ON':1,  'OPEN':1,  'OPTION':1,  'OR':1,  'ORDER':1,  'OUTER':1,  
	'PRECISION':1,  'PRIMARY':1,  'PRIVILEGES':1,  'PROCEDURE':1,  'PUBLIC':1,  
	'REAL':1,  'REFERENCES':1,  'RESTRICT':1,  'RIGHT':1,  'ROLLBACK':1,  
	'SCHEMA':1,  'SELECT':1,  'SET':1,  'SMALLINT':1,  'SOME':1,  'SQLCODE':1,  
	'TABLE':1,  'TIME':1,  'TIMESTAMP':1,  'TO':1,  
	'UNION':1,  'UNIQUE':1,  'UPDATE':1,  'USER':1,  
	'VALUES':1,  'VARBINARY':1,  'VARCHAR':1,  'VARYING':1,  'VIEW':1,  
	'WHENEVER':1,  'WHERE':1,  'WITH':1,  'WORK':1
}

export function quoteOnKeyword(key:string):string {
	if (KEYWORDS.hasOwnProperty(key.toUpperCase())) {
		return `"${key}"`;
	} else {
		return key
	}
}