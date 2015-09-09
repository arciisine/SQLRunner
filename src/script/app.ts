import {parser} from './sql/grammar/sql99';
//import {sqljs} from 'sqljs';
//import {zipjs} from 'zipjs';

let sqlParser = new parser.Parser();

export function app() {
	let ret = sqlParser.parse(`
		SELECT z.state, MAX(z.age) 
		FROM Users z 
		WHERE 
			z.name LIKE '%tom%' 
			AND z.age < 20 
		GROUP BY z.state 
		ORDER BY z.state;
		
		CREATE TABLE Users (
			id INT PRIMARY KEY,
			name VARCHAR(20) NOT NULL,
			age FLOAT NOT NULL				
		);
	`);
	
	console.log(ret);
	
	return ret;
}