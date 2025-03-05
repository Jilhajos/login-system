require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");

async function initiatePayment(req, res, attempt = 1) {
    try {
        // Load environment variables
        const merchantId = process.env.MERCHANT_ID;
        const saltKey = process.env.SALT_KEY;
        const saltIndex = process.env.SALT_INDEX;
        const phonePeUrl = process.env.PHONEPE_URL;
        const callbackUrl = process.env.CALLBACK_URL;

        // Generate a unique transaction ID
        const transactionId = "TXN" + new Date().getTime();

        // Request payload
        const requestBody = {
            merchantId: merchantId,
            merchantTransactionId: transactionId,
            merchantUserId: "MUID123",
            amount: 100000,  // ₹1000 in paise
            redirectUrl: "http://localhost:5000/payment-success",
            redirectMode: "REDIRECT",
            callbackUrl: callbackUrl,
            paymentInstrument: { type: "PAY_PAGE" },
            mobileNumber: "9876543210"
        };

        // Encode requestBody in Base64
        const base64Request = Buffer.from(JSON.stringify(requestBody)).toString("base64");

        // Correct X-VERIFY Hash Calculation
        const apiEndpoint = "/pg/v1/pay";
        const xVerifyString = base64Request + apiEndpoint + saltKey;
        const xVerifyHash = crypto.createHash("sha256").update(xVerifyString).digest("hex");
        const xVerify = `${xVerifyHash}###${saltIndex}`;

        // Debug Logs (Remove in Production)
        console.log("Base64 Request Body:", base64Request);
        console.log("X-VERIFY Header:", xVerify);

        // Send request to PhonePe API
        const response = await axios.post(
            phonePeUrl,
            { request: base64Request },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": xVerify
                }
            }
        );

        return res.json(response.data);
    } catch (error) {
        console.error(`Attempt ${attempt}: Payment initiation error:`, error.message);

        // If API returns 429 TOO_MANY_REQUESTS, retry with exponential backoff
        if (error.response && error.response.status === 429) {
            if (attempt < 5) {
                const delay = Math.pow(2, attempt) * 1000; // Exponential backoff (2^attempt seconds)
                console.warn(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
                setTimeout(() => initiatePayment(req, res, attempt + 1), delay);
                return;
            } else {
                console.error("Max retry attempts reached. Payment failed.");
                return res.status(429).json({ error: "Too many requests. Please try again later." });
            }
        }

        // If it's another error, return the error response
        if (error.response) {
            console.error("Response Data:", error.response.data);
            return res.status(error.response.status).json(error.response.data);
        }

        return res.status(500).json({ error: "Payment initiation failed." });
    }
}

// Export the function for Express
exports.initiatePayment = initiatePayment;
