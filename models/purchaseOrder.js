const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true }, // رقم مميز لأمر الشراء
  supplier: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Supplier', 
    required: true 
  },
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantityOrdered: { type: Number, required: true, min: 1 },
    quantityReceived: { type: Number, default: 0, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalItemCost: { type: Number, required: true, min: 0 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Pending Approval', 'Approved', 'Partially Received', 'Completed', 'Cancelled'],
    default: 'Draft'
  },
  expectedDeliveryDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // لو فيه Authentication
}, { timestamps: true });



module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);