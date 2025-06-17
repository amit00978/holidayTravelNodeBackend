

const fs = require('fs');
const path = require('path');
const Package = require('../models/packageModel')
const APIFeatures = require('../utils/APIFeatures');
const slugify = require('slugify');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.getAllPackages = catchAsync(async (req, res,next) => {    
        const { packageType } = req.query;
        if (packageType) {
            const typesArray = packageType.split(',');
            req.query.packageType = { $in: typesArray };
        }
        const features = new APIFeatures(Package.find(), req.query).filter().sort().limitFields().paginate();
        const allPackage = await features.query;
        res.status(200).json({
            status: 200,
            data: allPackage
        })
});

exports.getPackage = catchAsync(async (req, res,next) => {
    const package = await Package.findById(req.params.id)
    if(!package){
        return next(new AppError(404, `No package found with that ID!`));
    }
    res.status(200).json({
        status: 200,
        data: package
    })
});


exports.createPackage = catchAsync(async (req, res, next) => {
    const newPackage = await Package.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            newPackage
        }
    });
})

exports.deletePackage = catchAsync(async (req, res, next) => {
    const package = await Package.findById(req.params.id)
    if(!package){
        return next(new AppError(404, `No package found with that ID!`));
    }
    await Package.findByIdAndUpdate(req.params.id, { "availability": false })
    res.status(204).json({
        status: 'success',
        data: "Done"
    });
})

exports.updatePackage =catchAsync( async (req, res, next) => {
    const newPackage = await Package.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if(!newPackage){
        return next(new AppError(404, `No package found with that ID!`));
    }
    res.status(200).json({
        status: 'success',
        data: {
            newPackage
        }
    });

});

exports.getPackageStats = catchAsync(async (req, res,next) => {
    const packageStats = await Package.aggregate([
        {
            $match: { ratingsAverage: { $gte: 0 } }
        },
        {
            $group: {
                _id: '$ratingsAverage',
                avgRating: { $avg: '$ratingsAverage' },
                numPackage: { $sum: 1 },
                avgAdultPrice: { $avg: "$price.adult" },
                avgChildPrice: { $avg: "$price.child" },
                minAdultPrice: { $min: "$price.adult" },
                maxAdultPrice: { $max: "$price.adult" },
                minChildPrice: { $min: "$price.child" },
                maxChildPrice: { $max: "$price.child" }
            }
        }, {
            $sort: {
                avgAdultPrice: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            packageStats
        }
    });
});

exports.getMonthlyPlan =catchAsync( async (req, res,next) => {

    const year = req.params.year * 1;
    const plan = await Package.aggregate([]);
    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});
