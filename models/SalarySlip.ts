import mongoose from 'mongoose';

const SalarySlipSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Please provide the employee ID.'],
  },
  employeeName: {
    type: String,
    required: [true, 'Please provide the employee name.'],
  },
  employeePost: {
    type: String,
    required: [true, 'Please provide the employee post.'],
  },
  month: {
    type: String,
    required: [true, 'Please provide the salary month.'],
  },
  year: {
    type: Number,
    required: [true, 'Please provide the salary year.'],
  },
  basicSalary: {
    type: Number,
    required: [true, 'Please provide the basic salary.'],
  },
  hra: {
    type: Number,
    required: [true, 'Please provide the HRA.'],
  },
  allowances: {
    type: Number,
    required: [true, 'Please provide allowances.'],
  },
  bonus: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    required: [true, 'Please provide deductions.'],
  },
  grossSalary: {
    type: Number,
    required: true,
  },
  netSalary: {
    type: Number,
    required: true,
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
SalarySlipSchema.pre('save', function () {
  this.updatedAt = new Date();
});

if (mongoose.models.SalarySlip) {
  delete mongoose.models.SalarySlip;
}

export default mongoose.model('SalarySlip', SalarySlipSchema);
