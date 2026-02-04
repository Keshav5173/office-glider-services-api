import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getInvoices = async (req, res) => {
  try {

    // const {userDetail, templateName} = req.body;
    const templateName = "invoice"
    const userDetail = {
  company: {
    name: "Office Glider",
    logo: "data:image/png;base64,LOGO_BASE64_HERE",
    email: "developer@pravaah.in",
    address: "Jaipur, Rajasthan, India",
    phone: "8000000000",
    timezone: "Asia/Kolkata",
    default_country: "India",
    default_currency: "₹",
  },

  customer: {
    fullname: "Nine Zero",
    phone: "9090909090",
    email: "ninezero@gmail.com",
    address: "Malviya Nagar, Jaipur",
  },

  // Route Info
  pickup_name: "Jaipur",
  dropoff_name: "Udaipur",

  // Trip Duration
  start_date: "01-02-2026",
  end_date: "03-02-2026",

  // Morning Trip
  start_time: "09:00 AM",
  end_time: "06:00 PM",

  // Return Trip (Evening)
  return_start_time: "07:00 PM",
  return_drop_time: "10:00 PM",

  // Booking Info
  route_name: "Jaipur - Udaipur Express",
  method: "Card",
  pnr_no: "4267989",
  booking_date: "January 24, 2026 2:30 PM",
  created_date: "January 24, 2026 12:21 PM",

  // Pricing
  sub_total: "94.71",
  tax: "5%",
  tax_amount: "19.21",
  discount: "0",
  final_total_fare: "359",

  // Offer & Pass
  isPass: false,
  pass: {
    no_of_rides: 0
  },

  isOffer: false,
  offer: {
    discount_amount: "0",
    final_total_after_discount: "359"
  }
};


    // Logo path
    const logoPath = path.join(__dirname, "../../Assets/companyLogo.png");

    if (!fs.existsSync(logoPath)) {
      console.error("Logo not found at:", logoPath);
    }

    const logoBase64 = fs.readFileSync(logoPath, "base64");

    // Add Base64 image to userDetail
    userDetail.logo = `data:image/png;base64,${logoBase64}`;


    console.log("Fetching invoices...");

    // Load template
    const filePath = path.join(__dirname, "templates", `${templateName}.html`);
    const source = fs.readFileSync(filePath, "utf-8");

    const template = Handlebars.compile(source);
    const html = template(userDetail);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
    res.send(buffer);

  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).send("Error generating PDF");
  }
};

export default {
  getInvoices,
};
