"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/throw");
var ng2_file_upload_1 = require("ng2-file-upload");
var core_2 = require("@ngx-translate/core");
var busy_state_component_1 = require("../busy-state/busy-state.component");
var global_state_service_1 = require("../shared/services/global-state.service");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var portal_resources_1 = require("../shared/models/portal-resources");
var ai_service_1 = require("../shared/services/ai.service");
var FileExplorerComponent = (function () {
    function FileExplorerComponent(_globalStateService, _broadcastService, _translateService, _aiService) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this._broadcastService = _broadcastService;
        this._translateService = _translateService;
        this._aiService = _aiService;
        this.closeClicked = new core_1.EventEmitter();
        this.binaryExtensions = ['.zip', '.exe', '.dll', '.png', '.jpeg', '.jpg', '.gif', '.bmp', '.ico', '.pdf', '.so', '.ttf', '.bz2', '.gz', '.jar', '.cab', '.tar', '.iso', '.img', '.dmg'];
        this.selectedFileChange = new core_1.EventEmitter();
        this.selectedFunctionChange = new core_1.EventEmitter();
        this.selectedFunctionChange
            .switchMap(function (e) {
            _this.functionApp = e.functionApp;
            return _this.functionApp.getVfsObjects(e);
        })
            .subscribe(function (r) {
            _this.folders = _this.getFolders(r);
            _this.files = _this.getFiles(r);
        });
        this.history = [];
        // Kudu doesn't handle multipleparts upload correctly.
        this.uploader = new ng2_file_upload_1.FileUploader({ url: '', disableMultipart: true });
        this.uploader.onAfterAddingAll = function (files) {
            _this.setBusyState();
            var url = _this.currentVfsObject ? _this.currentVfsObject.href : _this.functionInfo.script_root_path_href;
            url = _this.trim(url);
            _this.uploader.setOptions({
                authToken: "Bearer " + _this._globalStateService.CurrentToken,
                headers: [{ name: 'If-Match', value: '*' }]
            });
            for (var i = 0; i < files.length; i++) {
                files[i].method = 'PUT';
                files[i].url = url + "/" + files[i].file.name;
                files[i].withCredentials = false;
            }
            _this.uploader.uploadAll();
        };
        this.uploader.onCompleteAll = function () {
            _this.uploader.clearQueue();
            _this.functionApp.ClearAllFunctionCache(_this.functionInfo);
            _this.refresh();
            _this._aiService.trackEvent('/actions/file_explorer/upload_file');
        };
        this.uploader.onErrorItem = function (item, response, status, headers) {
            _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, { message: '', details: '' });
        };
    }
    FileExplorerComponent.prototype.ngOnChanges = function (changes) {
        if (changes['functionInfo']) {
            this.currentTitle = this.functionInfo.name;
            this.resetState();
            this.selectedFunctionChange.emit(this.functionInfo);
        }
    };
    FileExplorerComponent.prototype.resetState = function () {
        this.creatingNewFile = false;
        this.renamingFile = false;
        delete this.newFileName;
    };
    FileExplorerComponent.prototype.setBusyState = function () {
        if (this.busyState) {
            this.busyState.setBusyState();
        }
    };
    FileExplorerComponent.prototype.clearBusyState = function () {
        if (this.busyState) {
            this.busyState.clearBusyState();
        }
    };
    FileExplorerComponent.prototype.refresh = function () {
        if (this.currentVfsObject) {
            this.selectVfsObject(this.currentVfsObject, true);
        }
        else {
            this.selectVfsObject(this.functionInfo.script_root_path_href, true, this.functionInfo.name);
        }
    };
    FileExplorerComponent.prototype.selectVfsObject = function (vfsObject, skipHistory, name) {
        var _this = this;
        this._aiService.trackEvent('/actions/file_explorer/select_item');
        if (!this.switchFiles() || (typeof vfsObject !== 'string' && vfsObject.isBinary)) {
            return;
        }
        if (typeof vfsObject === 'string' || (typeof vfsObject !== 'string' && vfsObject.mime === 'inode/directory')) {
            this.setBusyState();
            if (typeof vfsObject !== 'string' && !skipHistory) {
                if (this.currentVfsObject) {
                    this.history.push(this.currentVfsObject);
                }
                this.currentVfsObject = vfsObject;
            }
            this.functionInfo.functionApp.getVfsObjects(typeof vfsObject === 'string' ? vfsObject : vfsObject.href)
                .subscribe(function (r) {
                _this.folders = _this.getFolders(r);
                _this.files = _this.getFiles(r);
                _this.currentTitle = name || '..';
                _this.clearBusyState();
            }, function () { return _this.clearBusyState(); });
            return;
        }
        if (typeof vfsObject !== 'string') {
            this.selectedFileChange.emit(vfsObject);
        }
    };
    FileExplorerComponent.prototype.headingClick = function () {
        if (this.history.length === 0) {
            delete this.currentVfsObject;
            this.selectVfsObject(this.functionInfo.script_root_path_href, true, this.functionInfo.name);
        }
        else {
            this.currentVfsObject = this.history.pop();
            this.selectVfsObject(this.currentVfsObject, true);
        }
    };
    FileExplorerComponent.prototype.addnewInput = function (event, element) {
        if (!this.switchFiles()) {
            return;
        }
        this.creatingNewFile = true;
        setTimeout(function () { return element.focus(); }, 50);
    };
    FileExplorerComponent.prototype.addFile = function (content) {
        var _this = this;
        if (this.newFileName && this.files.find(function (f) { return f.name.toLocaleLowerCase() === _this.newFileName.toLocaleLowerCase(); })) {
            var error = {
                message: this._translateService.instant(portal_resources_1.PortalResources.fileExplorer_fileAlreadyExists, { fileName: this.newFileName })
            };
            this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, error);
            return Observable_1.Observable.throw(error.message);
        }
        var href = this.currentVfsObject
            ? this.trim(this.currentVfsObject.href) + "/" + this.newFileName
            : this.trim(this.functionInfo.script_root_path_href) + "/" + this.newFileName;
        this.setBusyState();
        var saveFileObservable = this.functionApp.saveFile(href, content || '', this.functionInfo);
        saveFileObservable
            .subscribe(function (r) {
            if (_this.newFileName.indexOf('\\') !== -1 || _this.newFileName.indexOf('/') !== -1) {
                _this.functionApp.ClearAllFunctionCache(_this.functionInfo);
                _this.refresh();
                _this._aiService.trackEvent('/actions/file_explorer/create_directory');
            }
            else {
                var o = typeof r === 'string'
                    ? { name: _this.newFileName, href: href, mime: 'file' }
                    : r;
                _this.files.push(o);
                _this.selectVfsObject(o, true);
                _this._aiService.trackEvent('/actions/file_explorer/create_file');
            }
            _this.creatingNewFile = false;
            _this.renamingFile = false;
            delete _this.newFileName;
        }, function (e) {
            if (e) {
                var body = e.json();
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: body.ExceptionMessage || _this._translateService.instant(portal_resources_1.PortalResources.fileExplorer_errorCreatingFile, { fileName: _this.newFileName })
                });
                var error = new Error(body.ExceptionMessage);
                _this._aiService.trackException(error);
            }
            _this.clearBusyState();
        });
        return saveFileObservable;
    };
    FileExplorerComponent.prototype.renameFile = function () {
        var _this = this;
        this.setBusyState();
        this.functionApp.getFileContent(this.selectedFile)
            .subscribe(function (content) {
            var bypassConfirm = true;
            _this.addFile(content)
                .subscribe(function (s) { return _this.deleteCurrentFile(bypassConfirm); }, function (e) { return _this.clearBusyState(); });
        }, function (e) { return _this.clearBusyState(); });
        this._aiService.trackEvent('/actions/file_explorer/rename_file');
    };
    FileExplorerComponent.prototype.handleKeyUp = function (event) {
        if (event.keyCode === 13) {
            // Enter
            if (this.creatingNewFile && this.newFileName) {
                this.addFile();
            }
            else if (this.renamingFile) {
                // TODO: handle filename in an input validator.
                if (this.newFileName && this.newFileName.toLocaleLowerCase() !== this.selectedFile.name.toLocaleLowerCase()) {
                    this.renameFile();
                }
                else {
                    this.files.push(this.selectedFile);
                    this.renamingFile = false;
                }
            }
        }
        else if (event.keyCode === 27) {
            this.escape();
        }
    };
    FileExplorerComponent.prototype.trim = function (str) {
        return str.charAt(str.length - 1) === '/'
            ? str.substring(0, str.length - 1)
            : str;
    };
    FileExplorerComponent.prototype.deleteCurrentFile = function (bypassConfirm) {
        var _this = this;
        if (this.selectedFile.href.toLocaleLowerCase() === this.functionInfo.config_href.toLocaleLowerCase()) {
            return;
        }
        if (bypassConfirm !== true && !confirm(this._translateService.instant(portal_resources_1.PortalResources.fileExplorer_deletePromt, { fileName: this.selectedFile.name }))) {
            return;
        }
        this.setBusyState();
        this.functionApp.deleteFile(this.selectedFile, this.functionInfo)
            .subscribe(function (deleted) {
            _this.functionApp.ClearAllFunctionCache(_this.functionInfo);
            _this.clearBusyState();
            var fileIndex = _this.files.map(function (e) { return e.href; }).indexOf(deleted.href);
            if (fileIndex === -1 || _this.files.length === 1) {
                _this.refresh();
            }
            else {
                _this.files.splice(fileIndex, 1);
                _this.selectVfsObject(_this.files[0]);
            }
        }, function (e) {
            if (e) {
                var body = e.json();
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, { message: body.ExceptionMessage || _this._translateService.instant(portal_resources_1.PortalResources.fileExplorer_errorDeletingFile, { fileName: _this.selectedFile.name }) });
            }
            _this.clearBusyState();
        });
        this._aiService.trackEvent('/actions/file_explorer/delete_file');
    };
    FileExplorerComponent.prototype.renameCurrentFile = function (event, element) {
        if (this.selectedFile.href.toLocaleLowerCase() === this.functionInfo.config_href.toLocaleLowerCase() || !this.switchFiles()) {
            return;
        }
        this.newFileName = this.selectedFile.name;
        this.renamingFile = true;
        var fileIndex = this.files.map(function (e) { return e.href; }).indexOf(this.selectedFile.href);
        if (fileIndex !== -1) {
            this.files.splice(fileIndex, 1);
        }
        setTimeout(function () { return element.focus(); }, 50);
    };
    FileExplorerComponent.prototype.getFileTitle = function (file) {
        return (file.isBinary) ? this._translateService.instant(portal_resources_1.PortalResources.fileExplorer_editingBinary) : file.name;
    };
    FileExplorerComponent.prototype.close = function () {
        this.closeClicked.emit(null);
    };
    FileExplorerComponent.prototype.onBlur = function () {
        this.escape();
    };
    FileExplorerComponent.prototype.escape = function () {
        // ESC
        delete this.newFileName;
        this.creatingNewFile = false;
        if (this.renamingFile) {
            this.files.push(this.selectedFile);
            this.renamingFile = false;
        }
    };
    FileExplorerComponent.prototype.getFiles = function (arr) {
        var _this = this;
        return arr
            .filter(function (e) { return e.mime !== 'inode/directory'; })
            .map(function (e) {
            e.isBinary = _this.binaryExtensions.some(function (t) { return e.name.endsWith(t); });
            return e;
        })
            .sort(function (a, b) { return a.name.localeCompare(b.name); });
    };
    FileExplorerComponent.prototype.getFolders = function (arr) {
        return arr.filter(function (e) { return e.mime === 'inode/directory'; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    };
    FileExplorerComponent.prototype.switchFiles = function () {
        var switchFiles = true;
        if (this._broadcastService.getDirtyState('function')) {
            switchFiles = confirm(this._translateService.instant(portal_resources_1.PortalResources.fileExplorer_changesLost));
            if (switchFiles) {
                this._broadcastService.clearDirtyState('function');
                this.selectedFile.isDirty = false;
            }
        }
        return switchFiles;
    };
    return FileExplorerComponent;
}());
__decorate([
    core_1.ViewChild(busy_state_component_1.BusyStateComponent),
    __metadata("design:type", busy_state_component_1.BusyStateComponent)
], FileExplorerComponent.prototype, "busyState", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FileExplorerComponent.prototype, "selectedFile", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FileExplorerComponent.prototype, "functionInfo", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], FileExplorerComponent.prototype, "selectedFunctionChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], FileExplorerComponent.prototype, "selectedFileChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], FileExplorerComponent.prototype, "closeClicked", void 0);
__decorate([
    core_1.ViewChild('container'),
    __metadata("design:type", core_1.ElementRef)
], FileExplorerComponent.prototype, "container", void 0);
FileExplorerComponent = __decorate([
    core_1.Component({
        selector: 'file-explorer',
        templateUrl: './file-explorer.component.html',
        styleUrls: ['./file-explorer.component.scss', '../function-dev/function-dev.component.scss']
    }),
    __metadata("design:paramtypes", [global_state_service_1.GlobalStateService,
        broadcast_service_1.BroadcastService,
        core_2.TranslateService,
        ai_service_1.AiService])
], FileExplorerComponent);
exports.FileExplorerComponent = FileExplorerComponent;
//# sourceMappingURL=file-explorer.component.js.map