#!/bin/bash

set -e

PACKAGE="";
VERSION="";

BASE_DIR=$(dirname "`pwd`");
HOME_DIR=$BASE_DIR'/tizi_grunt';
BASE_PATH='static';
BASE_GRUNTFILE='Gruntfile_nahao';

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

while getopts "hp:v:j" OPTION
do
  case $OPTION in
  	p)
		  PACKAGE=$OPTARG
    	;;
    v)
    	VERSION=$OPTARG
    	;;
    j)
      BASE_PATH='webroot/static';
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

DEBUG_DIR=$BASE_DIR'/'$PACKAGE'/'$BASE_PATH'/debug'
#LIB_DIR=$BASE_DIR'/tizi_lib/library/views/static/lib'
#COMPRESS_DIR=$BASE_DIR'/'$PACKAGE'/'$BASE_PATH'/'$VERSION
COMPRESS_DIR=$BASE_DIR'/'$PACKAGE'/'$BASE_PATH'/online'
#DEBUG_LIB_DIR=$DEBUG_DIR'/lib'

if [ ! -d $DEBUG_DIR ]; then
	echo 'error debug dir: '$DEBUG_DIR;exit 1;
#elif [ ! -d $LIB_DIR ]; then
#  echo 'error lib dir: '$LIB_DIR;exit 1;
else
	echo "rm -rf $COMPRESS_DIR";
	rm -rf $COMPRESS_DIR
fi

#if [ ! -d $DEBUG_LIB_DIR ]; then
#  rm -f $DEBUG_LIB_DIR;
#  echo "ln -s $LIB_DIR $DEBUG_LIB_DIR";
#  ln -s $LIB_DIR $DEBUG_LIB_DIR
#fi

#echo '{"path":"../'$PACKAGE'/'$BASE_PATH'/","version": "'$VERSION'"}' > $HOME_DIR'/package.json'
echo '{"path":"../'$PACKAGE'/'$BASE_PATH'/","version": "online"}' > $HOME_DIR'/package.json'

/usr/local/bin/grunt  --gruntfile $HOME_DIR'/'$BASE_GRUNTFILE'.js' compress:$PACKAGE:online

echo -e '$config["version"]="'$VERSION'";\n' >> $BASE_DIR'/'$PACKAGE'/application/config/production/version.php'

rm -f $HOME_DIR'/package.json'
