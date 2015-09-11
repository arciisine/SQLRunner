import {ManipulativeStatement} from '../index';

export class CommitStatement extends ManipulativeStatement {
	toString() { return 'COMMIT'; }
}

export class RollbackStatement extends ManipulativeStatement {
	toString() { return 'ROLLBACK'; }
}
