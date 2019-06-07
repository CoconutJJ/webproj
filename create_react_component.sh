#!/bin/sh

if [ -d react_components/$1 ]
then
    echo "Component with name: $1 already exists"
else

    mkdir -v react_components/$1
    mkdir -v react_components/$1/src
    mkdir -v react_components/$1/build

    cp .setup/react_component_generator/app.tsx.template react_components/$1/src/app.tsx
    cp .setup/react_component_generator/index.tsx.template react_components/$1/src/index.tsx
fi