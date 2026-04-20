const express = require('express');
const multer = require('multer');
const { sendCandidateEmail, sendPartnerEmail } = require('../services/emailService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

const router = express.Router();

const candidateUpload = upload.single('resume');
const partnerUpload = upload.single('document');

router.post('/submit-candidate', candidateUpload, async (req, res) => {
  const { name, email, phone, career_field, career_goals } = req.body;
  const file = req.file;

  if (!name || !email || !career_field || !career_goals || !file) {
    return res.status(400).send('Missing required candidate fields or resume upload.');
  }

  try {
    await sendCandidateEmail({ name, email, phone, career_field, career_goals, file });
    return res.json({ success: true });
  } catch (error) {
    console.error('Candidate email error:', error);
    const message = process.env.NODE_ENV === 'production'
      ? 'Failed to send candidate submission email.'
      : `Failed to send candidate submission email: ${error.message}`;
    return res.status(500).send(message);
  }
});

router.post('/submit-partner', partnerUpload, async (req, res) => {
  const { name, company, email, partner_type, needs } = req.body;
  const file = req.file;

  if (!name || !company || !email || !partner_type || !needs) {
    return res.status(400).send('Missing required partner fields.');
  }

  try {
    await sendPartnerEmail({ name, company, email, partner_type, needs, file });
    return res.json({ success: true });
  } catch (error) {
    console.error('Partner email error:', error);
    const message = process.env.NODE_ENV === 'production'
      ? 'Failed to send partner submission email.'
      : `Failed to send partner submission email: ${error.message}`;
    return res.status(500).send(message);
  }
});

module.exports = router;
