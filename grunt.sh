#!/bin/bash

set -e

PACKAGE="";
VERSION="";

DIR=$(cd "../$(dirname "$0")"; pwd)

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

while getopts "hp:v:" OPTION
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

if [ ! -n "$PACKAGE" -o ! -n "$VERSION" ]; then
	echo 'error param, package: '$PACKAGE', version: '$VERSION;exit 1;
fi

if [ $PACKAGE = "tizi_lib" ]; then
  echo 'error param, package cannot be named '$PACKAGE;exit 1;
fi

if [ $VERSION = "debug" ]; then
	echo 'error param, version cannot be named '$VERSION;exit 1;
fi

DEBUG_DIR=$DIR'/'$PACKAGE'/application/views/static/debug'
LIB_DIR=$DIR'/tizi_lib/library/views/static/lib'
COMPRESS_DIR=$DIR'/'$PACKAGE'/application/views/static/'$VERSION
DEBUG_LIB_DIR=$DEBUG_DIR'/lib'

if [ ! -d $DEBUG_DIR ]; then
	echo 'error debug dir: '$DEBUG_DIR;exit 1;
elif [ ! -d $LIB_DIR ]; then
  echo 'error lib dir: '$LIB_DIR;exit 1;
else
	echo "rm -rf $COMPRESS_DIR";
	#rm -rf $COMPRESS_DIR
fi

if [ ! -d $DEBUG_LIB_DIR ]; then
  rm -f $DEBUG_LIB_DIR;
  echo "ln -s $LIB_DIR $DEBUG_LIB_DIR";
  ln -s $LIB_DIR $DEBUG_LIB_DIR
fi

echo '{"package":"'$PACKAGE'","version": "'$VERSION'"}' > ./package.json

grunt compress:$PACKAGE:$VERSION

echo -e '<?php\n$config["version"]=date("YmdHi");\n$config["swfversion"]=date("YmdHis");\n$config["static_version"]="'$VERSION'";' > ./version.php
echo 'cp -f version.php ../'$PACKAGE'/application/config/production/version.php';
#cp -f version.php ../'$PACKAGE'/application/config/production/version.php

rm -f ./package.json
rm -f ./version.php
exit 1;