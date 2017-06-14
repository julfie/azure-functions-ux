"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProviderType;
(function (ProviderType) {
    ProviderType[ProviderType["None"] = 0] = "None";
    ProviderType[ProviderType["Tfs"] = 1] = "Tfs";
    ProviderType[ProviderType["LocalGit"] = 2] = "LocalGit";
    ProviderType[ProviderType["GitHub"] = 3] = "GitHub";
    ProviderType[ProviderType["CodePlexGit"] = 4] = "CodePlexGit";
    ProviderType[ProviderType["CodePlexHg"] = 5] = "CodePlexHg";
    ProviderType[ProviderType["BitbucketGit"] = 6] = "BitbucketGit";
    ProviderType[ProviderType["BitbucketHg"] = 7] = "BitbucketHg";
    ProviderType[ProviderType["Dropbox"] = 8] = "Dropbox";
    ProviderType[ProviderType["ExternalGit"] = 9] = "ExternalGit";
    ProviderType[ProviderType["ExternalHg"] = 10] = "ExternalHg";
    ProviderType[ProviderType["CodePlex"] = 11] = "CodePlex";
    ProviderType[ProviderType["Bitbucket"] = 12] = "Bitbucket";
    ProviderType[ProviderType["External"] = 13] = "External";
    ProviderType[ProviderType["OneDrive"] = 14] = "OneDrive";
    ProviderType[ProviderType["VSO"] = 15] = "VSO";
    ProviderType[ProviderType["VSTSRM"] = 16] = "VSTSRM";
})(ProviderType = exports.ProviderType || (exports.ProviderType = {}));
var Status;
(function (Status) {
    Status[Status["Pending"] = 0] = "Pending";
    Status[Status["Building"] = 1] = "Building";
    Status[Status["Deploying"] = 2] = "Deploying";
    Status[Status["Failed"] = 3] = "Failed";
    Status[Status["Success"] = 4] = "Success";
})(Status = exports.Status || (exports.Status = {}));
//# sourceMappingURL=deployment.js.map