
meteor build ../build &&
cd ../build
tar -zxvf seer.tar.gz &&
cd bundle
forever stop main.js
forever start -a -l ../log main.js
