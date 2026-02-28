const usLocations = [
  ['Birmingham', 'Alabama'],
  ['Anchorage', 'Alaska'],
  ['Phoenix', 'Arizona'],
  ['Little Rock', 'Arkansas'],
  ['Los Angeles', 'California'],
  ['Denver', 'Colorado'],
  ['Hartford', 'Connecticut'],
  ['Wilmington', 'Delaware'],
  ['Miami', 'Florida'],
  ['Atlanta', 'Georgia'],
  ['Honolulu', 'Hawaii'],
  ['Boise', 'Idaho'],
  ['Chicago', 'Illinois'],
  ['Indianapolis', 'Indiana'],
  ['Des Moines', 'Iowa'],
  ['Wichita', 'Kansas'],
  ['Louisville', 'Kentucky'],
  ['New Orleans', 'Louisiana'],
  ['Portland', 'Maine'],
  ['Baltimore', 'Maryland'],
  ['Boston', 'Massachusetts'],
  ['Detroit', 'Michigan'],
  ['Minneapolis', 'Minnesota'],
  ['Jackson', 'Mississippi'],
  ['Kansas City', 'Missouri'],
  ['Billings', 'Montana'],
  ['Omaha', 'Nebraska'],
  ['Las Vegas', 'Nevada'],
  ['Manchester', 'New Hampshire'],
  ['Newark', 'New Jersey'],
  ['Albuquerque', 'New Mexico'],
  ['New York', 'New York'],
  ['Charlotte', 'North Carolina'],
  ['Fargo', 'North Dakota'],
  ['Columbus', 'Ohio'],
  ['Oklahoma City', 'Oklahoma'],
  ['Portland', 'Oregon'],
  ['Philadelphia', 'Pennsylvania'],
  ['Providence', 'Rhode Island'],
  ['Charleston', 'South Carolina'],
  ['Sioux Falls', 'South Dakota'],
  ['Nashville', 'Tennessee'],
  ['Austin', 'Texas'],
  ['Salt Lake City', 'Utah'],
  ['Burlington', 'Vermont'],
  ['Richmond', 'Virginia'],
  ['Seattle', 'Washington'],
  ['Charleston', 'West Virginia'],
  ['Milwaukee', 'Wisconsin'],
  ['Cheyenne', 'Wyoming'],
];

const femaleNames = [
  'Ava', 'Mia', 'Luna', 'Sofia', 'Emma', 'Olivia', 'Aria', 'Nora', 'Grace', 'Chloe',
  'Ella', 'Scarlett', 'Aurora', 'Layla', 'Zoe', 'Harper', 'Ivy', 'Nova', 'Stella', 'Leah',
  'Naomi', 'Hazel', 'Ruby', 'Violet', 'Camila', 'Elena', 'Maya', 'Alice', 'Kinsley', 'Julia',
];

const maleNames = [
  'Liam', 'Noah', 'Ethan', 'Mason', 'Lucas', 'Logan', 'Elijah', 'James', 'Aiden', 'Benjamin',
  'Jacob', 'Jackson', 'Owen', 'Levi', 'Sebastian', 'Mateo', 'Julian', 'Ezra', 'Leo', 'Asher',
  'Caleb', 'Carter', 'Nathan', 'Ryan', 'Wyatt', 'Adrian', 'Miles', 'Connor', 'Dominic', 'Theo',
];

const lastNames = [
  'Hayes', 'Brooks', 'Parker', 'Morgan', 'Bennett', 'Reed', 'Foster', 'Griffin', 'Diaz', 'Rivera',
  'Coleman', 'Ward', 'Hayden', 'Bishop', 'Sullivan', 'Pierce', 'Keller', 'Hughes', 'West', 'Shaw',
];

const ethnicities = ['Caucasian', 'Black', 'Asian', 'Latino', 'Mixed', 'Middle Eastern'];
const hairColors = ['Black', 'Brown', 'Blonde', 'Auburn', 'Red'];
const eyeColors = ['Brown', 'Blue', 'Hazel', 'Green'];
const languages = [['English'], ['English', 'Spanish'], ['English', 'French'], ['English', 'Portuguese']];
const availabilityOptions = ['Available Today', 'Available Tonight', 'Available Weekends', 'Available Now'];
const responseTimes = ['Within 15 minutes', 'Within 30 minutes', 'Within 1 hour', 'Within 2 hours'];
const servicesPool = [
  ['Dinner Dates', 'City Tours', 'Weekend Getaways'],
  ['Fine Dining', 'Event Companion', 'Travel'],
  ['Coffee Dates', 'Night Out', 'Road Trips'],
  ['Cultural Events', 'Museum Visits', 'Concert Nights'],
];

const profileTypesByPrefix = {
  male: { label: 'Straight Men', gender: 'Male', orientation: 'Straight', names: maleNames },
  man: { label: 'Straight Men', gender: 'Male', orientation: 'Straight', names: maleNames },
  gay: { label: 'Gay Men', gender: 'Male', orientation: 'Gay', names: maleNames },
  woman: { label: 'Straight Women', gender: 'Female', orientation: 'Straight', names: femaleNames },
  lesbian: { label: 'Lesbian Women', gender: 'Female', orientation: 'Lesbian', names: femaleNames },
};

const assetModules = import.meta.glob('../assets/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true });

const getAssetPrefix = (filename) => {
  const lower = filename.toLowerCase();
  if (lower.startsWith('male')) return 'male';
  if (lower.startsWith('man')) return 'man';
  if (lower.startsWith('gay')) return 'gay';
  if (lower.startsWith('woman')) return 'woman';
  if (lower.startsWith('lesbian')) return 'lesbian';
  return null;
};

const assetEntries = Object.entries(assetModules)
  .map(([assetPath, module]) => {
    const filename = assetPath.split('/').pop() || '';
    const prefix = getAssetPrefix(filename);
    if (!prefix) return null;
    return {
      filename,
      prefix,
      imageUrl: module.default || module,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.filename.localeCompare(b.filename));

const buildProfile = (asset, index, typeIndex) => {
  const type = profileTypesByPrefix[asset.prefix];
  const [city, state] = usLocations[index % usLocations.length];
  const firstName = type.names[typeIndex % type.names.length];
  const lastName = lastNames[(index * 3) % lastNames.length];
  const age = 22 + (index % 12);
  const rate = 300 + ((index * 17) % 650);
  const rating = Number((4.5 + ((index % 6) * 0.1)).toFixed(1));

  return {
    id: index + 1,
    name: `${firstName} ${lastName}`,
    age,
    gender: type.gender,
    orientation: type.orientation,
    category: type.label,
    location: `${city}, ${state}, USA`,
    height: type.gender === 'Male' ? `6'${index % 5}"` : `5'${(index % 8) + 1}"`,
    weight: type.gender === 'Male' ? `${160 + (index % 40)} lbs` : `${110 + (index % 30)} lbs`,
    measurements: type.gender === 'Male' ? `${38 + (index % 6)}-${30 + (index % 4)}-${38 + (index % 6)}` : `${32 + (index % 5)}-${24 + (index % 4)}-${33 + (index % 5)}`,
    ethnicity: ethnicities[index % ethnicities.length],
    hairColor: hairColors[index % hairColors.length],
    eyeColor: eyeColors[index % eyeColors.length],
    languages: languages[index % languages.length],
    rate,
    rateUnit: 'hour',
    rating,
    reviews: 3 + (index % 40),
    verified: index % 4 !== 0,
    featured: index % 9 === 0,
    about: `${type.label} profile based in ${city}, ${state}. Friendly, respectful, and great company for social events.`,
    services: servicesPool[index % servicesPool.length],
    image: asset.imageUrl,
    gallery: [asset.imageUrl],
    availability: availabilityOptions[index % availabilityOptions.length],
    responseTime: responseTimes[index % responseTimes.length],
  };
};

const typeCounters = { male: 0, man: 0, gay: 0, woman: 0, lesbian: 0 };
const mockProfiles = assetEntries.map((asset, index) => {
  const typeIndex = typeCounters[asset.prefix];
  typeCounters[asset.prefix] += 1;
  return buildProfile(asset, index, typeIndex);
});

export default mockProfiles;
