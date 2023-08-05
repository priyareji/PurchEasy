import { enableProdMode, Injector, ReflectiveInjector } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DetectDeviceService, GlobalFunctionService } from '@app/shared';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
const injector = Injector.create({ providers: [{ provide: DetectDeviceService, deps: [GlobalFunctionService] }, { provide: GlobalFunctionService, deps: [] }] });
const detectDevice: DetectDeviceService = injector.get(DetectDeviceService);
let browserData: any = detectDevice.getFingerPrint;
if (browserData) {
  if (['', null, undefined].indexOf(browserData.browserVersion) < 0) {
    browserData.browserVersion = parseInt(browserData.browserVersion);
  }
  if (browserData.browserKey === 'IE' || (browserData.browserKey === 'CHROME' && browserData.browserVersion < 60) || (browserData.browserKey === 'MF' && browserData.browserVersion < 60) || (browserData.browserKey === 'SAFARI' && browserData.browserVersion < 13) || (browserData.browserKey === 'EDGE' && browserData.browserVersion < 60) || (browserData.browserKey === 'OPERA' && browserData.browserVersion < 60)) {
    let compatibilityWindow = document.getElementById("compatibility-window");
    // let appRoot = document.getElementById("app-root");
    // let loader = document.getElementById("initial-loader");
    if (compatibilityWindow)
      compatibilityWindow.classList.add('show');
    // appRoot.removeChild(loader);
  } else {
    platformBrowserDynamic().bootstrapModule(AppModule).
      then(() => {
        if ('serviceWorker' in navigator && environment.production) {
          navigator.serviceWorker.register('service-worker.js');
        }
      })
      .catch(err => console.error(err));
  }
}
