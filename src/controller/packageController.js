

const fs = require('fs');
const path = require('path');
const Package = require('../models/packageModel')
const APIFeatures = require('../utils/APIFeatures');
const slugify = require('slugify');


exports.getAllPackages = async (req, res) => {

    try {
        const features = new APIFeatures(Package.find(), req.query).filter().sort().limitFields().paginate()
        const allPackage = await features.query;
        res.status(200).json({
            status: 200,
            data: allPackage
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getPackage = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id)
        res.status(200).json({
            status: 200,
            data: package
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

exports.createPackage = async (req, res) => {
    try {
        const newPackage = await Package.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                newPackage
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deletePackage = async (req, res) => {
    try {
        await Package.findByIdAndUpdate(req.params.id, { "availability": false })
        res.status(204).json({
            status: 'success',
            data: "Done"
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }

}
exports.updatePackage = async (req, res) => {
    try {
        const newPackage = await Package.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                newPackage
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }

}

exports.getPackageStats = async (req, res) => {
    try {
        const packages = await Package.find({ ratingsAverage: { $gte: 1.2 } });
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
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {

    try {
        const year = req.params.year * 1;
        const plan = await Package.aggregate([]);
        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });

    } catch {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}
