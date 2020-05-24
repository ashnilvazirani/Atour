// exports.checkID = (request, response, next, value) => {
//   console.log(`ID IS ${value}`);
//   if (request.param.id * 1 > tours.length) {
//     return response.status(404).json({
//       status: 'faliure-delete',
//       message: 'invalid-id',
//     });
//   }
//   next();
// };
// exports.checkData = (request, response, next) => {
//   if (!request.body) {
//     return response.status(400).json({
//       status: 'Cannot Insert',
//       message: 'data-does-not-exists',
//     });
//   } else if (
//     !request.body.name ||
//     !request.body.duration ||
//     !request.body.enjoyment
//   ) {
//     return response.status(400).json({
//       status: 'Cannot Insert',
//       message: 'Data is not Complete',
//     });
//   }
//   next();
// };
exports.getAllTours = async (request, response) => {
    console.log(request.query);
    try {
        // const q=request.query --> creates a shallow copy, meaning to create only a reference
        // const queryObj = {
        //   ...request.query,
        // };
        // //creates a hard copy
        // //1A-NORMAL FILTERARTION
        // const excludedData = ['page', 'sort', 'limit', 'fields'];
        // excludedData.forEach((element) => delete queryObj[element]);
        // console.log(queryObj);
        // //1B-ADVANCED FILERATION: lt,lte, gt, gte
        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // console.log(JSON.parse(queryStr));

        // // const tours = await Tour.find({
        // //   duration: 5
        // // });

        // //BUILD THE QUERY:
        // let query = Tour.find(JSON.parse(queryStr));
        //2--APPLYING SORT(the one's skipped in normal filteration)
        // if (request.query.sort) {
        //   //sort=pirce->ascending order && sort=-price-> descending order
        //   const sortBy = request.query.sort.split(',').join(' ');
        //   console.log(sortBy);
        //   query = query.sort(sortBy);
        // } else {
        //   query = query.sort('-createdAt');
        // }
        //3--projection of required fields
        // if (request.query.fields) {
        //   const fields = request.query.fields.split(',').join(' ');
        //   query = query.select(fields);
        // } else {
        //   query = query.select('-__v');
        // }
        //4--PAGINATION
        // const page = (request.query.page) ? request.query.page * 1 : 1;
        // const limit = (request.query.limit) ? request.query.limit * 1 : 2;
        // const skip = (page - 1) * limit;
        // if (page == 1) {
        //   query = query.limit(limit);
        // } else if (page >= 2) {
        //   query = query.skip(skip).limit(limit);
        // }
        // if (request.query.page) {
        //   const count = await Tour.countDocuments();
        //   if (skip >= count) throw new Error('PAGE OUT OF BOUNDS')
        // }
        // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
        //EXECUTE THE QUERY:
        const features = new APIFeature(Tour.find(), request.query).filter().sort().limit().paginate();
        const tours = await features.query;

        response.status(200).json({
            status: 'sucess',
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (error) {
        response.status(400).json({
            status: 'failed-to-fetch-tours',
            message: error.message,
        });
    }
};