const mongoose = require("mongoose");

const CaseCompletionSchema = new mongoose.Schema({
  completed: { type: Boolean, default: false },
  date: { type: Date },
  result: { type: String, enum: ["success","unsuccess",""] }
});

const LeadSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phoneNumber: { type: String },
  buyerName: { type: String },
  sellerName: { type: String },
  propertyLocation: { type: String },
  documentType: { type: String },
  documentNumber: { type: String },
  documentDate: { type: Date },
  documentStatus: { type: String },
  stampDuty: { type: Number, default: 0 },
  registrationFees: { type: Number, default: 0 },
  registrarCommission: { type: Number, default: 0 },
  agentCommission: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  fullAmount: { type: Number, default: 0 },
  paymentType: { type: String },
  paymentMode: { type: String },
  remarks: { type: String },
  caseCompletion: CaseCompletionSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

LeadSchema.pre("save", function() {
  this.updatedAt = Date.now();
  
});

module.exports = mongoose.model("Lead", LeadSchema);
