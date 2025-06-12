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
Object.defineProperty(exports, "__esModule", { value: true });
// Define a query builder class here
class QueryBuilder {
    constructor(queryModel, query) {
        this.queryModel = queryModel;
        this.query = query;
    }
    // Search by title, author, or category
    search(searchFieldList) {
        var _a;
        const searchTerm = (_a = this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            this.queryModel = this.queryModel.find({
                $or: searchFieldList.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    }
    // Filter by price range, category, and availability
    filter() {
        const filterQuery = Object.assign({}, this.query);
        const excludeQueryFields = [
            'searchTerm',
            'sort',
            'limit',
            'page',
            'fields',
        ];
        excludeQueryFields.forEach((field) => delete filterQuery[field]);
        this.queryModel = this.queryModel.find(filterQuery);
        return this;
    }
    // Sort query data by field Or default value is name field
    sort() {
        var _a, _b, _c;
        const sortBy = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || 'name';
        this.queryModel = this.queryModel.sort(sortBy);
        return this;
    }
    // Pagination
    paginate() {
        var _a, _b;
        const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (page - 1) * limit;
        this.queryModel = this.queryModel.skip(skip).limit(limit);
        return this;
    }
    // fields filtering
    fields() {
        var _a, _b;
        const fields = ((_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(',').join(' ')) || '-__v';
        if (fields) {
            this.queryModel = this.queryModel.select(fields);
        }
        return this;
    }
    // write the query funtion for the sending metadata. calculate pagination metadata (total documents, current page, total pages, etc.)
    metaData() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueries = this.queryModel.getFilter();
            // Merge with the soft-delete exclusion condition
            const finalFilter = Object.assign(Object.assign({}, totalQueries), { isDeleted: false });
            const total = yield this.queryModel.model.countDocuments(finalFilter);
            const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                page,
                limit,
                total,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
