.PHONY: build clean start stop list package

clean:
	if [ -a ./node_modules/pm2/bin/pm2 ] ; \
    then \
         make stop ; \
    fi;

	rm -rf bower_components
	rm -rf node_modules
	rm -rf public
	rm -rf dist

build: clean
	npm install
	./node_modules/bower/bin/bower install
	./node_modules/brunch/bin/brunch build

production: clean
	npm install
	./node_modules/bower/bin/bower install --production
	./node_modules/brunch/bin/brunch build --production

start:
	./node_modules/pm2/bin/pm2 start pm2-config.json

stop:
	./node_modules/pm2/bin/pm2 stop pm2-config.json
	./node_modules/pm2/bin/pm2 delete pm2-config.json
	./node_modules/pm2/bin/pm2 kill

list:
	./node_modules/pm2/bin/pm2 list

package:
	mkdir dist
	tar -czvf dist/public.tar.gz public