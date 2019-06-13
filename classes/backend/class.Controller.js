"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
exports.__esModule = true;
var class_db_1 = require("./class.db");
var Controller = /** @class */ (function () {
    function Controller(tableName, primaryKey) {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
        this.db = new class_db_1.db();
    }
    Controller.prototype.get = function (param) {
        return this.params[param];
    };
    Controller.prototype.set = function (param, value) {
        this.params[param] = value;
    };
    /**
     * Process the filter
     * @param filter T
     */
    Controller.proccessFilter = function (filter) {
        if (filter.length > 0) {
            var assignments = void 0, filter_clauses = [], values = [];
            for (var i = 0; i < filter.length; i++) {
                assignments = this.getConjunctiveSQLAssignment(filter[i]);
                filter_clauses.push('(' + assignments.clause + ')');
                values.push.apply(values, assignments.values);
            }
            return {
                clause: filter_clauses.join(' OR '),
                values: values
            };
        }
        else {
            return null;
        }
    };
    Controller.getConjunctiveSQLAssignment = function (filter) {
        var filter_clauses = [];
        var values = [];
        for (var key in filter) {
            filter_clauses.push("`" + key + "` = ?");
            values.push(filter[key]);
        }
        return {
            clause: filter_clauses.join(' AND '),
            values: values
        };
    };
    Controller.all = function (tableName, filter) {
        var values = [];
        var dbh = new class_db_1.db();
        var sqlq = "SELECT * FROM " + tableName;
        if (filter !== undefined) {
            var processed_stmt = Controller.proccessFilter(filter);
            values = processed_stmt.values;
            sqlq += " WHERE " + processed_stmt.clause;
        }
        return dbh.query(sqlq, values);
    };
    Controller.columns = function (tableName, columnNames, filter) {
        var values = [];
        var dbh = new class_db_1.db();
        var esc_cols = columnNames.map(function (entry) {
            return "`" + entry + "`";
        });
        var sqlq = "SELECT " + esc_cols.join(',') + " FROM " + tableName;
        if (filter !== undefined) {
            var processed_stmt = Controller.proccessFilter(filter);
            values = processed_stmt.values;
            sqlq += " WHERE " + processed_stmt.clause;
        }
        return dbh.query(sqlq, values);
    };
    Controller.create = function (tableName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var dbh, cols, vals, placeholders, k;
            return __generator(this, function (_a) {
                dbh = new class_db_1.db();
                cols = [];
                vals = [];
                placeholders = [];
                for (k in params) {
                    cols.push("`" + k + "`");
                    vals.push(params[k]);
                    placeholders.push("?");
                }
                console.log(cols, vals);
                return [2 /*return*/, dbh.query("INSERT INTO " + tableName + " (" + cols.join(",") + ") VALUES (" + placeholders.join(",") + ")", vals)];
            });
        });
    };
    Controller.prototype.update = function () {
        var dbh = new class_db_1.db();
        var cols = [];
        var vals = [];
        for (var k in this.params) {
            if (k == this.primaryKey)
                continue;
            cols.push("`" + k + "` = ?");
            vals.push(this.params[k]);
        }
        return dbh.query("UPDATE" + this.tableName + " SET " + cols.join(',') + " WHERE `" + this.primaryKey + "` = ?", vals.concat([this.params[this.primaryKey]]));
    };
    Controller.prototype["delete"] = function () {
        var dbh = new class_db_1.db();
        return dbh.query("DELETE FROM " + this.tableName + " WHERE " + this.primaryKey + " = ?", [this.params[this.primaryKey]]);
    };
    return Controller;
}());
exports.Controller = Controller;
