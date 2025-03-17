const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const Member = require('../models/Member'); // Import the Member model

const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const MERCHANT_ID = "PGTESTPAYUAT86";

const MERCHANT_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const MERCHANT_STATUS_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";

const redirectUrl = "http://localhost:5000/api/payment/status";
const successUrl = "http://localhost:3000/payment-success";
const failureUrl = "http://localhost:3000/payment-failure";

//Create Payment Order for PhonePe after verifying membership
exports.createOrder = async (req, res) => {
    try {
        const { membershipID, amount, membership_plan } = req.body;
        if (!membershipID || !amount || !membership_plan) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const member = await Member.findOne({ membershipID });
        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        const orderId = uuidv4();

        const paymentPayload = {
            merchantId: MERCHANT_ID,
            merchantUserId: membershipID,
            mobileNumber: member.mobileNumber,
            amount: amount * 100, // Convert to paise
            merchantTransactionId: orderId,
            redirectUrl: `${redirectUrl}?id=${orderId}&membershipID=${membershipID}&membership_plan=${membership_plan}`, // Passing membership ID and plan
            redirectMode: 'POST',
            paymentInstrument: { type: 'PAY_PAGE' }
        };

        // Encrypt the payload
        const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
        const keyIndex = 1;
        const stringToHash = payload + '/pg/v1/pay' + MERCHANT_KEY;
        const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const options = {
            method: 'POST',
            url: MERCHANT_BASE_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: { request: payload }
        };

        const response = await axios.request(options);

        if (response.data.success === true) {
            return res.status(200).json({ msg: "OK", url: response.data.data.instrumentResponse.redirectInfo.url });
        } else {
            return res.status(400).json({ error: "Failed to create order", details: response.data });
        }
    } catch (error) {
        console.error("Error in createOrder:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.checkPaymentStatus = async (req, res) => {
    try {
        const { id: merchantTransactionId, membershipID, membership_plan } = req.query;

        if (!merchantTransactionId || !membershipID || !membership_plan) {
            return res.status(400).json({ error: "Transaction ID, Membership ID, and Membership Plan are required" });
        }

        const keyIndex = 1;
        const stringToHash = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
        const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const options = {
            method: 'GET',
            url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': MERCHANT_ID
            },
        };

        const response = await axios.request(options);

        if (!response.data.success) {
            // If payment failed, set membership status to inactive
            await Member.findOneAndUpdate(
                { membershipID },
                { membershipStatus: "Inactive" }
            );
            return res.redirect(failureUrl);
        }

        // Ensure the member exists before updating
        const member = await Member.findOne({ membershipID });
        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        // Calculate renewal date based on the membership plan
        let renewalDate = new Date();

        if (membership_plan === "monthly") {
            renewalDate.setMonth(renewalDate.getMonth() + 1);
        } else if (membership_plan === "quarterly") {
            renewalDate.setMonth(renewalDate.getMonth() + 3);
        } else if (membership_plan === "yearly") {
            renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        } else {
            return res.status(400).json({ error: "Invalid membership plan" });
        }

        // Debugging: Log to ensure the date is calculated
        console.log(`Renewal Date for ${membershipID}:`, renewalDate);

        //  Update member details in DB (Using correct field `renewalDate`)
        const updateResult = await Member.findOneAndUpdate(
            { membershipID },
            {
                payment_date: new Date(), 
                renewal_date: renewalDate, 
                amount_Paid: response.data.data.amount / 100, 
                payment_status: "completed", 
                membership_status: "Active",
                membership_plan: membership_plan
            },
            { new: true }
        );
        
        if (!updateResult) {
            return res.status(500).json({ error: "Failed to update member details" });
        }

        return res.redirect(successUrl);
    } catch (error) {
        console.error("Error in checkPaymentStatus:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};