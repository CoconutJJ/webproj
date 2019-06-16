#!/bin/sh

buildJS() {
    
    fname_ext=`basename $1`

    fname=`echo $fname_ext | cut -d'.' -f1`

    
    
    file_path=`dirname $1`
    exportdir="build/$file_path"

    echo "Building $1 -> $exportdir/$fname.min.js"
    
    npx tsc $1 -m commonjs
    # npx browserify $file_path/$fname.js | npx google-closure-compiler --warning_level QUIET --compilation_level SIMPLE --js_output_file "$exportdir/$fname.min.js" 2>&1 > .setup/last_build.log

    if ! [ -d $exportdir ]; then
        mkdir -p $exportdir
    fi


    npx browserify $file_path/$fname.js > $exportdir/$fname.min.js 
}

buildCSS() {

    fname_ext=`basename $1`
    
    fname=`echo $fname_ext | cut -d'.' -f1`

    exportdir='build/css'
    echo "Building $1 -> $exportdir/$fname.css"
    npx sass --no-source-map $1 "$exportdir/$fname.css"

}

printHeaders() {
    dt=`date`
    echo "Beginning Build: $dt"
}

resetBuildDirectory() {
    rm -rf build/*
    mkdir build/js
}


makeServerFiles() {

    # Compiles the main server file
    npx tsc app/server.ts -m CommonJS --target es5 -outDir build/

}

makeClientFiles() {
    
    # SCSS 
    buildCSS sass/main.scss
    buildCSS sass/qa_layout.scss
    buildJS js/contact.ts
    buildJS js/index.ts
}


startServer() {
    echo "Server is now running..."
    node build/app/server.js
}

NODE_ENV=production

if [ "$1" = "start" ]; then
    startServer
elif [ "$1" = "make" ]; then
    printHeaders
    resetBuildDirectory
    makeServerFiles
    makeClientFiles
elif [ "$1" = "server" ]; then
    printHeaders
    makeServerFiles
    
else
    printHeaders
    resetBuildDirectory
    makeServerFiles
    makeClientFiles
    startServer
fi 
