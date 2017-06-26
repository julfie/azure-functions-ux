"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var download_function_app_content_component_1 = require("./download-function-app-content/download-function-app-content.component");
var create_app_component_1 = require("./site/create-app/create-app.component");
var click_to_edit_component_1 = require("./controls/click-to-edit/click-to-edit.component");
var ai_try_service_1 = require("./shared/services/ai-try.service");
var tbl_th_component_1 = require("./controls/tbl/tbl-th/tbl-th.component");
var tbl_component_1 = require("./controls/tbl/tbl.component");
var GlobalErrorHandler_1 = require("./shared/GlobalErrorHandler");
var core_1 = require("@angular/core");
var arm_try_service_1 = require("./shared/services/arm-try.service");
var platform_browser_1 = require("@angular/platform-browser");
var core_2 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var core_3 = require("@ngx-translate/core");
var ng2_file_upload_1 = require("ng2-file-upload");
var ng2_popover_1 = require("ng2-popover");
var config_service_1 = require("./shared/services/config.service");
var functions_service_1 = require("./shared/services/functions.service");
var user_service_1 = require("./shared/services/user.service");
var portal_service_1 = require("./shared/services/portal.service");
var broadcast_service_1 = require("./shared/services/broadcast.service");
var function_monitor_service_1 = require("./shared/services/function-monitor.service");
var arm_service_1 = require("./shared/services/arm.service");
var cache_service_1 = require("./shared/services/cache.service");
var authz_service_1 = require("./shared/services/authz.service");
var local_storage_service_1 = require("./shared/services/local-storage.service");
var telemetry_service_1 = require("./shared/services/telemetry.service");
var utilities_service_1 = require("./shared/services/utilities.service");
var background_tasks_service_1 = require("./shared/services/background-tasks.service");
var global_state_service_1 = require("./shared/services/global-state.service");
var ai_service_1 = require("./shared/services/ai.service");
var language_service_1 = require("./shared/services/language.service");
var app_component_1 = require("./app.component");
var getting_started_component_1 = require("./getting-started/getting-started.component");
var busy_state_component_1 = require("./busy-state/busy-state.component");
var try_now_busy_state_component_1 = require("./try-now-busy-state/try-now-busy-state.component");
var top_bar_component_1 = require("./top-bar/top-bar.component");
var drop_down_component_1 = require("./drop-down/drop-down.component");
var try_now_component_1 = require("./try-now/try-now.component");
var function_edit_component_1 = require("./function-edit/function-edit.component");
var trial_expired_component_1 = require("./trial-expired/trial-expired.component");
var function_new_component_1 = require("./function-new/function-new.component");
var function_quickstart_component_1 = require("./function-quickstart/function-quickstart.component");
var tutorial_component_1 = require("./tutorial/tutorial.component");
var source_control_component_1 = require("./source-control/source-control.component");
var function_dev_component_1 = require("./function-dev/function-dev.component");
var binding_component_1 = require("./binding/binding.component");
var tooltip_content_component_1 = require("./tooltip-content/tooltip-content.component");
var tooltip_directive_1 = require("./tooltip-content/tooltip.directive");
var error_list_component_1 = require("./error-list/error-list.component");
var template_picker_component_1 = require("./template-picker/template-picker.component");
var pop_over_component_1 = require("./pop-over/pop-over.component");
var binding_input_component_1 = require("./binding-input/binding-input.component");
var binding_designer_component_1 = require("./binding-designer/binding-designer.component");
var secrets_box_container_component_1 = require("./secrets-box-container/secrets-box-container.component");
var secrets_box_input_directive_1 = require("./secrets-box-container/secrets-box-input.directive");
var aggregate_block_component_1 = require("./aggregate-block/aggregate-block.component");
var copy_pre_component_1 = require("./copy-pre/copy-pre.component");
var file_explorer_component_1 = require("./file-explorer/file-explorer.component");
var function_integrate_v2_component_1 = require("./function-integrate-v2/function-integrate-v2.component");
var function_integrate_component_1 = require("./function-integrate/function-integrate.component");
var function_keys_component_1 = require("./function-keys/function-keys.component");
var function_manage_component_1 = require("./function-manage/function-manage.component");
var function_monitor_component_1 = require("./function-monitor/function-monitor.component");
var log_streaming_component_1 = require("./log-streaming/log-streaming.component");
var radio_selector_component_1 = require("./radio-selector/radio-selector.component");
var run_http_component_1 = require("./run-http/run-http.component");
var table_function_monitor_component_1 = require("./table-function-monitor/table-function-monitor.component");
var try_landing_component_1 = require("./try-landing/try-landing.component");
var aggregate_block_pipe_1 = require("./aggregate-block/aggregate-block.pipe");
var monaco_editor_directive_1 = require("./shared/directives/monaco-editor.directive");
var table_function_monitor_pipe_1 = require("./table-function-monitor/table-function-monitor.pipe");
var main_component_1 = require("./main/main.component");
var side_nav_component_1 = require("./side-nav/side-nav.component");
var tree_view_component_1 = require("./tree-view/tree-view.component");
var site_dashboard_component_1 = require("./site/site-dashboard/site-dashboard.component");
var tabs_component_1 = require("./tabs/tabs.component");
var tab_component_1 = require("./tab/tab.component");
var breadcrumbs_component_1 = require("./breadcrumbs/breadcrumbs.component");
var site_summary_component_1 = require("./site/site-summary/site-summary.component");
var site_enabled_features_component_1 = require("./site/site-enabled-features/site-enabled-features.component");
var site_manage_component_1 = require("./site/site-manage/site-manage.component");
var feature_group_component_1 = require("./feature-group/feature-group.component");
var deployment_source_component_1 = require("./site/deployment-source/deployment-source.component");
var deployment_source_setup_component_1 = require("./site/deployment-source-setup/deployment-source-setup.component");
var multi_drop_down_component_1 = require("./multi-drop-down/multi-drop-down.component");
var top_right_menu_component_1 = require("./top-right-menu/top-right-menu.component");
var apps_list_component_1 = require("./apps-list/apps-list.component");
var function_runtime_component_1 = require("./site/function-runtime/function-runtime.component");
var api_details_component_1 = require("./api-details/api-details.component");
var api_new_component_1 = require("./api-new/api-new.component");
var functions_list_component_1 = require("./functions-list/functions-list.component");
var proxies_list_component_1 = require("./proxies-list/proxies-list.component");
var disabled_dashboard_component_1 = require("./disabled-dashboard/disabled-dashboard.component");
var create_function_wrapper_component_1 = require("./create-function-wrapper/create-function-wrapper.component");
var swagger_definition_component_1 = require("./site/swagger-definition/swagger-definition.component");
var swagger_frame_directive_1 = require("./site/swagger-frame/swagger-frame.directive");
var fn_write_access_directive_1 = require("./shared/directives/fn-write-access.directive");
var edit_mode_warning_component_1 = require("./edit-mode-warning/edit-mode-warning.component");
var textbox_component_1 = require("./controls/textbox/textbox.component");
var site_config_component_1 = require("./site/site-config/site-config.component");
var command_bar_component_1 = require("./controls/command-bar/command-bar.component");
var command_component_1 = require("./controls/command-bar/command/command.component");
var event_hub_component_1 = require("./pickers/event-hub/event-hub.component");
var service_bus_component_1 = require("./pickers/service-bus/service-bus.component");
var slots_list_component_1 = require("./slots-list/slots-list.component");
var slots_service_1 = require("./shared/services/slots.service");
var slot_new_component_1 = require("./slot-new/slot-new.component");
var search_box_component_1 = require("./search-box/search-box.component");
var app_setting_component_1 = require("./pickers/app-setting/app-setting.component");
function ArmServiceFactory(http, configService, userService, aiService, translateService) {
    var service = window.location.pathname.toLowerCase() === '/try' ?
        new arm_try_service_1.ArmTryService(http, configService, userService, aiService, translateService) :
        new arm_service_1.ArmService(http, configService, userService, aiService, translateService);
    return service;
}
exports.ArmServiceFactory = ArmServiceFactory;
function AiServiceFactory() {
    var service = window.location.pathname.toLowerCase() === '/try' ? new ai_try_service_1.AiTryService() : new ai_service_1.AiService();
    return service;
}
exports.AiServiceFactory = AiServiceFactory;
var AppModule = AppModule_1 = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule.moduleDefinition = {
    declarations: [
        app_component_1.AppComponent,
        getting_started_component_1.GettingStartedComponent,
        busy_state_component_1.BusyStateComponent,
        try_now_busy_state_component_1.TryNowBusyStateComponent,
        top_bar_component_1.TopBarComponent,
        drop_down_component_1.DropDownComponent,
        try_now_component_1.TryNowComponent,
        function_edit_component_1.FunctionEditComponent,
        trial_expired_component_1.TrialExpiredComponent,
        function_new_component_1.FunctionNewComponent,
        function_quickstart_component_1.FunctionQuickstartComponent,
        tutorial_component_1.TutorialComponent,
        source_control_component_1.SourceControlComponent,
        function_dev_component_1.FunctionDevComponent,
        binding_component_1.BindingComponent,
        tooltip_content_component_1.TooltipContentComponent,
        tooltip_directive_1.TooltipDirective,
        error_list_component_1.ErrorListComponent,
        template_picker_component_1.TemplatePickerComponent,
        pop_over_component_1.PopOverComponent,
        binding_input_component_1.BindingInputComponent,
        binding_designer_component_1.BindingDesignerComponent,
        secrets_box_container_component_1.SecretsBoxContainerComponent,
        secrets_box_input_directive_1.SecretsBoxInputDirective,
        aggregate_block_component_1.AggregateBlockComponent,
        copy_pre_component_1.CopyPreComponent,
        file_explorer_component_1.FileExplorerComponent,
        function_integrate_v2_component_1.FunctionIntegrateV2Component,
        function_integrate_component_1.FunctionIntegrateComponent,
        function_keys_component_1.FunctionKeysComponent,
        function_manage_component_1.FunctionManageComponent,
        function_monitor_component_1.FunctionMonitorComponent,
        log_streaming_component_1.LogStreamingComponent,
        radio_selector_component_1.RadioSelectorComponent,
        run_http_component_1.RunHttpComponent,
        table_function_monitor_component_1.TableFunctionMonitorComponent,
        try_landing_component_1.TryLandingComponent,
        aggregate_block_pipe_1.AggregateBlockPipe,
        monaco_editor_directive_1.MonacoEditorDirective,
        table_function_monitor_pipe_1.TableFunctionMonitorPipe,
        main_component_1.MainComponent,
        side_nav_component_1.SideNavComponent,
        tree_view_component_1.TreeViewComponent,
        site_dashboard_component_1.SiteDashboardComponent,
        tabs_component_1.TabsComponent,
        tab_component_1.TabComponent,
        breadcrumbs_component_1.BreadcrumbsComponent,
        site_summary_component_1.SiteSummaryComponent,
        site_enabled_features_component_1.SiteEnabledFeaturesComponent,
        site_manage_component_1.SiteManageComponent,
        feature_group_component_1.FeatureGroupComponent,
        deployment_source_component_1.DeploymentSourceComponent,
        deployment_source_setup_component_1.DeploymentSourceSetupComponent,
        multi_drop_down_component_1.MultiDropDownComponent,
        top_right_menu_component_1.TopRightMenuComponent,
        apps_list_component_1.AppsListComponent,
        function_runtime_component_1.FunctionRuntimeComponent,
        api_details_component_1.ApiDetailsComponent,
        api_new_component_1.ApiNewComponent,
        functions_list_component_1.FunctionsListComponent,
        proxies_list_component_1.ProxiesListComponent,
        slots_list_component_1.SlotsListComponent,
        swagger_definition_component_1.SwaggerDefinitionComponent,
        swagger_frame_directive_1.SwaggerFrameDirective,
        disabled_dashboard_component_1.DisabledDashboardComponent,
        create_function_wrapper_component_1.CreateFunctionWrapperComponent,
        tbl_component_1.TblComponent,
        tbl_th_component_1.TblThComponent,
        fn_write_access_directive_1.FnWriteAccessDirective,
        edit_mode_warning_component_1.EditModeWarningComponent,
        textbox_component_1.TextboxComponent,
        site_config_component_1.SiteConfigComponent,
        click_to_edit_component_1.ClickToEditComponent,
        command_bar_component_1.CommandBarComponent,
        command_component_1.CommandComponent,
        create_app_component_1.CreateAppComponent,
        slots_list_component_1.SlotsListComponent,
        slot_new_component_1.SlotNewComponent,
        event_hub_component_1.EventHubComponent,
        service_bus_component_1.ServiceBusComponent,
        search_box_component_1.SearchBoxComponent,
        app_setting_component_1.AppSettingComponent,
        download_function_app_content_component_1.DownloadFunctionAppContentComponent
    ],
    imports: [
        forms_1.FormsModule,
        forms_1.ReactiveFormsModule,
        platform_browser_1.BrowserModule,
        forms_1.FormsModule,
        http_1.HttpModule,
        core_3.TranslateModule.forRoot(),
        ng2_file_upload_1.FileUploadModule,
        ng2_popover_1.PopoverModule
    ],
    providers: [
        config_service_1.ConfigService,
        functions_service_1.FunctionsService,
        user_service_1.UserService,
        language_service_1.LanguageService,
        portal_service_1.PortalService,
        broadcast_service_1.BroadcastService,
        function_monitor_service_1.FunctionMonitorService,
        {
            provide: arm_service_1.ArmService, useFactory: ArmServiceFactory, deps: [
                http_1.Http,
                config_service_1.ConfigService,
                user_service_1.UserService,
                ai_service_1.AiService,
                core_3.TranslateService
            ]
        },
        cache_service_1.CacheService,
        slots_service_1.SlotsService,
        authz_service_1.AuthzService,
        local_storage_service_1.LocalStorageService,
        telemetry_service_1.TelemetryService,
        utilities_service_1.UtilitiesService,
        background_tasks_service_1.BackgroundTasksService,
        global_state_service_1.GlobalStateService,
        { provide: ai_service_1.AiService, useFactory: AiServiceFactory },
        { provide: core_1.ErrorHandler, useClass: GlobalErrorHandler_1.GlobalErrorHandler },
    ],
    bootstrap: [app_component_1.AppComponent]
};
AppModule = AppModule_1 = __decorate([
    core_2.NgModule(AppModule_1.moduleDefinition)
], AppModule);
exports.AppModule = AppModule;
var AppModule_1;
//# sourceMappingURL=app.module.js.map