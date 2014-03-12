#!/bin/bash

set -e

PACKAGE="tizi";
VERSION="";

BASE_DIR=$(dirname "`pwd`");
HOME_DIR=$BASE_DIR'/tizi_grunt';
BASE_PATH='application/views/static';
BASE_GRUNTFILE='Gruntfile_old';

usage() {
  cat <<EOF
usage:
  $PROG -v version

OPTIONS:
  -v   version
  -h   help
EOF
}

while getopts "hv:" OPTION
do
  case $OPTION in
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

if [ $PACKAGE != "tizi" ]; then
  echo 'error param, package must be named '$PACKAGE;exit 1;
fi

if [ $VERSION = "js" ]; then
	echo 'error param, version cannot be named '$VERSION;exit 1;
fi

JS_DIR=$BASE_DIR'/'$PACKAGE'/'$BASE_PATH'/js'
COMPRESS_JS_DIR=$JS_DIR'.'$VERSION
CSS_DIR=$BASE_DIR'/'$PACKAGE'/'$BASE_PATH'/css'
COMPRESS_CSS_DIR=$CSS_DIR'.'$VERSION

if [ ! -d $JS_DIR ]; then
	echo 'error js dir: '$JS_DIR;exit 1;
elif [ ! -d $CSS_DIR ]; then
  echo 'error css dir: '$CSS_DIR;exit 1;
else
	echo "rm -rf $COMPRESS_JS_DIR";
	rm -rf $COMPRESS_JS_DIR
  echo "rm -rf $COMPRESS_CSS_DIR";
  rm -rf $COMPRESS_CSS_DIR
fi

echo '{"path":"../'$PACKAGE'/'$BASE_PATH'/","version": "'$VERSION'"}' > $HOME_DIR'/package.json'

grunt --gruntfile $HOME_DIR'/'$BASE_GRUNTFILE'.js' compress:$PACKAGE:$VERSION

rm -f $HOME_DIR'/package.json'
#exit 1;
