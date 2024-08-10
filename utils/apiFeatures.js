class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    //1- For Filtering
    const QueryStringObj = { ...this.queryString };
    const excludesField = ["page", "sort", "limit", "fields", "keyword"];
    excludesField.forEach((field) => delete QueryStringObj[field]);

    //Apply Filteration Using [gte,gt,lte,lt]
    let queryStr = JSON.stringify(QueryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //3-For Sorting
    if (this.queryString.sort) {
      //Price, -sold  => [price, -sold] => price -sold
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("_createdAt");
    }
    return this;
  }

  limitFields() {
    //4-For Fields Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(`${fields} -_id `);
    } else {
      this.mongooseQuery = this.mongooseQuery.select(`-__v `);
    }
    return this;
  }

  search(modelName) {
    //5-For Search
    if (this.queryString.keyword) {
      let query = {};
      if (modelName == "Products") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDoucuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    //Pagenation Result
    const pagenation = {};
    pagenation.currentPage = page;
    pagenation.limit = limit;
    pagenation.numOfPage = Math.ceil(countDoucuments / limit);

    //next page
    if (endIndex < countDoucuments) {
      pagenation.next = page + 1;
    }
    //prev page
    if (skip > 0) {
      pagenation.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.pagenationResult = pagenation;
    return this;
  }
}

module.exports = ApiFeatures;
