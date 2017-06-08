import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateStore } from "@ngx-translate/core/src/translate.store";
import { TranslateLoader } from "@ngx-translate/core/src/translate.loader";
import { TranslateParser } from "@ngx-translate/core/src/translate.parser";

import { BackgroundTasksService } from './../shared/services/background-tasks.service';
import { UtilitiesService } from './../shared/services/utilities.service';
import { TelemetryService } from './../shared/services/telemetry.service';
import { LocalStorageService } from './../shared/services/local-storage.service';
import { SlotsService } from './../shared/services/slots.service';
import { AuthzService } from './../shared/services/authz.service';
import { CacheService } from './../shared/services/cache.service';
import { FunctionMonitorService } from './../shared/services/function-monitor.service';
import { LanguageService } from './../shared/services/language.service';
import { FunctionsService } from './../shared/services/functions.service';
import { ConfigService } from './../shared/services/config.service';
import { BroadcastService } from './../shared/services/broadcast.service';
import { PortalService } from './../shared/services/portal.service';
import { HttpModule } from '@angular/http';
import { AiService } from './../shared/services/ai.service';
import { ArmService } from './../shared/services/arm.service';
import { UserService } from './../shared/services/user.service';
import { GlobalStateService } from './../shared/services/global-state.service';
import { TestBed, async } from '@angular/core/testing';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './../shared/GlobalErrorHandler';

import { TreeViewComponent } from './tree-view.component';

describe('TreeViewComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TreeViewComponent,
      ],
      providers: [
    ConfigService,
    FunctionsService,
    UserService,
    LanguageService,
    PortalService,
    BroadcastService,
    FunctionMonitorService,
    ArmService,
    CacheService,
    SlotsService,
    AuthzService,
    LocalStorageService,
    TelemetryService,
    UtilitiesService,
    BackgroundTasksService,
    GlobalStateService,
    AiService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
      ],
      imports: [
          HttpModule,
          TranslateModule.forRoot()
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(TreeViewComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should succeed', async(() => {
    setTimeout(() =>{
        expect(true).toEqual(true);

    }, 500);
  }));


//   it(`should have as title 'app works!'`, async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app.title).toEqual('app works!');
//   }));

//   it('should render title in a h1 tag', async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     fixture.detectChanges();
//     const compiled = fixture.debugElement.nativeElement;
//     expect(compiled.querySelector('h1').textContent).toContain('app works!');
//   }));
});
