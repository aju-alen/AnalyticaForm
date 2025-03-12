// IP ranges for each country (these are simplified examples and may not be 100% accurate)
const countryIPRanges = {
    "AE": [
      { start: "83.110.0.0", end: "83.110.255.255" }
    ],
    "SA": [
      { start: "77.64.0.0", end: "77.64.127.255" }
    ],
    "US": [
      { start: "76.0.0.0", end: "76.255.255.255" }
    ],
    "CN": [
      { start: "58.0.0.0", end: "58.255.255.255" }
    ],
    "UK": [
      { start: "193.60.0.0", end: "193.63.255.255" }
    ],
    "QA": [
    { start: "178.152.0.0", end: "178.153.255.255" },
  ]
  };
  
  // Convert IP string to numeric value for comparison
  function ipToLong(ip) {
    let parts = ip.split('.');
    return (parseInt(parts[0], 10) << 24) |
           (parseInt(parts[1], 10) << 16) |
           (parseInt(parts[2], 10) << 8) |
            parseInt(parts[3], 10);
  }
  
  // Convert numeric value back to IP string
  function longToIp(long) {
    return [
      (long >>> 24) & 255,
      (long >>> 16) & 255,
      (long >>> 8) & 255,
      long & 255
    ].join('.');
  }
  
  // Generate a random IP address within a given range
  function generateRandomIpInRange(startIp, endIp) {
    const start = ipToLong(startIp);
    const end = ipToLong(endIp);
    const randomLong = Math.floor(Math.random() * (end - start + 1)) + start;
    return longToIp(randomLong);
  }
  
  // Generate a specified number of IP addresses for a selected country
  export function generateIpAddressesForCountry(country, count = 100) {
    if (!countryIPRanges[country]) {
      throw new Error(`Country "${country}" is not supported.`);
    }
    
     let result = '';
    const ranges = countryIPRanges[country];
    
    for (let i = 0; i < count; i++) {
      // Select a random range from the country's available ranges
      const randomRangeIndex = Math.floor(Math.random() * ranges.length);
      const range = ranges[randomRangeIndex];
      
      // Generate a random IP within that range
       result = generateRandomIpInRange(range.start, range.end);
    //   console.log(ip, 'ip in generateIpAddressesForCountry');
      
    }
    
    return result;
  }