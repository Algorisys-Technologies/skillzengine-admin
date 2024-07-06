# Testengine

A skills engine app

# Setup DB
```
use testengine
db.createCollection("users")

db.users.insert({
  "name": "admindemo@algorisys.com",
  "password": "4b186f54f82bb2ef1fc39ee9a973be89cf7443f0fa7765bd201cb2c60801ed54f36836dd02a2e63c653dd86ab2893c8fa6a557c67f13653b54efe427ebb6edd9",
  "group": "admin",
  "isActive": true})

```

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
