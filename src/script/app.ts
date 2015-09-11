/// <reference path="../../typings/papaparse/papaparse.d.ts" />
/// <reference path="custom-typings/zipjs.d.ts" />

import {parser} from 'sql/grammar/sql99';
import {InsertQuery,InsertValues} from 'sql/query/insert';
import * as util from 'sql/util';
 
let sqlParser = new parser.Parser();

export function start(zipjs:zipjs.Zip) {
	
	let query = `SELECT p1.PLAYERID, 
       f1.PLAYERNAME, 
       p2.PLAYERID, 
       f2.PLAYERNAME 
FROM   PLAYER f1, 
       PLAYER f2, 
       PLAYS p1 
       FULL OUTER JOIN PLAYS p2 
                    ON p1.PLAYERID < p2.PLAYERID 
                       AND p1.TEAMID = p2.TEAMID 
GROUP  BY p1.PLAYERID, 
          f1.PLAYERID, 
          p2.PLAYERID, 
          f2.PLAYERID 
HAVING Count(p1.PLAYERID) = Count(*) 
       AND Count(p2.PLAYERID) = Count(*) 
       AND p1.PLAYERID = f1.PLAYERID 
       AND p2.PLAYERID = f2.PLAYERID; `
	   
	let ast = sqlParser.parse(query);
	console.log(ast[0]);
	console.log(util.join(ast, ';'));
	
	getFiles(zipjs, onFile, onReady);	
}

function onFile(name:string, data:string) {
	let results = Papa.parse(data, {
		header: true,
		dynamicTyping: true,
		skipEmptyLines: true
	});
	
	let keys = Object.keys(results.data[0]);
	
	let inserts = results.data.map(obj => 
		InsertQuery.build(name, keys.map(k => obj[k]), keys)
	)
	
	inserts.forEach(insert =>
		console.log(insert.toString())
	);
		
	//data
}

function onReady() {
	
}


function getFiles(zipjs:zipjs.Zip, onFile:(name:string, data:string) => void, done:() => void) {
	zipjs.createReader(new zipjs.HttpReader('assets/data.zip'), function onRead(reader:zipjs.Reader):void {
		// get all entries from the zip
		reader.getEntries(function(entries:zipjs.Entry[]) {						
			(entries||[])
				.filter(entry => entry.filename.match(/.csv$/) && !entry.filename.match(/__|DS_STORE/))
				.forEach( (entry, i) => 
					entry.getData(new zipjs.TextWriter(), function(text:string) {
						// text contains the entry data as a String
						onFile(entry.filename.split('.csv')[0].split(/[./]/).pop(), text);							
					})
				);
				done()
			},
			function onError(error:Error) {
				//Do nothing
			}
		);
	})		
}