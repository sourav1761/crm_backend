const Lead = require("../models/Lead");
const Payment = require("../models/Payment");

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const body = req.body;

    // Create lead with all required arrays
    const lead = await Lead.create({
      ...body,
      stampDutyTransactions: body.stampDutyTransactions || [],
      registrationFeesTransactions: body.registrationFeesTransactions || []
    });

    // Create Payment summary card
    await Payment.create({
      lead: lead._id,
      clientName: lead.customerName,
      lastPaymentDate: null,
      paidAmount: lead.paidAmount || 0,
      dueAmount: lead.dueAmount || 0,
      paymentMode: lead.paymentMode || "",
      status: (lead.dueAmount || 0) <= 0 ? "fully_paid" : "partial"
    });

    res.status(201).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Leads (pagination + search)
exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { customerName: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
        { docNo: new RegExp(search, "i") }
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

// Get Lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update lead
exports.updateLead = async (req, res) => {
  try {
    const body = req.body;

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        ...body,
        stampDutyTransactions: body.stampDutyTransactions || [],
        registrationFeesTransactions: body.registrationFeesTransactions || []
      },
      { new: true }
    );

    // Update payment summary
    await Payment.findOneAndUpdate(
      { lead: updated._id },
      {
        paidAmount: updated.paidAmount,
        dueAmount: updated.dueAmount,
        status: updated.dueAmount <= 0 ? "fully_paid" : "partial"
      }
    );

    res.json({ success: true, lead: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark case complete
exports.markCaseCompletion = async (req, res) => {
  try {
    const { markCompleted, completionDate, finalOutcome } = req.body;

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { markCompleted, completionDate, finalOutcome },
      { new: true }
    );

    res.json({ success: true, lead: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
