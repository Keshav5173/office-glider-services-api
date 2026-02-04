import admin from "firebase-admin";



/**
 * Initialize Firebase Admin SDK safely
 */
const firebaseAdmin = async () => {
  try {
    // ✅ If already initialized, reuse it
    if (admin.apps.length > 0) {
      return admin.app();
    }

    // const getSetting = await Setting.findOne({}, "notifications");

    const firebase_credential = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URI,
    };

    // if (
    //   !getSetting ||
    //   !getSetting.notifications ||
    //   !getSetting.notifications.firebase_database_url ||
    //   !getSetting.notifications.firebase_credential
    // ) {
    //   throw new Error("Missing Firebase credentials or database URL");
    // }

    const firebase_database_url = process.env.FIREBASE_DATABASE_URL;
    // const firebase_credential = getSetting.notifications.firebase_credential;

    const app = admin.initializeApp({
      credential: admin.credential.cert(firebase_credential),
      databaseURL: firebase_database_url,
    });

    console.log(" Firebase initialized once");
    return app;

  } catch (err) {
    console.error(" Error initializing Firebase:", err);
    throw err;
  }
};



/**
 * Send multicast notification
 */
const sendMultiNotification = async (req, res) => {
    const {title, message, data, tokens} =req.body;
  try {
    const firebase = await firebaseAdmin();

    if (!tokens || !tokens.length) {
      throw new Error("No device tokens provided");
    }

    let customData = {};
    if (data && typeof data === "object") {
      customData = { metadata: JSON.stringify(data) };
    } else if (typeof data === "string" && data !== "") {
      customData = { metadata: data };
    }

    const messagePayload = {
      tokens: tokens, // max 500
      notification: {
        title,
        body: message,
      },
      data: {
        title: String(title),
        message: String(message),
        ...customData,
      },
      android: { priority: "high" },
      apns: { payload: { aps: { sound: "default" } } },
    };

    const response = await firebase.messaging().sendEachForMulticast(messagePayload);

    console.log("📢 Multicast:", response.successCount, response.failureCount);
    return res.status(200).json({
        message: "Messages send successfully",
        status: true,
        data: response
    });

  } catch (err) {
    console.error("❌ Error sending multicast notification:", err);
    // return { successCount: 0, failureCount: tokens.length };
    return res.status(500).json({
        message: "error occured during sending fcm notifications",
        status: false,
        data: response.failureCount
    })
  }
};

export default {
    sendMultiNotification,
}