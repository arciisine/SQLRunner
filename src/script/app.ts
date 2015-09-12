/// <reference path="../../typings/angular2/angular2.d.ts" />
import {bootstrap} from 'angular2/angular2';
import {Database} from 'app/database/database';
import {AppComponent} from 'app/component/root';

export function start(zipjs:zipjs.Zip) {
	let db = new Database()
	
	db.loadZip('assets/data.zip', zipjs).then(() => {
		console.log(db);
		bootstrap(AppComponent);
	});
}