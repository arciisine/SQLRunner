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

export class ZippedCSVDataSource {

	static load(source:string):Promise<string> {
		return new ZippedCSVDataSource().load(source)
	}

	public nodes:{[id:string]:DomainNode} = {}
	public resolvedOrder:Array<string> = []

	constructor() {}

	load(source:string) {
		let promise = new Promise<string>((resolve, reject) => {
			getZipFiles(source, (name, data) => {
				let node = this.convertCSVToDomainNode(name, data)
				this.nodes[node.name] = node
			}, () => {
				resolve(this.complete());
			});
		})
		return promise;
	}

	resolveGraph() {
		var nodes = {};
		for (var k in this.nodes) {
			nodes[k] = {}
			for (var j in this.nodes[k].dependsOn) {
				nodes[k][j] = j
			}
		}

		while (Object.keys(nodes).length) {
			let arr = Object.keys(nodes);
			for (let i = 0; i < arr.length; i++) {
				var key = arr[i];
				if (Object.keys(nodes[key]).length == 0) {
					this.resolvedOrder.push(key);
					delete nodes[key];

					Object.keys(nodes).forEach(sub => {
						delete nodes[sub][key]
					})
					break;
				}
			}
		}
	}


	convertCSVToDomainNode(name:string, data:string) {
		let results = Papa.parse(data, {
			header: true,
			skipEmptyLines: true
		});
		return new DomainNode(name.replace('db_', ''), Object.keys(results.data[0]), results.data)
	}

	complete() {
		this.resolveGraph();
		let arr = []
		this.resolvedOrder.map( key => this.nodes[key]).forEach(node => {
			arr.push(node.generateTable())
			arr = arr.concat(node.generateInserts())
		})
		return arr.join(';\n')
	}
}

function getZipFiles(url:string, onFile:(name:string, data:string) => void, done:() => void) {
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
