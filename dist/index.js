"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
var path_1 = __importDefault(require("path"));
var puppeteer_1 = __importDefault(require("puppeteer"));
function importLibsToPage(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.addScriptTag({
                        path: path_1.default.resolve("dist/browser-imports.js"),
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_1.default.launch({ headless: false }).then(function (browser) { return __awaiter(_this, void 0, void 0, function () {
                        var page, data, focusableCount, tabsMatchFocusable;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, browser.newPage()];
                                case 1:
                                    page = _a.sent();
                                    // await page.goto("https://www.washington.edu/accesscomputing/AU/after.html");
                                    return [4 /*yield*/, page.goto("https://accessibility.18f.gov/keyboard/#")];
                                case 2:
                                    // await page.goto("https://www.washington.edu/accesscomputing/AU/after.html");
                                    _a.sent();
                                    return [4 /*yield*/, importLibsToPage(page)];
                                case 3:
                                    _a.sent();
                                    data = {
                                        isFinished: false,
                                        tabCount: 0,
                                        greatestFocusableIndex: 0,
                                    };
                                    return [4 /*yield*/, page.keyboard.press("Tab")];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, page.evaluate(function () {
                                            // @ts-ignore
                                            var focusableElements = injectedLibraries.tabbable(document);
                                            console.log(focusableElements);
                                            var focusableCount = 0;
                                            for (var _i = 0, focusableElements_1 = focusableElements; _i < focusableElements_1.length; _i++) {
                                                var element = focusableElements_1[_i];
                                                element.setAttribute("data-a11y-focusable", focusableCount);
                                                focusableCount++;
                                            }
                                            return Promise.resolve(focusableCount);
                                        })];
                                case 5:
                                    focusableCount = _a.sent();
                                    console.log("focusableCount: " + focusableCount);
                                    _a.label = 6;
                                case 6: return [4 /*yield*/, page.keyboard.press("Tab")];
                                case 7:
                                    _a.sent();
                                    return [4 /*yield*/, page.evaluate(function (data) {
                                            var _a, _b, _c;
                                            console.log("tab count: " + data.tabCount);
                                            console.log(document.activeElement);
                                            var focusableIndex = (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.getAttribute("data-a11y-focusable");
                                            console.log("focusableIndex");
                                            console.log(focusableIndex);
                                            if (((_b = document.activeElement) === null || _b === void 0 ? void 0 : _b.getAttribute("data-a11y-focusable")) !== "0") {
                                                if (focusableIndex !== null && focusableIndex !== undefined) {
                                                    if (focusableIndex < data.greatestFocusableIndex) {
                                                        console.log("discrepancy!");
                                                        console.log(focusableIndex);
                                                        console.log(data.greatestFocusableIndex);
                                                        console.log("discrepancy end!+++++++++++++++++++");
                                                        (_c = document.activeElement) === null || _c === void 0 ? void 0 : _c.setAttribute("style", "border: 5px solid red");
                                                    }
                                                    else {
                                                        data.greatestFocusableIndex = focusableIndex;
                                                    }
                                                }
                                                return Promise.resolve(data);
                                            }
                                            data.isFinished = true;
                                            return Promise.resolve(data);
                                        }, data)];
                                case 8:
                                    data = _a.sent();
                                    data.tabCount++;
                                    _a.label = 9;
                                case 9:
                                    if (data.isFinished === false && data.tabCount < 50) return [3 /*break*/, 6];
                                    _a.label = 10;
                                case 10:
                                    console.log("tabCount: " + data.tabCount);
                                    tabsMatchFocusable = data.tabCount === focusableCount + 1;
                                    return [4 /*yield*/, page.evaluate(function (tabsMatchFocusable) {
                                            if (tabsMatchFocusable) {
                                                document.body.setAttribute("style", "border: 10px solid green");
                                            }
                                            else {
                                                document.body.setAttribute("style", "border: 10px solid red");
                                            }
                                        }, tabsMatchFocusable)];
                                case 11:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
run();
//# sourceMappingURL=index.js.map