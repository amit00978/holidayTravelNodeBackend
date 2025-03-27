

const fs = require('fs');
const path = require('path');
const Package = require('../models/packageModel')
// const filePath = path.join(__dirname, 'tourPackage.json');
// const packages = JSON.parse(fs.readFileSync(filePath, 'utf8'))


exports.getAllPackages = async (req, res) => {

    try {
        // 1 . Filtering
        let queryObj = {...req.query}
        const excluded = ['page','sort','limit','fields']
        excluded.forEach(el => delete queryObj[el])

        // 2// Advance Filter
        let queryString = JSON.stringify(queryObj);
        queryString= queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        queryObj = JSON.parse(queryString);

        // 3 Sorting


        let query = Package.find(queryObj);
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query= query.sort(sortBy);
        }else{
            query = query.sort('-createdAt');
        }

        // 4 Field Limiting
        if(req.query.fields){
            const fields=req.query.fields.split(',').join(' ')``
            query = query.select(fields)
        }else{
            query = query.select('-__v')
        }

        // 5 Paggination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit *1 || 100;
        const skip =(page-1) * limit

        query = query.skip(skip).limit(limit)
        if(req.query.page){
            const numPackage = await Package.countDocuments();
            if(skip>=numPackage)throw new Error("This page does not exist");
        }
        const allPackage = await query;
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

exports.deletePackage = async  (req, res) => {

    try {
        await Package.findByIdAndUpdate(req.params.id,{  "availability": false})
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
        const newPackage = await Package.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators:true
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