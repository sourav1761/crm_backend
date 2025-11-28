const Lead = require("../models/Lead");
const Payment = require("../models/Payment");
const WalletTransaction = require("../models/WalletTransaction");

// Create lead
exports.createLead = async (req, res) => {
  try {
    const body = req.body;
    const lead = await Lead.create(body);
    // Optionally create a Payment record for summary display
    await Payment.create({
      lead: lead._id,
      clientName: lead.customerName,
      lastPaymentDate: null,
      paidAmount: lead.paidAmount || 0,
      dueAmount: lead.dueAmount || 0,
      paymentMode: lead.paymentMode || "",
      status: lead.dueAmount <= 0 ? "fully_paid" : "partial"
    });
    res.status(201).json({ success: true, lead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Create lead failed", error: err.message });
  }
};

// Get paginated list / filterable
exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { customerName: new RegExp(search, "i") },
        { phoneNumber: new RegExp(search, "i") },
        { documentNumber: new RegExp(search, "i") }
      ];
    }
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Lead.countDocuments(query);
    res.json({ success: true, leads, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success:false, message: "Lead not found" });
    res.json({ success:true, lead });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};

exports.updateLead = async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // update Payment record if amounts changed
    await Payment.findOneAndUpdate({ lead: updated._id }, {
      paidAmount: updated.paidAmount,
      dueAmount: updated.dueAmount,
      status: updated.dueAmount <= 0 ? "fully_paid" : "partial"
    });
    res.json({ success:true, lead: updated });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};

exports.markCaseCompletion = async (req, res) => {
  // expected body: { completed: true, date: '2025-11-28', result: 'success' }
  try {
    const { completed, date, result } = req.body;
    const updated = await Lead.findByIdAndUpdate(req.params.id, {
      caseCompletion: { completed, date, result }
    }, { new: true });
    res.json({ success:true, lead: updated });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};
