import {Statement} from '../index';

export class Query extends Statement {}

class SelectQuery extends Query {
	
}

class SelectWritableQuery extends SelectQuery {
	
}

class UpdateQuery extends Query {
	
}

class InsertQuery extends Query {
	
}

class DeleteQuery extends Query {
	
}