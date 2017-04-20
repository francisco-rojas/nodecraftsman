# nodecraftsman
Code from the Node Craftman book (http://www.nodebeginner.org/)

Run tests:
    ./node_modules/.bin/jasmine-node --verbose ./spec/
    ./node_modules/.bin/jasmine-node --verbose --captureExceptions ./spec/

Add migration:
    ./node_modules/.bin/db-migrate create createKeywordAndCategoryTable --env test

Run migration:
    ./node_modules/.bin/db-migrate up --env test
    
Run migrations + specs:
./node_modules/.bin/db-migrate up --env test && ./node_modules/.bin/jasmine-node --verbose --captureExceptions ./spec/
