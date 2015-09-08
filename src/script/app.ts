import Parser from './sql/grammar/sql99';

export function app() {
	console.log(Parser("SELECT * FROM Users u"));
}