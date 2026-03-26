import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: [true, 'Please provide an employee name.'],
  },
  employeeAddress: {
    type: String,
    required: [true, 'Please provide an employee address.'],
  },
  employeeId: {
    type: String,
    required: [true, 'Please provide an employee ID.'],
    unique: true,
  },
  employeeEmail: {
    type: String,
    required: [true, 'Please provide an employee email.'],
  },
  employeePhoneNumber: {
    type: String,
    required: [true, 'Please provide an employee phone number.'],
  },
  employeePost: {
    type: String,
    required: [true, 'Please provide the employee post/designation.'],
  },
  employeeBloodGroup: {
    type: String,
    default: '',
  },
  dateOfJoining: {
    type: Date,
    required: [true, 'Please provide the date of joining.'],
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
EmployeeSchema.pre('save', function () {
  this.updatedAt = new Date();
});

if (mongoose.models.Employee) {
  // Clear the cached model when the schema changes during development HMR
  delete mongoose.models.Employee;
}

export default mongoose.model('Employee', EmployeeSchema);
