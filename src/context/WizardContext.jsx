import { createContext, useContext, useState } from "react";

const WizardContext = createContext();

export function WizardProvider({ children }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    city: "",
    income: "",
    familyMembers: "",
    hasDiseases: false,
    smoker: false,
    liabilities: "",
    savings: "",
    sumAssured: "",
    coverageTerm: "",
    riders: []
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <WizardContext.Provider value={{ form, updateForm }}>
      {children}
    </WizardContext.Provider>
  );
}

export const useWizard = () => useContext(WizardContext);
