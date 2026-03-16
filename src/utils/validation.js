export const validatePersonal = (form) => {
  const errors = {};

  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.age || form.age < 18 || form.age > 70)
    errors.age = "Age must be between 18 and 70";
  if (!form.city.trim()) errors.city = "City is required";
  if (!form.income || form.income < 100000)
    errors.income = "Income must be at least ₹1,00,000";

  return errors;
};

export const validateFamily = (form) => {
  const errors = {};
  if (!form.familyMembers || form.familyMembers < 1)
    errors.familyMembers = "Must have at least 1 family member";
  return errors;
};

export const validateFinancial = (form) => {
  const errors = {};
  if (form.liabilities < 0) errors.liabilities = "Invalid amount";
  if (form.savings < 0) errors.savings = "Invalid amount";
  return errors;
};

// src/utils/validation.js (snippet)
export const validateCoverage = (form) => {
  const errors = {};
  const sum = Number(form.sumAssured || 0);
  const term = Number(form.coverageTerm || 0);

  if (!sum || sum < 200000) errors.sumAssured = "Minimum sum assured is ₹2,00,000";
  if (!term || term < 5) errors.coverageTerm = "Minimum term is 5 years";

  return errors;
};