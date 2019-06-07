# TaskManager

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Angular Universal & Server-side
// Dynamic SSR
npm run build:ssr && npm run serve:ssr

// Static Pre-Rendering
npm run build:prerender && npm run serve:prerender

## Internationalize

ng serve --configuration=es

ng serve --configuration=en

##Buld file for Deployment
ng build --prod --base-href /project-manager/
##Internatinalization for deployment
ng build --prod --i18n-file src/locale/messages.en.xlf --i18n-format xlf --i18n-locale en --base-href /project-manager/

##Server endpoint
http://localhost:8080/project-manager/