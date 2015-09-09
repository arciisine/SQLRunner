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
"("                                   return 'LEFT_PAREN';
")"                                   return 'RIGHT_PAREN';
"."                                   return 'PERIOD';
":"                                   return 'COLON';
","                                   return 'COMMA';
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
import * as cond from '../query/search-condition';
import * as pred from '../query/predicate';
import * as select from '../query/select';
%}

%%

program: stmt_list
    ;

stmt_list:
		stmt SEMICOLON
    |   stmt SEMICOLON EOF
    |   stmt     EOF
	|	stmt_list stmt SEMICOLON
	;


string_literal:
		STRING_LITERAL { $$ = new literal.StringLiteral($1); }
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
	|	LEFT_PAREN number_literal RIGHT_PAREN 						{ $$ = $2.value }
	;
	
opt_size_and_precision:
		/* empty */
	|	LEFT_PAREN number_literal RIGHT_PAREN 						{ $$ = [$2.value] }
	| 	LEFT_PAREN number_literal COMMA number_literal RIGHT_PAREN 	{ $$ = [$2.value, $4.value] }
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
	|	LEFT_PAREN search_condition RIGHT_PAREN			{ $$ = $2; }
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
	|	atom_commalist COMMA atom	{ $$ = $1; $$ = $$.concat([$3]); }
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
	|	column_ref IS opt_not NULLX									{ $$ = new pred.NullCheckPredicate($1, !!$3); }
	|	scalar_exp opt_not IN subquery								{ $$ = new pred.InQueryPredicate($1, $4, !!$2); }	
	|	scalar_exp opt_not IN LEFT_PAREN atom_commalist RIGHT_PAREN { $$ = new pred.InArrayPredicate($1, $5, !!$2); }
	|	scalar_exp comparison any_all_some subquery					{ $$ = new pred.QueryComparisonPredicate($1, $2, $3, $4); }
	|	EXISTS subquery												{ $$ = new pred.ExistenceCheckPredicate($2); }
	;

subquery:
		LEFT_PAREN select_statement RIGHT_PAREN						{ $$ = $2 }
	|	LEFT_PAREN subquery RIGHT_PAREN								{ $$ = $2 }
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
	|	column_ref									{ $$ = new scalar.ColumnRefExpr($1); }
	|	function_ref								{ $$ = new scalar.FunctionRefExpr($1); }
	|	LEFT_PAREN select_statement RIGHT_PAREN		{ $$ = new scalar.QueryExpr($1); }
	|	LEFT_PAREN scalar_exp RIGHT_PAREN			{ $$ = $2; }
	;
	
selection_scalar:
		scalar_exp									{ $$ = new select.QueryScalarExpr($1); }
	|	scalar_exp alias							{ $$ = new select.QueryScalarExpr($1, $2); }
	|	scalar_exp AS alias							{ $$ = new select.QueryScalarExpr($1, $3); }
	;

selection_commalist:
		selection_scalar							{ $$ = [$1]; }
	|	selection_commalist COMMA selection_scalar	{ $$ = $1; $$ = $$.concat([$3]); }
	;

atom:
		parameter_ref							
	|	literal
	|	USER
	;

parameter_ref:
		parameter							{ $$ = new ref.ParameterRef($1); }
	|	parameter parameter					{ $$ = new ref.ParameterRef($1, $2); }
	|	parameter INDICATOR parameter 		{ $$ = new ref.ParameterRef($1, $3); }
	;

function_ref:
		BUILTIN_FUNCTION LEFT_PAREN ASTERISK RIGHT_PAREN				{ $$ = new scalar.FunctionRefWithAllColumnExpr($1); }
	|	BUILTIN_FUNCTION LEFT_PAREN DISTINCT column_ref RIGHT_PAREN		{ $$ = new scalar.FunctionRefWithDistinctColumnExpr($1, $4);  }
	|	BUILTIN_FUNCTION LEFT_PAREN ALL scalar_exp RIGHT_PAREN			{ $$ = new scalar.FunctionRefWithScalarExpr($1, $4, true); }
	|	BUILTIN_FUNCTION LEFT_PAREN scalar_exp RIGHT_PAREN				{ $$ = new scalar.FunctionRefWithScalarExpr($1, $4); }
	;


	/* miscellaneous */

table:
		IDENTIFIER										{ $$ = new ref.TableRef($1, null); }
	|	IDENTIFIER PERIOD IDENTIFIER					{ $$ = new ref.TableRef($2, $1); }
	;

column_ref:
		IDENTIFIER										{ $$ = new ref.ColumnRef($1); } 						
	|	IDENTIFIER PERIOD IDENTIFIER					{ $$ = new ref.ColumnRef($2, $1); }
	|	IDENTIFIER PERIOD IDENTIFIER PERIOD IDENTIFIER  { $$ = new ref.ColumnRef($3, $2, $1); }
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
		schema_element
	|	schema_element_list schema_element
	;

schema_element:
		base_table_def
	|	view_def
	|	privilege_def
	;

base_table_def:
		CREATE TABLE table LEFT_PAREN base_table_element_commalist RIGHT_PAREN
	;

base_table_element_commalist:
		base_table_element
	|	base_table_element_commalist COMMA base_table_element
	;

base_table_element:
		column_def
	|	table_constraint_def
	;

column_def:
		column data_type column_def_opt_list
	;

column_def_opt_list:
		/* empty */
	|	column_def_opt_list column_def_opt
	;

column_def_opt:
		NOT NULLX
	|	NOT NULLX UNIQUE
	|	NOT NULLX PRIMARY KEY
	|	DEFAULT literal
	|	DEFAULT NULLX
	|	DEFAULT USER
	|	CHECK LEFT_PAREN search_condition RIGHT_PAREN
	|	REFERENCES table
	|	REFERENCES table LEFT_PAREN column_commalist RIGHT_PAREN
	;

table_constraint_def:
		UNIQUE LEFT_PAREN column_commalist RIGHT_PAREN
	|	PRIMARY KEY LEFT_PAREN column_commalist RIGHT_PAREN
	|	FOREIGN KEY LEFT_PAREN column_commalist RIGHT_PAREN
			REFERENCES table
	|	FOREIGN KEY LEFT_PAREN column_commalist RIGHT_PAREN
			REFERENCES table LEFT_PAREN column_commalist RIGHT_PAREN
	|	CHECK LEFT_PAREN search_condition RIGHT_PAREN
	;

column_commalist:
		column
	|	column_commalist COMMA column
	;

view_def:
		CREATE VIEW table opt_column_commalist
		AS select_statement opt_with_check_option
	;

opt_with_check_option:
		/* empty */
	|	WITH CHECK OPTION
	;

opt_column_commalist:
		/* empty */
	|	LEFT_PAREN column_commalist RIGHT_PAREN
	;

privilege_def:
		GRANT privileges ON table TO grantee_commalist
		opt_with_grant_option
	;

opt_with_grant_option:
		/* empty */
	|	WITH GRANT OPTION
	;

privileges:
		ALL PRIVILEGES
	|	ALL
	|	operation_commalist
	;

operation_commalist:
		operation
	|	operation_commalist COMMA operation
	;

operation:
		SELECT
	|	INSERT
	|	DELETE
	|	UPDATE opt_column_commalist
	|	REFERENCES opt_column_commalist
	;


grantee_commalist:
		grantee
	|	grantee_commalist COMMA grantee
	;

grantee:
		PUBLIC
	|	userName
	;

	/* cursor definition */
stmt:
		cursor_def
	;


cursor_def:
		DECLARE cursor CURSOR FOR select_expr_ordered
	;

	/* manipulative statements */

stmt:		manipulative_statement
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
		CLOSE cursor
	;

commit_statement:
		COMMIT WORK
	|	COMMIT
	;

delete_statement_positioned:
		DELETE FROM table_ref opt_join_ref_list WHERE CURRENT OF cursor
	;

delete_statement_searched:
		DELETE FROM table_ref opt_join_ref_list opt_where_clause
	;

fetch_statement:
		FETCH cursor INTO target_commalist
	;

insert_statement:
		INSERT INTO table opt_column_commalist values_or_query_spec
	;

values_or_query_spec:
		VALUES LEFT_PAREN insert_atom_commalist RIGHT_PAREN
	|	select_statement
	;

insert_atom_commalist:
		insert_atom
	|	insert_atom_commalist COMMA insert_atom
	;

insert_atom:
		atom
	|	NULLX
	;

open_statement:
		OPEN cursor
	;

rollback_statement:
		ROLLBACK WORK
	|	ROLLBACK
	;

select_into_statement:
    SELECT opt_all_distinct selection
    INTO target_commalist
    table_exp
	opt_order_by_clause
    ;

select_statement:
    SELECT opt_all_distinct selection
    table_exp
    ;

opt_all_distinct:
		/* empty */
	|	ALL
	|	DISTINCT
	;

update_statement_positioned:
		UPDATE table opt_join_ref_list SET assignment_commalist
		WHERE CURRENT OF cursor
	;

assignment_commalist:
	|	assignment
	|	assignment_commalist COMMA assignment
	;

assignment:
		column EQUAL scalar_exp
	|	column EQUAL NULLX
	;

update_statement_searched:
		UPDATE table opt_join_ref_list SET assignment_commalist opt_where_clause
	;

target_commalist:
		target
	|	target_commalist COMMA target
	;

target:
		parameter_ref
	;

opt_where_clause:
		/* empty */
	|	where_clause
	;

	/* query expressions */

select_expr_op:
		UNION
	|	UNION ALL
	|	INTERSECTION
	|	EXCEPT
	;

select_expr_ordered:
	select_expr opt_order_by_clause
	;

select_expr:
		select_statement
	|	select_expr select_expr_op select_term
	| 	LEFT_PAREN select_expr RIGHT_PAREN
	;

select_term:
		select_statement
	| 	LEFT_PAREN select_term RIGHT_PAREN
	;


selection:
		selection_commalist
	|	ASTERISK
	;

table_exp:
		from_clause
		opt_where_clause
		opt_group_by_clause
		opt_having_clause
	;

from_clause:
		FROM dynamic_table_ref_commalist
		opt_join_ref_list
	;

opt_join_outer:
		/* empty */
	|	OUTER
	;

join_type:
		LEFT opt_join_outer
	|	RIGHT opt_join_outer
	|	FULL opt_join_outer
	|	INNER						
	;
	
opt_join_on_clause:
		/* empty */
	|	ON search_condition
	;

join_ref:
	join_type JOIN dynamic_table_ref opt_join_on_clause
	;

join_ref_list:
		join_ref
	|	join_ref_list join_ref
	;
	
opt_join_ref_list:
		/* empty */
	|	join_ref_list
	;
	
dynamic_table_ref_commalist:
		dynamic_table_ref
	|	dynamic_table_ref_commalist COMMA dynamic_table_ref
	;
	
opt_alias:
		/* empty */
	|	AS range_variable
	|	range_variable
	;

table_ref:
		table opt_alias                        { $$ = $1; $$.alias = $2; }
	;

dynamic_table_ref:
		table_ref
	|   subquery opt_alias
	;


where_clause:
		WHERE search_condition
	;

opt_group_by_clause:
		/* empty */
	|	GROUP BY column_ref_commalist
	;

column_ref_spec:
		column_ref
	|	number_literal
	;

column_ref_commalist:
		column_ref_spec
	|	column_ref_commalist COMMA column_ref_spec
	;

opt_having_clause:
		/* empty */
	|	HAVING search_condition
	;

opt_order_by_clause:
		/* empty */
	|	ORDER BY ordering_spec_commalist
	;

ordering_spec_commalist:
		ordering_spec
	|	ordering_spec_commalist COMMA ordering_spec
	;

ordering_spec:
		number_literal opt_asc_desc
	|	column_ref opt_asc_desc
	;

opt_asc_desc:
		/* empty */
	|	ASC
	|	DESC
	;

	/* embedded condition things */
stmt:		
		WHENEVER NOT FOUND when_action
	|	WHENEVER SQLERROR when_action
	;

when_action:	
		GOTO IDENTIFIER
	|	CONTINUE
	;