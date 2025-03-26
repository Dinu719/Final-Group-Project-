const {buyerData, insertBuyer, getBuyer, updateBuyer, updatePassword, getLaptopCases, getiPhoneCases, getHoodies, getTShirts, processPayment, insertOP, getPO, getTables} = require("../models/queries");

async function processBD() {
try {
const data = await buyerData();
return data;
} catch (error) {
console.error('Error:', error);
throw error;
}
}

async function addBuyer(fName, emailAddress, birthday, phoneNumber, password) {
try {
await insertBuyer(fName, emailAddress, birthday, phoneNumber, password);
} catch (error) {
console.error('Error:', error);
throw error;
}
}

async function getBuyerByEmail(email) {
try {
const user = await getBuyer(email);
return user;
} catch (error) {
console.error('Error:', error);
throw error;
}
}

async function updateDetails(bID, fullName, emailAddress, DOB, phoneNumber, password) {
try {
const result = await updateBuyer(bID, fullName, emailAddress, DOB, phoneNumber, password);
return result;
} catch (error) {
console.error('Error:', error);
throw error;
}
}

const updatePasswordByEmail = async (email, newPassword) => {
try {
const result = await updatePassword(email, newPassword);
return result;
} catch (error) {
console.error('Error:', error);
throw error;
}
};

async function getTech() {
try {
const {laptopCases, logos: laptopLogos} = await getLaptopCases();
const {iPhoneCases, logos: iPhoneLogos} = await getiPhoneCases();
return {laptopCases, iPhoneCases, laptopLogos, iPhoneLogos};
} catch (error) {
console.error('Error:', error);
throw error;
}
}

async function getClothing() {
try {
const {hoodies, logos: hoodieLogos} = await getHoodies();
const {tShirts, logos: tShirtLogos} = await getTShirts();
return {hoodies, tShirts, hoodieLogos, tShirtLogos};
} catch (error) {
console.error('Error:', error);
throw error;
}
}

const handlePayment = async (buyerID, cardName, cardNumber, expDate, cvv, address, city, state, zip, totalAmount) => {
try {
const result = await processPayment(buyerID, cardName, cardNumber, expDate, cvv, address, city, state, zip, totalAmount);
return result;
} catch (error) {
console.error('Error:', error);
throw error;
}
};

async function insertOrdersProducts(oID, prID, loID, quantity, detail, detailType) {
try {
const result = await insertOP(oID, prID, loID, quantity, detail, detailType);
return result;
} catch (error) {
console.error('Error:', error);
throw error;
}
}

async function getPastOrders(bID) {
try {
const orders = await getPO(bID);
return orders;
} catch (error) {
console.error('Error:', error);
throw error;
}
}

const predefinedResponses = {
"what's the most popular item?": "The Black T-Shirt With No Logo.",
"how long can it take for a refund?": "Refunds usually take 5-7 business days to process, depending on your payment method."
};
async function handleChatBot (message) {
try {
console.log('Message:', message);
if (predefinedResponses[message.toLowerCase()]) {
return predefinedResponses[message.toLowerCase()];
} else {
return "Sorry, I can only answer those specific questions!";
}
} catch (error) {
console.error('Error:', error);
throw error;
}
};

const showTables = async () => {
try {
const tableNames = await getTables(); // Call the query to get tables
console.log('group2:');
console.log(JSON.stringify({ tables: tableNames }, null, 2)); // Log result
} catch (err) {
console.error('Error:', err);
}
};

module.exports = {processBD, addBuyer, getBuyerByEmail, updateDetails, updatePasswordByEmail, getTech, getClothing, handlePayment, insertOrdersProducts, getPastOrders, handleChatBot, showTables}; // Export the function to use elsewhere if needed