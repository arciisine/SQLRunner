#!/bin/bash
(echo '{' && (cat src/dist/script/queries.js | grep 'SELECT'  | sed -e 's/\\n//g' -e 's/\\t/ /g')  && echo '}') | jq  -r 'map(.) | join("\n")' > sql.txt