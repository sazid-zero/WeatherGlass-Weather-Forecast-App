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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import { useQuery } from '@tanstack/react-query';
// Accepts either a city name or coordinates
export function useWeatherStatistics(cityOrCoords) {
    var _this = this;
    var queryKey;
    var url;
    if (typeof cityOrCoords === 'string' && cityOrCoords) {
        queryKey = ['/api/weather/statistics', cityOrCoords];
        url = "/api/weather/statistics/".concat(encodeURIComponent(cityOrCoords));
    }
    else if (cityOrCoords && typeof cityOrCoords === 'object' && 'lat' in cityOrCoords && 'lon' in cityOrCoords) {
        queryKey = ['/api/weather/statistics/coords', cityOrCoords.lat, cityOrCoords.lon];
        url = "/api/weather/statistics/coords?lat=".concat(cityOrCoords.lat, "&lon=").concat(cityOrCoords.lon);
    }
    else {
        queryKey = ['/api/weather/statistics', 'none'];
        url = '';
    }
    return useQuery({
        queryKey: queryKey,
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response, errorMsg, errJson, _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!url)
                            throw new Error('No location provided');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, fetch(url)];
                    case 2:
                        response = _b.sent();
                        if (!!response.ok) return [3 /*break*/, 7];
                        errorMsg = 'Failed to fetch weather statistics';
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, response.json()];
                    case 4:
                        errJson = _b.sent();
                        errorMsg = errJson.error || errorMsg;
                        return [3 /*break*/, 6];
                    case 5:
                        _a = _b.sent();
                        return [3 /*break*/, 6];
                    case 6: throw new Error(errorMsg);
                    case 7: return [2 /*return*/, response.json()];
                    case 8:
                        err_1 = _b.sent();
                        // Log error for debugging
                        console.error('Weather statistics fetch error:', err_1);
                        throw err_1;
                    case 9: return [2 /*return*/];
                }
            });
        }); },
        enabled: !!url,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
}
