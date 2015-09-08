import Parser from './parser/sql99';
export function app() {
    console.log(Parser("SELECT * FROM Users u"));
}
function* test() {
    yield hello;
}
