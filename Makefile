AT_FOLDER = ../andors-trail/AndorsTrail/

link:
	rm public/[rxdv][arm]* || true
	ln -s "../${AT_FOLDER}res/values" "public/values"
	ln -s "../${AT_FOLDER}res/xml" "public/xml"
	ln -s "../${AT_FOLDER}res/drawable" "public/drawable"
	ln -s "../${AT_FOLDER}res/raw" "public/raw"
copy:
	rm public/[rxdv][arm]* || true
	cp -r "../${AT_FOLDER}res/values" "public/values"
	cp -r "../${AT_FOLDER}res/xml" "public/xml"
	cp -r "../${AT_FOLDER}res/drawable" "public/drawable"
	cp -r "../${AT_FOLDER}res/raw" "public/raw"
gen:
	mkdir public/backgrounds || true
	node bin/generate-map-images.js
gen_test:
	node bin/generate-map-images.js basiliskcave1