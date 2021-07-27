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
                        path: path_1.default.resolve('dist/browser-imports.js'),
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
                case 0: return [4 /*yield*/, puppeteer_1.default.launch({ headless: false, defaultViewport: null }).then(function (browser) { return __awaiter(_this, void 0, void 0, function () {
                        var page, data, _a, focusedElement, tabsMatchFocusable;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, browser.newPage()];
                                case 1:
                                    page = _b.sent();
                                    // accessible page example
                                    // await page.goto('https://www.washington.edu/accesscomputing/AU/after.html');
                                    // frozen element example
                                    // await page.goto('https://interactiveaccessibility.com/education/training/ex7.1.html');
                                    // honey trap (redirect) example
                                    // await page.goto('http://aduggin.github.io/accessibility-fails/keyboardtrap.html');
                                    // loop trap example
                                    return [4 /*yield*/, page.goto('https://accessibility.18f.gov/keyboard/#')];
                                case 2:
                                    // accessible page example
                                    // await page.goto('https://www.washington.edu/accesscomputing/AU/after.html');
                                    // frozen element example
                                    // await page.goto('https://interactiveaccessibility.com/education/training/ex7.1.html');
                                    // honey trap (redirect) example
                                    // await page.goto('http://aduggin.github.io/accessibility-fails/keyboardtrap.html');
                                    // loop trap example
                                    _b.sent();
                                    return [4 /*yield*/, importLibsToPage(page)];
                                case 3:
                                    _b.sent();
                                    data = {
                                        isFinished: false,
                                        tabCount: 0,
                                        focusableCount: 0,
                                        nextNonTrapElementSelector: '',
                                        nextNonTrapElementIndex: null,
                                        attemptedNonTrapFocusIndex: null,
                                        greatestFocusedIndex: 0,
                                        tagsToCleanup: ['data-a11y-focus-index', 'data-a11y-focused'],
                                    };
                                    return [4 /*yield*/, page.keyboard.press('Tab')];
                                case 4:
                                    _b.sent();
                                    _a = data;
                                    return [4 /*yield*/, page.evaluate(function () {
                                            // inject tabbable to get the focusable elements
                                            // @ts-ignore
                                            var focusableElements = injectedLibraries.tabbable(document);
                                            console.log(focusableElements);
                                            var focusableCount = 0;
                                            // set data attribute to denote focuasable elements
                                            for (var _i = 0, focusableElements_1 = focusableElements; _i < focusableElements_1.length; _i++) {
                                                var element = focusableElements_1[_i];
                                                element.setAttribute('data-a11y-focus-index', focusableCount);
                                                focusableCount++;
                                            }
                                            return Promise.resolve(focusableCount);
                                        })];
                                case 5:
                                    _a.focusableCount = _b.sent();
                                    console.log("focusableCount: " + data.focusableCount);
                                    _b.label = 6;
                                case 6: return [4 /*yield*/, page.keyboard.press('Tab')];
                                case 7:
                                    _b.sent();
                                    return [4 /*yield*/, page.evaluate(function (data) {
                                            var _a, _b, _c, _d, _e, _f, _g, _h;
                                            console.log("tab count: " + data.tabCount);
                                            console.log(document.activeElement);
                                            //////////// START Handle Keyboard Trap ///////////
                                            ////////////////////////////////////////////////////////
                                            if (((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.getAttribute('data-a11y-focused')) == 'true') {
                                                // if data-a11y-trap is true, find the next focusable element that doesn't have the data-a11y-trap attribute, focus it, and continue on document.
                                                // after you'll want to remove the tab count limit of 50 that is currently set below.
                                                if (((_b = document.activeElement) === null || _b === void 0 ? void 0 : _b.getAttribute('data-a11y-trap')) == 'true') {
                                                    console.log('find next non-trap element');
                                                    var currentFocusIndexString = (_c = document.activeElement) === null || _c === void 0 ? void 0 : _c.getAttribute('data-a11y-focus-index');
                                                    if (currentFocusIndexString != null) {
                                                        var currentFocusIndex = parseInt(currentFocusIndexString);
                                                        while (currentFocusIndex != data.focusableCount) {
                                                            if (currentFocusIndex == data.focusableCount - 1) {
                                                                // Focus trap on last focusable element, so we're done scanning.
                                                                return Promise.resolve(data);
                                                            }
                                                            var nextFocusableIndex = currentFocusIndex + 1;
                                                            if (nextFocusableIndex == data.attemptedNonTrapFocusIndex) {
                                                                nextFocusableIndex++;
                                                            }
                                                            console.log(nextFocusableIndex);
                                                            var nextNonTrapElement = document.querySelector("[data-a11y-focus-index=\"" + nextFocusableIndex + "\"]:not([data-a11y-trap])");
                                                            if (nextNonTrapElement != null) {
                                                                console.log('next non-trap element');
                                                                console.log(nextNonTrapElement);
                                                                data.nextNonTrapElementIndex = nextFocusableIndex;
                                                                data.nextNonTrapElementSelector = "[data-a11y-focus-index=\"" + nextFocusableIndex + "\"]";
                                                                break;
                                                            }
                                                            currentFocusIndex++;
                                                        }
                                                    }
                                                }
                                                (_d = document.activeElement) === null || _d === void 0 ? void 0 : _d.setAttribute('style', 'border: 5px solid red');
                                                (_e = document.activeElement) === null || _e === void 0 ? void 0 : _e.setAttribute('data-a11y-trap', 'true');
                                            }
                                            //////////// END Handle Keyboard Trap ////////////
                                            ////////////////////////////////////////////////////////
                                            // mark element as focused
                                            (_f = document.activeElement) === null || _f === void 0 ? void 0 : _f.setAttribute('data-a11y-focused', 'true');
                                            var focusableIndex = (_g = document.activeElement) === null || _g === void 0 ? void 0 : _g.getAttribute('data-a11y-focus-index');
                                            // Check to see if we've reached the last focusable element, if not return (and continue loop), if so then return (and end loop).
                                            if (((_h = document.activeElement) === null || _h === void 0 ? void 0 : _h.getAttribute('data-a11y-focus-index')) !== '0') {
                                                if (focusableIndex !== null && focusableIndex !== undefined) {
                                                    if (focusableIndex > data.greatestFocusedIndex) {
                                                        data.greatestFocusedIndex = focusableIndex;
                                                    }
                                                }
                                                return Promise.resolve(data);
                                            }
                                            data.isFinished = true;
                                            return Promise.resolve(data);
                                        }, data)];
                                case 8:
                                    data = _b.sent();
                                    data.tabCount++;
                                    if (!(data.nextNonTrapElementSelector.length > 0)) return [3 /*break*/, 10];
                                    console.log('trying to focus next element after keyboard trap');
                                    console.log(data.nextNonTrapElementSelector);
                                    return [4 /*yield*/, page.focus(data.nextNonTrapElementSelector)];
                                case 9:
                                    focusedElement = _b.sent();
                                    data.attemptedNonTrapFocusIndex = data.nextNonTrapElementIndex;
                                    data.nextNonTrapElementSelector = '';
                                    _b.label = 10;
                                case 10:
                                    if (data.isFinished === false && data.tabCount < 500) return [3 /*break*/, 6];
                                    _b.label = 11;
                                case 11: 
                                //identify elements with focus index but no data-a11y-focused attribute
                                return [4 /*yield*/, page.evaluate(function () {
                                        var nonFocusedElements = document.querySelectorAll('[data-a11y-focus-index]:not([data-a11y-focused])');
                                        for (var i = 0; i < nonFocusedElements.length; i++) {
                                            nonFocusedElements[i].setAttribute('style', 'border: 5px solid purple');
                                            nonFocusedElements[i].setAttribute('data-a11y-expected-focus-not-received', 'true');
                                        }
                                    })];
                                case 12:
                                    //identify elements with focus index but no data-a11y-focused attribute
                                    _b.sent();
                                    //clean up injected data attributes
                                    return [4 /*yield*/, page.evaluate(function (data) {
                                            data.tagsToCleanup.forEach(function (tag) {
                                                var elements = document.querySelectorAll("[" + tag + "]");
                                                console.log(elements);
                                                for (var i = 0; i < elements.length; i++) {
                                                    elements[i].removeAttribute(tag);
                                                }
                                            });
                                        }, data)];
                                case 13:
                                    //clean up injected data attributes
                                    _b.sent();
                                    console.log("tabCount: " + data.tabCount);
                                    tabsMatchFocusable = data.tabCount === data.focusableCount + 1;
                                    // if number of tabs matches the number of focusable elements, turn green, else turn red.
                                    return [4 /*yield*/, page.evaluate(function (tabsMatchFocusable) {
                                            if (tabsMatchFocusable) {
                                                document.body.setAttribute('style', 'border: 10px solid green');
                                            }
                                            else {
                                                document.body.setAttribute('style', 'border: 10px solid red');
                                            }
                                            document.body.setAttribute('data-tabstops-match-focusable-count', tabsMatchFocusable);
                                        }, tabsMatchFocusable)];
                                case 14:
                                    // if number of tabs matches the number of focusable elements, turn green, else turn red.
                                    _b.sent();
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