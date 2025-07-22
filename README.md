link: https://metele-chala.github.io

modificacion de angular.json
    "builder": "@angular-devkit/build-angular:application" → "@angular-devkit/build-angular:browser"
    "outputPath": "dist/metele-chala" → "outputPath": "docs"
    "browser": "src/main.ts" → "main": "src/main.ts" (ajuste de clave esperada por el builder clásico)
    Agregué "baseHref": "/" en la configuración production, lo cual es ideal para GitHub Pages

build generado con:
ng build --output-path docs --base-href "/"

en settings > pages > modificado a carpeta docs