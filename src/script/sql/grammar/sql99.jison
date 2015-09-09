/* Derived from http://yaxx.googlecode.com/svn/trunk/sql/scn2.l */

%lex

%%
"ALL"                                 return 'ALL';
"AND"                                 return 'AND';
"ANY"                                 return 'ANY';
"AS"                                  return 'AS';
"ASC"                                 return 'ASC';
"AUTHORIZATION"                       return 'AUTHORIZATION';
"BETWEEN"                             return 'BETWEEN';
"BIGINT"							  return 'BIGINT';
"BINARY"							  return 'BINARY';
"BOOLEAN"							  return 'BOOLEAN';
"BY"                                  return 'BY';
CHAR(ACTER)?                          return 'CHARACTER';
"CHECK"                               return 'CHECK';
"CLOSE"                               return 'CLOSE';
"COMMIT"                              return 'COMMIT';
"CONTINUE"                            return 'CONTINUE';
"CREATE"                              return 'CREATE';
"CURRENT"                             return 'CURRENT';
"CURSOR"                              return 'CURSOR';
"DATE"								  return 'DATE';
"DECIMAL"                             return 'DECIMAL';
"DECLARE"                             return 'DECLARE';
"DEFAULT"                             return 'DEFAULT';
"DELETE"                              return 'DELETE';
"DESC"                                return 'DESC';
"DISTINCT"                            return 'DISTINCT';
"DOUBLE"                              return 'DOUBLE';
"ESCAPE"                              return 'ESCAPE';
"EXCEPT"                              return 'EXCEPT';
"EXISTS"                              return 'EXISTS';
"FETCH"                               return 'FETCH';
"FLOAT"                               return 'FLOAT';
"FOR"                                 return 'FOR';
"FOREIGN"                             return 'FOREIGN';
"FOUND"                               return 'FOUND';
"FROM"                                return 'FROM';
"FULL"                                return 'FULL';
GO[ \t]TO                             return 'GOTO';
"GRANT"                               return 'GRANT';
"GROUP"                               return 'GROUP';
"HAVING"                              return 'HAVING';
"IN"                                  return 'IN';
"INDICATOR"                           return 'INDICATOR';
"INNER"                               return 'INNER';
"INSERT"                              return 'INSERT';
INT(EGER)?                            return 'INTEGER';
"INTERSECTION"						  return 'INTERSECTION';
"INTO"                                return 'INTO';
"IS"                                  return 'IS';
"JOIN"                                return 'JOIN';
"KEY"                                 return 'KEY';
"LANGUAGE"                            return 'LANGUAGE';
"LIKE"                                return 'LIKE';
"LEFT"                                return 'LEFT';
"NOT"                                 return 'NOT';
"NULL"                                return 'NULLX';
"NUMERIC"                             return 'NUMERIC';
"OF"                                  return 'OF';
"ON"                                  return 'ON';
"OPEN"                                return 'OPEN';
"OPTION"                              return 'OPTION';
"OR"                                  return 'OR';
"ORDER"                               return 'ORDER';
"OUTER"                               return 'OUTER';
"PRECISION"                           return 'PRECISION';
"PRIMARY"                             return 'PRIMARY';
"PRIVILEGES"                          return 'PRIVILEGES';
"PROCEDURE"                           return 'PROCEDURE';
"PUBLIC"                              return 'PUBLIC';
"REAL"                                return 'REAL';
"REFERENCES"                          return 'REFERENCES';
"RIGHT"                               return 'RIGHT';
"ROLLBACK"                            return 'ROLLBACK';
"SCHEMA"                              return 'SCHEMA';
"SELECT"                              return 'SELECT';
"SET"                                 return 'SET';
"SMALLINT"                            return 'SMALLINT';
"SOME"                                return 'SOME';
"SQLCODE"                             return 'SQLCODE';
"TABLE"                               return 'TABLE';
"TIME"								  return 'TIME';
"TIMESTAMP"							  return 'TIMESTAMP';
"TO"                                  return 'TO';
"UNION"                               return 'UNION';
"UPDATE"                              return 'UPDATE';
"USER"                                return 'USER';
"VALUES"                              return 'VALUES';
"VARBINARY"							  return 'VARBINARY';
"VARCHAR"							  return 'VARCHAR';
"VARYING"							  return 'VARYING';
"VIEW"                                return 'VIEW';
"WHENEVER"                            return 'WHENEVER';
"WHERE"                               return 'WHERE';
"WITH"                                return 'WITH';
"WORK"                                return 'WORK';

\'[^'\n]*\'                           return 'STRING_LITERAL';
\d+|\.\d+|\d\.\d*                     return 'NUMBER_LITERAL';
\d+[eE][+-]?\d+|\d\.\d*[eE][+-]?\d+|\.\d*[eE][+-]?\d+ return 'SCIENTIFIC_NUMBER_LITERAL';

[A-Za-z][A-Za-z0-9_]*                {
	if (yytext.match(/^(ABS|AVG|MIN|MAX|SUM|COUNT|FLOOR|LOWER|UPPER)$/i)) {
		return 'BUILTIN_FUNCTION';
	} else {
		return 'IDENTIFIER';
	}
}

"--.*"                                return 'COMMENTS';

:[A-Za-z][A-Za-z0-9_]*				  return 'PARAMETER';

'"'                                   return 'DOUBLE_QUOTE';
"%"                                   return 'PERCENT';
"&"                                   return 'AMPERSAND';
"'"                                   return 'QUOTE';
"("                                   return '(';
")"                                   return ')';
"."                                   return 'PERIOD';
":"                                   return 'COLON';
","                                   return ',';
";"                                   return 'SEMICOLON';
"|"                                   return 'VERTICAL_BAR';
"?"                                   return 'QUESTION_MARK';
"^"                                   return 'CARET';

"*"                                   return 'ASTERISK';
"/"                                   return 'DIVIDE';
"+"                                   return 'PLUS';
"-"                                   return 'MINUS';
"="                                   return 'EQUAL';
"<>"                                  return 'NOT_EQUAL';
"<"                                   return 'LESS_THAN';
">"                                   return 'GREATER_THAN';
"<="                                  return 'LESS_THAN_OR_EQUAL';
">="                                  return 'GREATER_THAN_OR_EQUAL';

[ \r\t]+                              /* Skip */;

<<EOF>>                               return 'EOF';

/lex

/* Derived from http://yaxx.googlecode.com/svn/trunk/sql/sql2.y */

%left OR
%left AND
%left NOT
%left EQUAL NOT_EQUAL LESS_THAN GREATER_THAN LESS_THAN_OR_EQUAL GREATER_THAN_OR_EQUAL
%left PLUS MINUS
%left ASTERISK DIVIDE
%left UNION INTERSECTION EXCEPT
%nonassoc UMINUS

%start program

%{
import * as literal from '../common/literal';
import * as ref from '../common/ref';
import * as scalar from '../common/scalar';
import * as columnType from '../schema/column-type';
import * as grant from '../schema/grant';
import * as constraint from '../schema/constraint';
import * as create from '../schema/create';
import * as cond from '../query/search-condition';
import * as pred from '../query/predicate';
import * as select from '../query/select';
import * as insert from '../query/insert';
import * as update from '../query/update';
import * as del from '../query/delete';
import * as cursor from '../statement/cursor';
import * as transaction from '../statement/transaction';
import * as order from '../query/orderby';
import * as when from '../statement/when';
%}

%%

opt_semicolon:
		/** empty **/
	|	SEMICOLON
	;
	
opt_eof:
		/** empty **/
	|	EOF
	;

program: 
	stmt_list opt_semicolon opt_eof
   	;

stmt_list:
    	stmt 							{ $$ = [$1] }
	|	stmt_list SEMICOLON stmt 		{ $$ = $1; $$ = $$.concat([$3]); }	
	;

string_literal:
		STRING_LITERAL 					{ $$ = new literal.StringLiteral($1); }
	;
	
number_literal:
		NUMBER_LITERAL					{ $$ = new literal.NumberLiteral(parseFloat($1));  }
	;

scientific_number_literal:
		SCIENTIFIC_NUMBER_LITERAL		{ $$ = literal.ScientificNumberLiteral.fromString($1); }
	;

	/* the various things you can name */
literal:
		scientific_literal					
	|	number_literal
	|	scientific_number_literal
	;	
	
column:		IDENTIFIER
	;

cursor:		IDENTIFIER
	;

parameter:
		PARAMETER	/* :name handled in parser */
	;

range_variable:	IDENTIFIER
	;

userName:		IDENTIFIER
	;
	
alias:		IDENTIFIER
	;

		/* data types */

opt_size:
		/* empty */
	|	'(' number_literal ')' 						{ $$ = $2.value }
	;
	
opt_size_and_precision:
		/* empty */
	|	'(' number_literal ')' 						{ $$ = [$2.value] }
	| 	'(' number_literal ',' number_literal ')' 	{ $$ = [$2.value, $4.value] }
	;
	
opt_varying:
		/* empty */
	|	VARYING														{ $$ = true }				
	;

opt_timezone:
		/* empty */
	|	WITH TIMEZONE												{ $$ = true }
	;

data_type:
		CHARACTER opt_varying opt_size							{ $$ = new columnType.CharacterColumnType($3, !!$2) }
	|	VARCHARACTER  opt_size									{ $$ = new columnType.CharacterColumnType($2, true) }
	|	BINARY opt_varying opt_size								{ $$ = new columnType.BinaryColumnType($3, !!$2) }
	|	VARBINARY  opt_size										{ $$ = new columnType.BinaryColumnType($2, true) }
	|	NUMERIC	opt_size_and_precision							{ $$ = new columnType.NumericColumnType($2 && $2[0], $2 && $2[1]); }
	|	DECIMAL opt_size_and_precision							{ $$ = new columnType.DecimalColumnType($2 && $2[0], $2 && $2[1]); }
	|	INTEGER opt_size										{ $$ = new columnType.IntegerColumnType($2); }
	|	SMALLINT												{ $$ = new columnType.SmallIntegerColumnType(); }
	|	BIGINT													{ $$ = new columnType.BigIntegerColumnType(); }
	|	BOOLEAN													{ $$ = new columnType.BooleanColumnType(); }		
	|	FLOAT opt_size											{ $$ = new columnType.FloatColumnType($2); }
	|	REAL													{ $$ = new columnType.RealColumnType(); }				
	|	DOUBLE PRECISION										{ $$ = new columnType.DoubleColumnType(); }
	|	DATE opt_size opt_timezone								{ $$ = new columnType.DateColumnType($2, $3); }
	|	TIME opt_size opt_timezone								{ $$ = new columnType.TimeColumnType($2, $3); }
	|	TIMESTAMP opt_size opt_timezone							{ $$ = new columnType.TimestampColumnType($2, $3); }
	;

	/* search conditions */

search_condition:										
	|	search_condition OR search_condition			{ $$ = new cond.BinarySearchCondition($1, cond.SearchConditionOperator.AND, $3) }
	|	search_condition AND search_condition			{ $$ = new cond.BinarySearchCondition($1, cond.SearchConditionOperator.OR, $3) }
	|	NOT search_condition							{ $$ = new cond.NotSearchCondition($2); }
	|	'(' search_condition ')'						{ $$ = $2; }
	|	predicate										{ $$ = $1; }
	;

opt_not:
		/* empty */
	|	NOT							{ $$ = true; }
	;

opt_escape:
		/* empty */
	|	ESCAPE string_literal		{ $$ = $2 }
	;

atom_commalist:
		atom						{ $$ = [$1]; }
	|	atom_commalist ',' atom		{ $$ = $1; $$ = $$.concat([$3]); }
	;

comparison:
    	EQUAL					{ $$ = scalar.ComparisonExprOperator.EQUAL }
    | 	NOT_EQUAL				{ $$ = scalar.ComparisonExprOperator.NOT_EQUAL }
    | 	LESS_THAN				{ $$ = scalar.ComparisonExprOperator.LESS_THAN }
    | 	GREATER_THAN			{ $$ = scalar.ComparisonExprOperator.GREATER_THAN }
    | 	LESS_THAN_EQUAL			{ $$ = scalar.ComparisonExprOperator.LESS_THAN_EQUAL }
    | 	GREATER_THAN_EQUAL		{ $$ = scalar.ComparisonExprOperator.GREATER_THAN_EQUAL }
    ;


any_all_some:
		ANY						{ $$ = pred.QueryComparisonOperator.ANY;  }
	|	ALL						{ $$ = pred.QueryComparisonOperator.ALL; }
	|	SOME					{ $$ = pred.QueryComparisonOperator.SOME; }
	;

predicate:
		scalar_exp comparison scalar_exp							{ $$ = new pred.ComparisonPredicate($1, $2, $3); }
	|	scalar_exp opt_not BETWEEN scalar_exp AND scalar_exp 		{ $$ = new pred.BetweenPredicate($1, $4, $5, !!$2); }
	|	scalar_exp opt_not LIKE string_literal opt_escape 			{ $$ = new pred.LikePredicate($1, $3, $4, !!$2); }
	|	named_column_ref IS opt_not NULLX							{ $$ = new pred.NullCheckPredicate($1, !!$3); }
	|	scalar_exp opt_not IN subquery								{ $$ = new pred.InQueryPredicate($1, $4, !!$2); }	
	|	scalar_exp opt_not IN '(' atom_commalist ')'				 { $$ = new pred.InArrayPredicate($1, $5, !!$2); }
	|	scalar_exp comparison any_all_some subquery					{ $$ = new pred.QueryComparisonPredicate($1, $2, $3, $4); }
	|	EXISTS subquery												{ $$ = new pred.ExistenceCheckPredicate($2); }
	;

subquery:
		'(' select_statement ')'						{ $$ = $2 }
	|	'(' subquery ')'								{ $$ = $2 }
	;

	/* scalar expressions */

scalar_exp:
		scalar_exp PLUS scalar_exp					{ $$ = new scalar.BinaryExpr($1, scalar.BinaryExprOperator.PLUS, $2); }
	|	scalar_exp MINUS scalar_exp					{ $$ = new scalar.BinaryExpr($1, scalar.BinaryExprOperator.MINUS, $2); }
	|	scalar_exp ASTERISK scalar_exp				{ $$ = new scalar.BinaryExpr($1, scalar.BinaryExprOperator.MULTIPLY, $2); }
	|	scalar_exp DIVIDE scalar_exp				{ $$ = new scalar.BinaryExpr($1, scalar.BinaryExprOperator.DIVIDE, $2); }
	|	PLUS scalar_exp %prec UMINUS				{ $$ = new scalar.UnaryExpr($1, scalar.UnaryExprOperator.PLUS); }
	|	MINUS scalar_exp %prec UMINUS				{ $$ = new scalar.UnaryExpr($1, scalar.UnaryExprOperator.MINUS); }
	|	atom										{ $$ = new scalar.AtomExpr($1); }
	|	named_column_ref							{ $$ = new scalar.NamedColumnRefExpr($1); }
	|	function_ref								{ $$ = new scalar.FunctionRefExpr($1); }
	|	'(' select_statement ')'					{ $$ = new scalar.QueryExpr($1); }
	|	'(' scalar_exp ')'							{ $$ = $2; }
	;
	
selection_scalar:
		scalar_exp									{ $$ = new select.QueryScalarExpr($1); }
	|	scalar_exp alias							{ $$ = new select.QueryScalarExpr($1, $2); }
	|	scalar_exp AS alias							{ $$ = new select.QueryScalarExpr($1, $3); }
	;

selection_commalist:
		selection_scalar							{ $$ = [$1]; }
	|	selection_commalist ',' selection_scalar	{ $$ = $1; $$ = $$.concat([$3]); }
	;

atom:
		parameter_ref								{ $$ = $1; }
	|	literal										{ $$ = $1; }
	;

parameter_ref:
		parameter							{ $$ = new ref.ParameterRef($1); }
	|	parameter parameter					{ $$ = new ref.ParameterRef($1, $2); }
	|	parameter INDICATOR parameter 		{ $$ = new ref.ParameterRef($1, $3); }
	;

function_ref:
		BUILTIN_FUNCTION '(' ASTERISK ')'					{ $$ = new scalar.FunctionRefWithAllColumnExpr($1); }
	|	BUILTIN_FUNCTION '(' DISTINCT named_column_ref ')'	{ $$ = new scalar.FunctionRefWithDistinctColumnExpr($1, $4);  }
	|	BUILTIN_FUNCTION '(' ALL scalar_exp ')'				{ $$ = new scalar.FunctionRefWithScalarExpr($1, $4, true); }
	|	BUILTIN_FUNCTION '(' scalar_exp ')'					{ $$ = new scalar.FunctionRefWithScalarExpr($1, $4); }
	;


	/* miscellaneous */

table:
		IDENTIFIER										{ $$ = new ref.TableRef($1, null); }
	|	IDENTIFIER PERIOD IDENTIFIER					{ $$ = new ref.TableRef($2, $1); }
	;

named_column_ref:
		IDENTIFIER										{ $$ = new ref.NamedColumnRef($1); } 						
	|	IDENTIFIER PERIOD IDENTIFIER					{ $$ = new ref.NamedColumnRef($2, $1); }
	|	IDENTIFIER PERIOD IDENTIFIER PERIOD IDENTIFIER  { $$ = new ref.NamedColumnRef($3, $2, $1); }
	;


column_ref_spec:
		named_column_ref								{ $$ = $1; }
	|	number_literal									{ $$ = new ref.NumberColumnRef($1.value); }
	;

	/* schema definition language */
stmt:		schema
	;

schema:
		CREATE SCHEMA AUTHORIZATION userName opt_schema_element_list
	;

opt_schema_element_list:
		/* empty */
	|	schema_element_list
	;

schema_element_list:
		schema_element								{ $$ = [$1]; }
	|	schema_element_list schema_element			{ $$ = $1; $$ = $$.concat([$2]); }
	;

schema_element:
		base_table_def
	|	view_def
	|	privilege_def
	;

base_table_def:
		CREATE TABLE table '(' base_table_element_commalist ')'	{ $$ = new create.TableSchema($3, $5); }
	;

base_table_element_commalist:
		base_table_element										{ $$ = [$1]; }		
	|	base_table_element_commalist ',' base_table_element		{ $$ = $1; $$ = $$.concat([$3]); }
	;

base_table_element:
		column_def												{ $$ = $1; }
	|	table_constraint_def									{ $$ = $1; }	
	;

column_def:
		column data_type column_def_opt_list					{ $$ = new create.ColumnSchema($1, $2, $3); }
	;

column_def_opt_list:
		/* empty */												{ $$ = []; }
	|	column_def_opt_list column_def_opt						{ $$ = $1; $$ = $$.concat([$2]); }
	;

column_def_opt:
		NOT NULLX												{ $$ = new constraint.NotNullConstraint(); }
	|	NULLX													{ $$ = new constraint.NullConstraint(); }
	|	UNIQUE													{ $$ = new constraint.UniqueKeyConstraint(); }
	|	PRIMARY KEY												{ $$ = new constraint.PrimaryKeyConstraint(); }
	|	DEFAULT literal											{ $$ = new constraint.DefaultConstraint($1); }
	|	DEFAULT NULLX											{ $$ = new constraint.DefaultNullConstraint(); }
	|	CHECK '(' search_condition ')'							{ $$ = new constraint.CheckConstraint($3); }
	|	REFERENCES table										{ $$ = new constraint.ForeignKeyConstraint($2); }	
	|	REFERENCES table '(' column_commalist ')'				{ $$ = new constraint.ForeignKeyConstraint($2, $4); }
	;

table_constraint_def:
		UNIQUE '(' column_commalist ')'							{ $$ = new constraint.UniqueKeyTableConstraint($3); }
	|	PRIMARY KEY '(' column_commalist ')'					{ $$ = new constraint.PrimaryKeyTableConstraint($4); }
	|	FOREIGN KEY '(' column_commalist ')' REFERENCES table	{ $$ = new constraint.ForeignKeyTableConstraint($4, $7); }
	|	FOREIGN KEY '(' column_commalist ')' REFERENCES table '(' column_commalist ')'
	{ $$ = new constraint.ForeignKeyTableConstraint($4, $7, $9); }
	|	CHECK '(' search_condition ')'							{ $$ = new constraint.CheckTableConstraint($3); }
	;

column_commalist:
		column								{ $$ = [$1] }
	|	column_commalist ',' column			{ $$ = $1; $$ = $$.concat([$3]); }
	;

opt_column_commalist:
		/* empty */
	|	'(' column_commalist ')'			{ $$ = $2; }
	;

view_def:
		CREATE VIEW table opt_column_commalist AS select_statement opt_with_check_option
		{
			$$ = new create.ViewSchema($3, $4, $6, !!$7)
		}
	;

opt_with_check_option:
		/* empty */
	|	WITH CHECK OPTION								{ $$ = true; }
	;

privilege_def:
		GRANT privileges ON table TO grantee_commalist
		opt_with_grant_option
	;

opt_with_grant_option:
		/* empty */
	|	WITH GRANT OPTION								{ $$ = true; }	
	;

privileges:
		ALL PRIVILEGES
	|	ALL
	|	operation_commalist
	;

operation_commalist:
		operation										{ $$ = [$1]; }
	|	operation_commalist ',' operation				{ $$ = $1; $$ = $$.concat([$3]); }
	;

operation:
		SELECT
	|	INSERT
	|	DELETE
	|	UPDATE opt_column_commalist
	|	REFERENCES opt_column_commalist
	;


grantee_commalist:
		grantee											{ $$ = [$1]; }
	|	grantee_commalist ',' grantee					{ $$ = $1; $$ = $$.concat([$3]); }
	;

grantee:
		PUBLIC											{ $$ = new grant.PublicGrantee(); }		
	|	userName										{ $$ = new grant.UserGrantee($1); }
	;

	/* cursor definition */
stmt:
		DECLARE cursor CURSOR FOR select_expr_ordered		{ $$ = new cursor.CursorDefinitionStatement($2, $5); }
	;

	/* manipulative statements */

stmt:		manipulative_statement
	;

opt_work:
		/** empty **/
	|	WORK				{ $$ = true; }
	;

manipulative_statement:
		close_statement
	|	commit_statement
	|	delete_statement_positioned
	|	delete_statement_searched
	|	fetch_statement
	|	insert_statement
	|	open_statement
	|	rollback_statement
	|	select_expr_ordered
	|	select_into_statement
	|	update_statement_positioned
	|	update_statement_searched
	;

close_statement:
		CLOSE cursor													{ $$ = new cursor.CloseStatement($2); }
	;

commit_statement:
		COMMIT opt_work													{ $$ = new transaction.CommitStatement(); }
	;

delete_statement_positioned:
		DELETE FROM table_ref opt_join_ref_list WHERE CURRENT OF cursor	{ $$ = new cursor.DeleteCursorQuery($3, $4, $8); }
	;

delete_statement_searched:
		DELETE FROM table_ref opt_join_ref_list opt_where_clause		{ $$ = new del.DeleteQuery($3, $4, $5); } 
	;

fetch_statement:
		FETCH cursor INTO target_commalist								{ $$ = new cursor.FetchStatement($2, $4); }
	;

insert_statement:
		INSERT INTO table opt_column_commalist values_or_query_spec 	{ $$ = new insert.InsertQuery($3, $4, $5); }
	;

values_or_query_spec:
		VALUES '(' insert_atom_commalist ')'	 	{ $$ = new insert.AtomValues($3); }
	|	select_statement							{ $$ = new insert.QueryValues($1); }
	;

insert_atom:
		atom	
	|	NULLX								
	;

insert_atom_commalist:
		insert_atom										{ $$ = [$1]; }
	|	insert_atom_commalist ',' insert_atom			{ $$ = $1; $$ = $$.concat([$3]);  }
	;

open_statement:
		OPEN cursor			{ $$ = new cursor.OpenStatement($2); }
	;

rollback_statement:
		ROLLBACK opt_work	{ $$ = new transaction.RollbackStatement(); }
	;

opt_all_distinct:
		/* empty */
	|	ALL
	|	DISTINCT
	;

select_into_statement:
    SELECT opt_all_distinct selection
    INTO table_ref
	FROM dynamic_table_ref_commalist					
	opt_join_ref_list
	opt_where_clause
	opt_group_by_clause
	opt_having_clause
	opt_order_by_clause	
	{ 
		$$ = new select.WritableSelectQuery(new select.SingleSelectQuery($3, $7, $8, $9, $10, $2), $5, $12);
	}
    ;

select_statement:
    SELECT opt_all_distinct selection
	FROM dynamic_table_ref_commalist					
	opt_join_ref_list
	opt_where_clause
	opt_group_by_clause
	opt_having_clause					
	{ 
		$$ = new select.SingleSelectQuery($3, $5, $6, $7, $8, $2); 
	}			
    ;

assignment_commalist:
	|	assignment								{ $$ = [$1]; }
	|	assignment_commalist ',' assignment		{ $$ = $1; $$ = $$.concat([$3]); }
	;

assignment:
		column EQUAL scalar_exp					{ $$ = new update.Assignment($1, $3); }
	|	column EQUAL NULLX						{ $$ = new update.Assignment($1, null); }
	;

update_statement_positioned:
		UPDATE table_ref opt_join_ref_list SET assignment_commalist
		WHERE CURRENT OF cursor 
		{
			$$ = new cursor.UpdateCursorQuery($2, $3, $5, $9); 
		}
	;

update_statement_searched:
		UPDATE table_ref opt_join_ref_list SET assignment_commalist opt_where_clause
		{
			$$ = new update.UpdateQuery($2, $3, $5, $6);
		}
	;

target_commalist:
		target									{ $$ = [$1]; }		
	|	target_commalist ',' target				{ $$ = $1; $$ = $$.concat([$3]); }
	;

target:
		parameter_ref							{ $$ = $1; }
	;

	/* query expressions */

select_expr_op:
		UNION												{ $$ = select.BinaryQueryOperator.UNION; }		
	|	UNION ALL											{ $$ = select.BinaryQueryOperator.UNION; }
	|	INTERSECTION										{ $$ = select.BinaryQueryOperator.INTERSECTION; }
	|	EXCEPT												{ $$ = select.BinaryQueryOperator.EXCEPT; }
	;

select_expr_ordered:
	select_expr opt_order_by_clause							{ $$ = new select.SortableSelectQuery($1, $2); }
	;

select_expr:
		select_statement									{ $$ = $1; }
	|	select_expr select_expr_op select_term				{ $$ = new select.BinarySelectQuery($1, $2, $3); }
	| 	'(' select_expr ')'									{ $$ = $1; }
	;

select_term:
		select_statement									{ $$ = $1; }	
	| 	'(' select_term ')'									{ $$ = $1; }
	;


selection:
		selection_commalist									{ $$ = new select.ScalarSelection($1); }
	|	ASTERISK											{ $$ = new select.AllSelection(); }
	;


opt_join_outer:
		/* empty */
	|	OUTER
	;

join_type:
		LEFT opt_join_outer									{ $$ = select.JoinType.LEFT; }
	|	RIGHT opt_join_outer								{ $$ = select.JoinType.RIGHT; }
	|	FULL opt_join_outer									{ $$ = select.JoinType.FULL; }	
	|	INNER												{ $$ = select.JoinType.INNER; }
	;
	
opt_join_on_clause:
		/* empty */
	|	ON search_condition									{ $$ = $2; }
	;

join_ref:
	join_type JOIN dynamic_table_ref opt_join_on_clause		{ $$ = new select.JoinRef($1, $2, $3); }
	;

join_ref_list:
		join_ref						{ $$ = [$1]; }
	|	join_ref_list join_ref			{ $$ = $1; $$ = $$.concat([$2]); }
	;
	
opt_join_ref_list:
		/* empty */
	|	join_ref_list					{ $$ = $1; }
	;
	
dynamic_table_ref_commalist:
		dynamic_table_ref										{ $$ = [$1]; }
	|	dynamic_table_ref_commalist ',' dynamic_table_ref		{ $$ = $1; $$ = $$.concat([$3]); }
	;
	
opt_alias:
		/* empty */
	|	AS range_variable						{ $$ = $2; }
	|	range_variable							{ $$ = $1; }
	;

table_ref:
		table opt_alias                        	{ $$ = new select.NamedFromTableRef($1, $2); }
	;

dynamic_table_ref:
		table_ref								{ $$ = $1; }
	|   subquery opt_alias						{ $$ = new select.QueryFromTableRef($1, $2); }
	;


opt_where_clause:
		/* empty */
	|	WHERE search_condition									{ $$ = $2; }
	;

opt_group_by_clause:
		/* empty */
	|	GROUP BY column_ref_spec_commalist						{ $$ = $2; }
	;

column_ref_spec_commalist:
		column_ref_spec											{ $$ = [$1]; }
	|	column_ref_spec_commalist ',' column_ref_spec			{ $$ = $1; $$ = $$.concat([$3]); }
	;

opt_having_clause:
		/* empty */
	|	HAVING search_condition									{ $$ = $2; }
	;

opt_order_by_clause:
		/* empty */
	|	ORDER BY ordering_spec_commalist						{ $$ = $3; }
	;

ordering_spec_commalist:
		ordering_spec											{ $$ = [$1]; }
	|	ordering_spec_commalist ',' ordering_spec				{ $$ = $1; $$ = $$.concat([$3]); }
	;

ordering_spec:
		column_ref_spec opt_asc_desc							{ $$ = new order.OrderBy($1, $2); }
	;

opt_asc_desc:
		/* empty */												
	|	ASC														{ $$ = order.OrderByDirection.ASC; }
	|	DESC													{ $$ = order.OrderByDirection.DESC; }
	;

	/* embedded condition things */
stmt:		
		WHENEVER NOT FOUND when_action							{ $$ = new when.WheneverNotFound($4); }		
	|	WHENEVER SQLERROR when_action							{ $$ = new when.WheneverSQLError($3); }
	;

when_action:	
		GOTO IDENTIFIER											{ $$ = new when.GotoWhenAction($2); }
	|	CONTINUE												{ $$ = new when.ContinueWhenAction(); }
	;
	