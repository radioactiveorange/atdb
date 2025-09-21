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
	node bin/generate-map-images-improved.js
gen_test:
	node bin/generate-map-images-improved.js basiliskcave1
gen_small:
	mkdir public/backgrounds || true
	node bin/generate-map-images-improved.js --batch-size 3 --delay 2000
get_version:
	node bin/get-version.js
update_map_list:
	node bin/generate-map-list.js
parse_world:
	node bin/parse-world-coordinates.js
setup_maps: get_version update_map_list parse_world