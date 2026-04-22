import Salary from '../models/Salary.js';

// 🔥 Get salary by officer ID
export const getOfficerSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const salaries = await Salary.find({ officerId: id }).sort({ createdAt: -1 });

    res.json(salaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};