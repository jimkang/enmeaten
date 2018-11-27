test:
	node tests/basictests.js

pushall:
	git push origin gh-pages && npm publish

prettier:
	prettier --single-quote --write "**/*.js"

