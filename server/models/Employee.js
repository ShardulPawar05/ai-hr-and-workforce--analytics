const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dept: { type: String, required: true },
  satisfaction: Number,
  attendance: Number,
  workLoad: Number,
  peerRating: Number,
  lastPromotion: Number,
  
  // --- YEH FIELDS ADD KARNA ZAROORI HAI ---
  productivity: { 
    type: Number, 
    default: 0 
  },
  attritionRisk: { 
    type: Number, 
    default: 0 
  },
  aiRecommendation: { 
    type: String, 
    default: "No recommendation available" 
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('employee', EmployeeSchema);