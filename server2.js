import express from "express";
import cors from "cors";
import multer from "multer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
console.log("Loaded ENV:", process.env.EMAIL_USER, process.env.EMAIL_PASS ? "✅ pass loaded" : "❌ pass missing");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.send("✅ Server is running fine!");
});

// ======================= JOIN PAGE =======================
app.post("/api/join", upload.single("resume"), async (req, res) => {
  try {
    const {
      firstName = "N/A",
      lastName = "N/A",
      occupation = "N/A",
      gender = "N/A",
      contact = "N/A",
      email = "N/A",
      age = "N/A",
      experience = "N/A",
      address = "N/A",
      organization = "N/A",
      description = "N/A",
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "Missing required fields (firstName, lastName, or email).",
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `🟢 New Join Request from ${firstName} ${lastName}`,
      html: `
        <h2>New Join Submission</h2>
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Occupation:</b> ${occupation}</p>
        <p><b>Gender:</b> ${gender}</p>
        <p><b>Contact:</b> ${contact}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Age:</b> ${age}</p>
        <p><b>Experience:</b> ${experience} years</p>
        <p><b>Address:</b> ${address}</p>
        <p><b>Organisation:</b> ${organization}</p>
        <p><b>Description:</b> ${description}</p>
      `,
      attachments: req.file
        ? [{ filename: req.file.originalname, content: req.file.buffer }]
        : [],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      message: "❌ Error sending email",
      error: error.message || error,
    });
  }
});

// ======================= PARTNER PAGE (matches frontend) =======================
app.post("/api/partner", async (req, res) => {
  try {
    const { firstName, lastName, phone, email, organization } = req.body;

    // ✅ Validation
    if (!firstName || !lastName || !email || !organization || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `🤝 New Partner Request from ${firstName} ${lastName}`,
      html: `
        <h2>🤝 New Partner Registration</h2>
        <p><b>First Name:</b> ${firstName}</p>
        <p><b>Last Name:</b> ${lastName}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Organization:</b> ${organization}</p>
        <hr/>
        <p style="color:gray;">Submitted via HopeWeavers Partner Form</p>
      `,
    };

    
    // ✅ Send email
    await transporter.sendMail(mailOptions);

    console.log(`📩 Partner email sent from ${firstName} ${lastName}`);

    res.status(200).json({ message: "✅ Partner email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending partner email:", error);
    res.status(500).json({ message: "❌ Failed to send partner email", error: error.message });
  }
});

// ======================= VOLUNTEER FORM =======================
app.post("/api/volunteer", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      city,
      country,
      contact,
      email,
      occupation,
      age,
      description,
    } = req.body;

    // ✅ Validation
    if (!firstName || !lastName || !city || !country || !contact || !email || !occupation || !age || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `👐 New Volunteer Signup: ${firstName} ${lastName}`,
      html: `
        <h2>👐 New Volunteer Registration</h2>
        <p><b>First Name:</b> ${firstName}</p>
        <p><b>Last Name:</b> ${lastName}</p>
        <p><b>City:</b> ${city}</p>
        <p><b>Country:</b> ${country}</p>
        <p><b>Contact:</b> ${contact}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Occupation:</b> ${occupation}</p>
        <p><b>Age:</b> ${age}</p>
        <p><b>Description:</b> ${description}</p>
        <hr/>
        <p style="color:gray;">Submitted via Hopeweavers Volunteer Form</p>
      `,
    };

    // ✅ Send email
    await transporter.sendMail(mailOptions);

    console.log(`📩 Volunteer email sent from ${firstName} ${lastName}`);

    res.status(200).json({ message: "✅ Volunteer email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending volunteer email:", error);
    res.status(500).json({ message: "❌ Failed to send volunteer email", error: error.message });
  }
});

// ======================= CONTACT PAGE =======================
// 📩 Contact Form API
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `📬 New Contact Query: ${subject || "No subject"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ Contact email sent successfully!" });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({ message: "❌ Error sending contact email", error: error.message });
  }
});

// ======================= START SERVER =======================
app.listen(5000, () => console.log("🚀 Server running on port 5000"));