import asyncHandler from 'express-async-handler';
import Vehicle from '../models/Vehicle.js';
import ActivityLog from '../models/ActivityLog.js';

const CITY_CODES = {
  'Valsad':    { code: 'GJ 15', letters: ['AA','AB','AC','AD','AE'] },
  'Navsari':   { code: 'GJ 21', letters: ['XA','XB','XC','XD','XE'] },
  'Surat':     { code: 'GJ 05', letters: ['BA','BB','BC','BD','BE'] },
  'Vadodara':  { code: 'GJ 06', letters: ['CA','CB','CC','CD','CE'] },
  'Ahmedabad': { code: 'GJ 01', letters: ['DA','DB','DC','DD','DE'] },
};

function generateGJCode(city) {
  const cityData = CITY_CODES[city];
  if (!cityData) return null;
  const letters = cityData.letters[Math.floor(Math.random() * cityData.letters.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${cityData.code} ${letters} ${number}`;
}

export const registerVehicle = asyncHandler(async (req, res) => {
  const { vehicleType, brand, model, year, color, engineNumber, chassisNumber, fuelType, insuranceCompany, insuranceExpiry, city } = req.body;
  const exists = await Vehicle.findOne({ $or: [{ engineNumber }, { chassisNumber }] });
  if (exists) {
    res.status(400);
    throw new Error('Vehicle with this engine/chassis number already registered');
  }
  const vehicle = await Vehicle.create({
    ownerId: req.user._id,
    ownerName: req.user.name,
    vehicleType, brand, model, year, color, engineNumber, chassisNumber, fuelType, insuranceCompany, insuranceExpiry,
    city: city || null,
  });
  res.status(201).json(vehicle);
});

export const getMyVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ ownerId: req.user._id });
  res.json(vehicles);
});

export const getAllVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({});
  res.json(vehicles);
});

export const approveVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (vehicle) {
    vehicle.registrationStatus = req.body.registrationStatus;
    vehicle.notes = req.body.notes;
    if (req.body.registrationStatus === 'Approved') {
      // Generate GJ city code if city is set, else generic RC
      if (vehicle.city && CITY_CODES[vehicle.city]) {
        vehicle.gjCode = generateGJCode(vehicle.city);
        vehicle.rcNumber = vehicle.gjCode;
      } else {
        vehicle.rcNumber = 'RC-' + Math.random().toString(36).toUpperCase().substring(2, 10);
      }
    }
    const updated = await vehicle.save();
    await ActivityLog.create({
      text: `Vehicle "${vehicle.brand} ${vehicle.model}" (${vehicle.city || 'N/A'}) ${req.body.registrationStatus === 'Approved' ? 'approved, RC: ' + vehicle.rcNumber : 'rejected'}.`,
      type: req.body.registrationStatus === 'Approved' ? 'success' : 'danger',
      actor: 'Officer',
    });
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});
