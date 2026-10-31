# CRM Front-end (Angular + DevExtreme)

Front-end of a CRM application, built with **Angular 17** and **DevExtreme** on top of the DevExtreme UI template gallery, then extended with business screens and services.
It works with a separate **C#/.NET back-end** (private repository).

## Features

| Area | Screens |
| --- | --- |
| CRM | Contact list, contact details |
| Sales | Quotations (cotations), Incoterms, countries, natures, salary frameworks |
| Planning | Task list, task details, scheduler |
| Analytics | Dashboard, sales analysis, geography |
| Account | Sign in, register, reset password, user profile |

The business logic lives in `angular/src/app/services/` (`cotation.service.ts`, `incoterm-service.service.ts`, `framework-salire.service.ts`, …) with typed models in `services/model/`.

## Tech stack

- Angular 17, TypeScript, RxJS
- DevExtreme components (DataGrid, Scheduler, Charts, Forms)
- REST API calls to the .NET back-end
- ESLint, Stylelint, Prettier

## Run locally

```bash
cd angular
npm install
npm start          # http://localhost:4200
```

Other scripts: `npm run build`, `npm run lint`, `npm test`.

## Project structure

```
angular/
  src/app/
    pages/        # one folder per screen (crm-, planning-, analytics-, auth forms)
    components/   # shared UI cards, header, footer
    services/     # API services + models
```

## Credits

UI layout based on the [DevExtreme UI Template Gallery](https://github.com/DevExpress/devextreme-ui-template-gallery) (MIT License).
