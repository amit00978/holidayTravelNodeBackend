const Razorpay = require("razorpay");
const packageModel = require('../models/packageModel');
const catchAsync = require('../utils/catchAsync');

 const calculateTourPackagePrice = (price) => {
    let res = ((price * 1.1)/2).toFixed(2)
    return res
}
 exports.razorPayOrder = catchAsync(async (req, res)  =>{

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
    const { slug ,adults =1 , minors=0 } = req.body;
    const package = await packageModel.findOne({slug:slug});
    let amount = calculateTourPackagePrice(package.price.adult)*1
    let new_adults = adults+minors
    if(new_adults>1){
        amount = amount * new_adults
    }

  const razorpay = new Razorpay({
    key_id: 'rzp_live_ABRo8ZHC7U6eXP',
    key_secret: 'Q7vLUZ0R4HqQV2KtWO9cNU94',
        // key_id: 'rzp_test_6hDjACICShA0jf',
        // key_secret: 'nCcnf2dHEYE77OboDLJ2lxs9'
  });

  const options = {
    amount: amount *100, // ₹30,000 in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating Razorpay order" });
  }
})
