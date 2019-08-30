include config.mk

HOMEDIR = $(shell pwd)

test:
	node tests/basictests.js

pushall:
	git push origin gh-pages && npm publish

prettier:
	prettier --single-quote --write "**/*.js"

sync:
	rsync -a $(HOMEDIR)/ $(USER)@$(SERVER):/$(APPDIR) --exclude node_modules/ \
		--omit-dir-times --no-perms
