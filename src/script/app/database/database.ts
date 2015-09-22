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
	
	public sqlParser = new parser.Parser()
	public tables:{[name:string]:create.TableSchema} = {}
	public views:{[name:string]:create.ViewSchema} = {}
	get tableNames():Array<String> {
		return Object.keys(this.tables)
	}

	execStatement(statement:Statement):sql.Result {
		let query = statement.toString()
		console.log("EXECUTING", query)
		
		try {
			let res = this.exec(query)
			
			if (statement instanceof create.TableSchema) {
				this.tables[statement.name.toString()] = statement
			}

			return res;
		} catch (e) {
			throw e;
		}
	}
}