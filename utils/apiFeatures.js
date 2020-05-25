const fs = require('fs');
class APIFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = {
      ...this.queryString,
    };
    //creates a hard copy
    //1A-NORMAL FILTERARTION
    const excludedData = ['page', 'sort', 'limit', 'fields'];
    excludedData.forEach((element) => delete queryObj[element]);
    console.log(queryObj);
    //1B-ADVANCED FILERATION: lt,lte, gt, gte
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    // const tours = await Tour.find({
    //   duration: 5
    // });

    //BUILD THE QUERY:
    this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      //sort=pirce->ascending order && sort=-price-> descending order
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page ? this.queryString.page * 1 : 1;
    const limit = this.queryString.limit ? this.queryString.limit * 1 : 20;
    const skip = (page - 1) * limit;
    if (page == 1) {
      this.query = this.query.limit(limit);
    } else if (page >= 2) {
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}
module.exports = APIFeature;
