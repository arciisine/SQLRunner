import {parser} from './sql/grammar/sql99';

let sqlParser = new parser.Parser();

export function app() {
	let ret = sqlParser.parse("SELECT * FROM Users z WHERE z.name LIKE '%tom%' ");
	console.log(ret);
	return ret;
}