/// <reference path="../../../../typings/papaparse/papaparse.d.ts" />
/// <reference path="../../custom-typings/zipjs.d.ts" />
/// <reference path="../../custom-typings/sqljs.d.ts" />
import {parser} from 'sql/grammar/sql99';

import {DomainNode} from './domain-node';
import {Statement} from 'sql/index';
import * as insert from 'sql/query/insert';
import * as columnType from 'sql/schema/column-type';
import * as create from 'sql/schema/create';
import * as constraint from 'sql/schema/constraint';
import * as util from 'sql/util';

export class Database extends sql.Database {
	
	public nodes:{[id:string]:DomainNode} = {}
	public resolvedOrder:Array<DomainNode> = []
	public sqlParser = new parser.Parser()

	execStatement(statement:Statement):sql.Result {
		let query = statement.toString()
		console.log("EXECUTING", query)
		return this.exec(query)
	}
	
	loadZip(source:string, zipjs:zipjs.Zip) {
		let promise = new Promise((resolve, reject) => {
			getFiles(zipjs, source, this.importCSV.bind(this), () => {
				this.complete();
				resolve();
			});
		});
		return promise;
	}	

	resolveGraph() {
		var nodes = {};
		for (var k in this.nodes) { 
			nodes[k] = this.nodes[k];
			nodes[k].dependsOn = {}
			for (var j in this.nodes[k].dependsOn) {
				nodes[k].dependsOn[j] = j
			} 
		}
		
		while (Object.keys(nodes).length) {
			let arr = Object.keys(nodes);
			for (let i = 0; i < arr.length; i++) {
				var key = arr[i];	
				if (Object.keys(nodes[key].dependsOn).length == 0) {
					this.resolvedOrder.push(nodes[key]);
					delete nodes[key];
					
					Object.keys(nodes).forEach(sub => {
						delete nodes[sub].dependsOn[key]
					})
					break;
				}
			}
		}
	}

	
	importCSV(name:string, data:string) {
		let results = Papa.parse(data, {
			header: true,
			skipEmptyLines: true
		});
		let node = new DomainNode(name.replace('db_', ''), Object.keys(results.data[0]), results.data)
		this.nodes[node.name] = node
	}
	
	complete() {
		this.resolveGraph();
		this.resolvedOrder.forEach(node => {
			this.execStatement(node.generateTable());
			node.generateInserts().forEach(insert => {
				this.execStatement(insert);
			})
		})
	}
}

function getFiles(zipjs:zipjs.Zip, url:string, onFile:(name:string, data:string) => void, done:() => void) {
	zipjs.createReader(new zipjs.HttpReader(url), function onRead(reader:zipjs.Reader):void {
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
