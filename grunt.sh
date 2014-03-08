#!/bin/bash

set -e

PACKAGE="";
VERSION="";

usage() {
  cat <<EOF
usage:
  $PROG -p package -v version

OPTIONS:
  -p   package
  -v   version
  -h   help
EOF
}

while getopts "h:p:v:" OPTION
do
  case $OPTION in
  	p)
		PACKAGE=$OPTARG
    	;;
    v)
    	VERSION=$OPTARG
    	;;
    h)
		usage
		exit 1
		;;
  esac
done

if [ ! -n $PACKAGE -o ! -n $VERSION ]; then
	echo 'error param, package: '$PACKAGE', version: '$VERSION;exit 1;
fi

if [ $VERSION = "debug" ]; then
	echo 'error param, version cannot be named '$VERSION;exit 1;
fi

DEBUG_DIR='../'$PACKAGE'/application/views/static/debug'
COMPRESS_DIR='../'$PACKAGE'/application/views/static/'$VERSION
if [ ! -d $DEBUG_DIR ]; then
	echo 'error dir: '$DEBUG_DIR;exit 1;
else
	echo "rm -rf $COMPRESS_DIR";
	#rm -rf $COMPRESS_DIR
fi

echo '{"package":"'$PACKAGE'","version": "'$VERSION'"}' > ./package.json

grunt compress:$PACKAGE:$VERSION

echo -e '<?php\n$config["version"]=date("YmdHi");\n$config["swfversion"]=date("YmdHis");\n$config["static_version"]="'$VERSION'";' > ./version.php
echo 'cp -f version.php ../'$PACKAGE'/application/config/production/version.php';
#cp -f version.php ../'$PACKAGE'/application/config/production/version.php

rm -f ./package.json
rm -f ./version.php
exit 1;