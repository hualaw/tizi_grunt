#!/bin/bash

set -e

PACKAGE="tizi_lib";
VERSION="";

BASE_DIR=$(dirname "`pwd`");
HOME_DIR=$BASE_DIR'/tizi_grunt';
BASE_PATH='library/views/static';
BASE_GRUNTFILE='Gruntfile_lib';

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

#if [ $PACKAGE != "tizi_lib" ]; then
#  echo 'error param, package must be named '$PACKAGE;exit 1;
#fi

if [ $VERSION = "lib" -o $VERSION = "debug" ]; then
	echo 'error param, version cannot be named '$VERSION;exit 1;
fi

LIB_DIR=$BASE_DIR'/'$PACKAGE'/'$BASE_PATH'/lib'
COMPRESS_DIR=$LIB_DIR'.'$VERSION

if [ ! -d $LIB_DIR ]; then
	echo 'error lib dir: '$LIB_DIR;exit 1;
else
	echo "rm -rf $COMPRESS_DIR";
	rm -rf $COMPRESS_DIR
fi

echo '{"path":"../'$PACKAGE'/'$BASE_PATH'/","version": "'$VERSION'"}' > $HOME_DIR'/package.json'

grunt --gruntfile $HOME_DIR'/'$BASE_GRUNTFILE'.js' compress:$PACKAGE:$VERSION

rm -f $HOME_DIR'/package.json'
#exit 1;
