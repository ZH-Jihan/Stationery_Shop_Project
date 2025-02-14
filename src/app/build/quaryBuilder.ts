import { FilterQuery, Query } from 'mongoose';

// Define a query builder class here
class QueryBuilder<T> {
  queryModel: Query<T[], T>;
  query: Record<string, unknown>;

  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.queryModel = queryModel;
    this.query = query;
  }
  // Search by title, author, or category
  search(searchFieldList: string[]) {
    const searchTerm = this.query?.searchTerm;
    if (searchTerm) {
      this.queryModel = this.queryModel.find({
        $or: searchFieldList.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  // Filter by price range, category, and availability
  filter() {
    const filterQuery = { ...this.query };
    const excludeQueryFields = [
      'searchTerm',
      'sort',
      'limit',
      'page',
      'fields',
    ];
    excludeQueryFields.forEach((field) => delete filterQuery[field]);
    this.queryModel = this.queryModel.find(filterQuery as FilterQuery<T>);
    return this;
  }

  // Sort query data by field Or default value is name field
  sort() {
    const sortBy =
      (this?.query?.sort as string)?.split(',')?.join(' ') || 'name';

    this.queryModel = this.queryModel.sort(sortBy as string);

    return this;
  }

  // Pagination
  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;
    this.queryModel = this.queryModel.skip(skip).limit(limit);

    return this;
  }

  // fields filtering
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',').join(' ') || '-__v';
    if (fields) {
      this.queryModel = this.queryModel.select(fields);
    }
    return this;
  }

  // write the query funtion for the sending metadata. calculate pagination metadata (total documents, current page, total pages, etc.)
  async metaData() {
    const totalQueries = this.queryModel.getFilter();
    // Merge with the soft-delete exclusion condition
    const finalFilter = {
      ...totalQueries,
      isDeleted: false, // Exclude soft-deleted documents
    };
    const total = await this.queryModel.model.countDocuments(finalFilter);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
