# SaxjaxDk

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Upload to homepage

### Only to confirm setup and select remote folder:

F1 -> ftp-simple: Config, check that config is ok

### To see what is happening:

open new terminal -> in the terminal menu select output -> then select tasks dropdown-> select ftp-simple

### build for production

```
ng build
```

creates a folder dist/
in this folder you find af folder called browser/

- rightClick on browser
- select ftp-simple: save from the dropdown
- you are now presented with two choices , select: browser/\*\* Exclude the selected directory. If exist file, force overwrite.
- select the homepage : sftp one.com saxiax.dk
- select folder to upload into: httpd.www TYPE: Directory, DATE: 19/12/2024, 22:17:16, SIZE : 4 KB
- select the path you want to save: . Current directory : /customers/5/e/9/saxjax.dk/httpd.www
- now you can follow the uploading files in the terminal - output window

### Upload

-
