import mongoose from 'mongoose';

const OpportunitySchema = new mongoose.Schema({
  opportunityId: {
    type: String,
    unique: true,
  },
  detailName: {
    type: String,
    required: [true, 'Please provide the detail name (admin).'],
  },
  projectName: {
    type: String,
    required: [true, 'Please provide a project name.'],
  },
  dealerName: {
    type: String,
    required: [true, 'Please provide a dealer name.'],
  },
  dealerAddress: {
    type: String,
    required: [true, 'Please provide a dealer address.'],
  },
  note: {
    type: String,
    default: '',
  },
  projectValuation: {
    type: Number,
    required: [true, 'Please provide a project valuation.'],
  },
  durationOfProject: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Open', 'Closed-Won', 'Closed-Lost'],
    default: 'Open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
OpportunitySchema.pre('save', function () {
  this.updatedAt = new Date();
});

// Auto-generate opportunityId (e.g., OPP001, OPP002) before validation
OpportunitySchema.pre('validate', async function () {
  if (this.isNew && !this.opportunityId) {
    try {
      const lastOpportunity = await (this.constructor as any)
        .findOne({}, { opportunityId: 1 })
        .sort({ opportunityId: -1 })
        .exec();

      if (lastOpportunity && lastOpportunity.opportunityId) {
        const lastId = lastOpportunity.opportunityId;
        const numberPart = parseInt(lastId.replace('OPP', ''), 10);
        const nextNumber = isNaN(numberPart) ? 1 : numberPart + 1;
        this.opportunityId = `OPP${nextNumber.toString().padStart(3, '0')}`;
      } else {
        this.opportunityId = 'OPP001';
      }
    } catch (error) {
      throw error;
    }
  }
});

if (mongoose.models.Opportunity) {
  // Clear the cached model when the schema changes during development HMR
  delete mongoose.models.Opportunity;
}

export default mongoose.model('Opportunity', OpportunitySchema);
