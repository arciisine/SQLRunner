#!/bin/bash

rm -rf node_modules/ dist/ src/node_modules/ src/dist/

npm install

gulp scripts stub-crypto

(echo '{' && (cat src/dist/script/queries.js | grep 'SELECT'  | sed -e 's/\\n//g' -e 's/\\t/ /g')  && echo '}') | jq  -r 'map(.) | join("\n")' > sql.txt

mkdir dist
rm -rf dist/tas0302.zip
find src/ | grep -v dist | xargs zip dist/tas0032.zip sql.txt url.txt *.js* README