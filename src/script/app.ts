import Parser from './parser/grammar/sql99';

export function app() {
	console.log(Parser("SELECT * FROM Users u"));
}