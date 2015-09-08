import {parser} from './sql/grammar/sql99';

export function app() {
	console.log(parser.Parser("SELECT * FROM Users z"));
}