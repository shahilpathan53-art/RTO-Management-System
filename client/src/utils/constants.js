export const TRAFFIC_TEST_QUESTIONS = [
  {
    id: 1,
    question: "Near a pedestrian crossing, when pedestrians are waiting, you should:",
    options: [
      "Sound horn and proceed",
      "Slow down and pass",
      "Stop and allow pedestrians to cross",
      "Speed up"
    ],
    answer: 2
  },
  {
    id: 2,
    question: "The following sign represents:",
    image: "https://tse4.mm.bing.net/th/id/OIP.sAPF42qmo7xOq6dBbXNYGAHaHa?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3",
    options: ["Stop", "No Entry", "Hospital ahead", "Turn left"],
    answer: 0
  },
  {
    id: 3,
    question: "Red traffic signal means:",
    options: ["Go", "Stop", "Slow down", "Turn left"],
    answer: 1
  },
  {
    id: 4,
    question: "Yellow traffic signal indicates:",
    options: ["Stop", "Go", "Slow down and prepare to stop", "Turn right"],
    answer: 2
  },
  {
    id: 5,
    question: "Green traffic signal means:",
    options: ["Stop", "Go", "Wait", "Slow down"],
    answer: 1
  },
  {
    id: 6,
    question: "Using mobile phone while driving is:",
    options: ["Allowed", "Allowed with earphones", "Prohibited", "Allowed at night"],
    answer: 2
  },
  {
    id: 7,
    question: "When approaching a zebra crossing, you must:",
    options: [
      "Speed up",
      "Stop if pedestrians are crossing",
      "Honk continuously",
      "Ignore"
    ],
    answer: 1
  },
  {
    id: 8,
    question: "The following sign represents:",
    image: "https://tse4.mm.bing.net/th/id/OIP.9i1QxbMLr5Y__o0IPMkJPgHaHZ?cb=thfc1&w=1714&h=1711&rs=1&pid=ImgDetMain&o=7&rm=3",
    options: ["Stop", "No Entry", "Parking", "Hospital"],
    answer: 1
  },
  {
    id: 9,
    question: "Driving under influence of alcohol is:",
    options: ["Allowed", "Allowed at night", "Prohibited", "Allowed in emergency"],
    answer: 2
  },
  {
    id: 10,
    question: "Overtaking should be done from:",
    options: ["Left", "Right", "Any side", "Not allowed"],
    answer: 1
  },
  {
    id: 11,
    question: "The following sign represents:",
    image: "https://image.shutterstock.com/z/stock-vector-pedestrian-crosswalk-road-sign-vector-illustration-of-yellow-triangle-warning-sign-with-human-1990080179.jpg",
    options: ["Stop", "No Entry", "Give Way", "Hospital"],
    answer: 2
  },
  {
    id: 12,
    question: "Validity of Learning License is:",
    options: ["3 months", "6 months", "1 year", "Lifetime"],
    answer: 1
  },
  {
    id: 13,
    question: "Seat belt is:",
    options: ["Optional", "Required only on highway", "Mandatory", "Not needed"],
    answer: 2
  },
  {
    id: 14,
    question: "Helmet is compulsory for:",
    options: ["Driver only", "Pillion rider only", "Both rider and pillion", "Optional"],
    answer: 2
  },
  {
    id: 15,
    question: "The following sign represents:",
    image: "https://tse2.mm.bing.net/th/id/OIP.O7vXqnBgzbtpttirlV2AQAHaG1?cb=thfc1&w=1500&h=1386&rs=1&pid=ImgDetMain&o=7&rm=3",
    options: ["Hospital ahead", "Parking", "Stop", "School"],
    answer: 0
  }
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const VEHICLE_TYPES = ["Two Wheeler", "Four Wheeler (LMV)", "Heavy Motor Vehicle (HMV)"];
export const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];

export const TIME_SLOTS = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

export const SERVICE_TYPES = [
  "LL Related",
  "DL Related",
  "Vehicle Registration",
  "Address Change",
  "NOC Issuance",
  "Other"
];

export const DELIVERY_STAGES = ["Processing", "Printed", "Dispatched", "Delivered"];

export const GUJARAT_CITIES = [
  { name: 'Ahmedabad', prefix: 'GJ 01' },
  { name: 'Surat',     prefix: 'GJ 05' },
  { name: 'Vadodara',  prefix: 'GJ 06' },
  { name: 'Navsari',   prefix: 'GJ 21' },
  { name: 'Valsad',    prefix: 'GJ 15' },
];

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
