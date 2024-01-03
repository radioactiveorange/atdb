LOCAL_AT_FOLDER = ../andors-trail/AndorsTrail/
GH_AT_FOLDER = ./andors-trail

link:
	rm public/[rxdv][arm]* || true
	ln -s "../${LOCAL_AT_FOLDER}res/values" "public/values"
	ln -s "../${LOCAL_AT_FOLDER}res/xml" "public/xml"
	ln -s "../${LOCAL_AT_FOLDER}res/drawable" "public/drawable"
	ln -s "../${LOCAL_AT_FOLDER}res/raw" "public/raw"
copy:
	rm public/[rxdv][arm]* || true
	cp -r "${GH_AT_FOLDER}/AndorsTrail/res/values" "public/values"
	cp -r "${GH_AT_FOLDER}/AndorsTrail/res/xml" "public/xml"
	cp -r "${GH_AT_FOLDER}/AndorsTrail/res/drawable" "public/drawable"
	cp -r "${GH_AT_FOLDER}/AndorsTrail/res/raw" "public/raw"
gen:
	mkdir public/backgrounds || true
	node bin/generate-map-images.js
gen_test:
	node bin/generate-map-images.js basiliskcave1