import {Statement} from 'sql/index';
import * as insert from 'sql/query/insert';
import * as columnType from 'sql/schema/column-type';
import * as create from 'sql/schema/create';
import * as constraint from 'sql/schema/constraint';

export class DomainNode {
	dependsOn:{[id:string]:string} = {};
	
	constructor(public name:string, public columnNames:Array<string>, public data:Array<{[id:string]:(number|string)}>) {
		this.dependsOn = {};
		this.name = this.name.replace('db_', '')
		this.columnNames
			.filter(k => k.indexOf('ID') >= 0)
			.map(x => x.replace('ID','').toLowerCase())
			.filter(k => k != name)
			.forEach(k => {
				this.dependsOn[k] = k 
			});
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
		let columns = this.columnNames.map(key => this.generateColumn(key))
		let table = new create.TableSchema(this.name, columns);
		return table;
	}
	
	generateInserts() {
		let commands:Array<Statement> = this.data.map(obj => 
			insert.InsertQuery.build(this.name, this.columnNames.map(k =>{
				if (obj[k] === 'NULL') {
					return null
				} else if (k.indexOf('Price') >= 0) {
					return parseFloat(obj[k].toString())
				} else if (k.indexOf('Quantity') >= 0 || k.indexOf('ID') >= 0) {
					return parseInt(obj[k].toString())
				} else if (k.indexOf('Date') >= 0) {
					return new Date(obj[k]).toISOString().split('T')[0]
				}
				return obj[k];
			}), this.columnNames)
		)
		return commands;
	}
}
