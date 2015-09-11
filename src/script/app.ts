/// <reference path="../../typings/papaparse/papaparse.d.ts" />
/// <reference path="custom-typings/zipjs.d.ts" />
/// <reference path="custom-typings/sqljs.d.ts" />

import {parser} from 'sql/grammar/sql99';
import {Statement} from 'sql/index';
import * as insert from 'sql/query/insert';
import * as columnType from 'sql/schema/column-type';
import * as create from 'sql/schema/create';
import * as constraint from 'sql/schema/constraint';
import * as util from 'sql/util';
 
let sqlParser = new parser.Parser();

export function start(zipjs:zipjs.Zip) {
	getFiles(zipjs, onFile, onReady);	
}

let nodes:{[id:string]:DomainNode} = {}

function resolveGraph() {
	let commands:Array<Statement> = [];
	while (Object.keys(nodes).length) {
		let arr = Object.keys(nodes);
		for (let i = 0; i < arr.length; i++) {
			var key = arr[i];	
			if (Object.keys(nodes[key].dependsOn).length == 0) {
				commands = commands.concat(nodes[key].generateTable());
				delete nodes[key];
				
				Object.keys(nodes).forEach(sub => {
					delete nodes[sub].dependsOn[key]
				})
				break;
			}
		}
	}
	return commands;
}

class DomainNode {
	dependsOn:{[id:string]:string} = {};
	
	constructor(public name:string, public columnNames:Array<string>, public data:Array<{[id:string]:(number|string)}>) {
		this.dependsOn = {};
		this.columnNames
			.filter(k => k.indexOf('ID') >= 0)
			.map(x => x.replace('ID','').toLowerCase())
			.filter(k => k != name)
			.forEach(k => this.dependsOn[k] = k ); 	
	}
	
	generateColumn(key:string) {
		if (key.indexOf('ID') > 0) {
			let constraints:Array<constraint.ColumnConstraint> = []
			let relatedTable = key.replace('ID', '').toLowerCase();
			if (this.name === relatedTable) {
				constraints = [new constraint.PrimaryKeyConstraint(), new constraint.NotNullConstraint()];
			} else {
				constraints = [new constraint.ForeignKeyConstraint(relatedTable), relatedTable !== 'shipper' ? new constraint.NotNullConstraint() : new constraint.NullConstraint()];
			}
			
			return new create.ColumnSchema(
				key, 
				new columnType.BigIntegerColumnType(), 
				constraints
			);
		}
		if (key.indexOf('Date') > 0) {
			return new create.ColumnSchema(key, new columnType.DateColumnType(), null)
		}
		if (key.indexOf('Price') >= 0) {
			return new create.ColumnSchema(key, new columnType.NumericColumnType(), null)
		}
		if (key.indexOf('Quantity') >= 0) {
			return new create.ColumnSchema(key, new columnType.IntegerColumnType(), null)
		}
		return new create.ColumnSchema(key, new columnType.CharacterColumnType(100, true), null)
	}
	
	generateTable() {
		let tableName = this.name.replace('db_','');
		let columns = this.columnNames.map(key => this.generateColumn(key))
		let table = new create.TableSchema(tableName, columns);
		
		let commands:Array<Statement> = this.data.map(obj => 
			insert.InsertQuery.build(tableName, this.columnNames.map(k =>{
				if (obj[k] === 'NULL') {
					return null
				} else if (k.indexOf('Price') >= 0) {
					return parseFloat(obj[k].toString())
				} else if (k.indexOf('Quantity') >= 0 || k.indexOf('ID') >= 0) {
					return parseInt(obj[k].toString())
				}
				return obj[k];
			}), this.columnNames)
		)
		commands.unshift(table);
		return commands;
	}
}

function onFile(name:string, data:string) {
	let results = Papa.parse(data, {
		header: true,
		skipEmptyLines: true
	});
	let node = new DomainNode(name.replace('db_', ''), Object.keys(results.data[0]), results.data)
	console.log(node.name, data);
	nodes[node.name] = node
}

function onReady() {
	let commands = resolveGraph();
	let db = new sql.Database();
	commands.forEach(command => {
		console.log(command);
		console.log(command.toString());
		db.exec(command.toString());
	});
	
	let query = `
	select 
		count(*) AS my_count 
	FROM book 
		INNER JOIN "order_detail" 
			ON "order_detail".BookId = book.BookId
	WHERE
		"order_detail".quantity > 1
	`;
	
	try {
		query = sqlParser.parse(query).toString();
		console.log(query);
		console.log(db.exec(query))
	} catch(e) {
		console.error(e);
	}
}


function getFiles(zipjs:zipjs.Zip, onFile:(name:string, data:string) => void, done:() => void) {
	zipjs.createReader(new zipjs.HttpReader('assets/data.zip'), function onRead(reader:zipjs.Reader):void {
		// get all entries from the zip
		reader.getEntries(function(entries:zipjs.Entry[]) {									
			entries = (entries||[])
				.filter(entry => entry.filename.match(/.csv$/) && !entry.filename.match(/__|DS_STORE/))

			let len = (entries||[]).length;
				
			entries
				.forEach( (entry, i) => 
					entry.getData(new zipjs.TextWriter(), function(text:string) {
						// text contains the entry data as a String
						onFile(entry.filename.split('.csv')[0].split(/[./]/).pop(), text);
						len --;
						if (len === 0) {
							done()
						}							
					})
				);
			},
			function onError(error:Error) {
				//Do nothing
			}
		);
	})		
}