export const getOtpHtml = ({ email, otp }) => {
  const appName = process.env.APP_NAME || "Authentication App";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${appName} Verification Code</title>
<style>
  html, body { margin: 0; padding: 0; }
  body {
    background: #eef0f6;
    color: #0f1222;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
      'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol', sans-serif;
  }
  table { border-collapse: collapse; }
  img { border: 0; line-height: 100%; outline: none; text-decoration: none; display: block; max-width: 100%; height: auto; }

  .wrapper { width: 100%; background: #eef0f6; }
  .container {
    width: 600px;
    max-width: 600px;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e6e8f0;
    box-shadow: 0 10px 30px rgba(20, 20, 43, 0.06);
  }
  .p-24 { padding: 24px; }
  .p-32 { padding: 40px 36px; }

  .header {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    padding: 28px 24px;
    text-align: center;
  }
  .brand {
    display: inline-block;
    color: #ffffff;
    font-weight: 700;
    font-size: 17px;
    letter-spacing: 0.4px;
    text-decoration: none;
  }

  .eyebrow {
    margin: 0 0 8px 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #7c3aed;
  }
  .title {
    margin: 0 0 14px 0;
    font-size: 24px;
    line-height: 1.3;
    color: #0f1222;
    font-weight: 700;
  }
  .text {
    margin: 0 0 8px 0;
    font-size: 15px;
    line-height: 1.65;
    color: #4b5065;
  }
  .muted {
    color: #6b7086;
    font-size: 13.5px;
    line-height: 1.6;
    margin: 0 0 12px 0;
  }

  /* OTP badge */
  .otp-wrap { margin: 28px 0 20px 0; width: 100%; }
  .otp {
    display: inline-block;
    background: #f5f4ff;
    border: 1px solid #e0dcff;
    border-radius: 12px;
    padding: 18px 28px;
    font-size: 34px;
    letter-spacing: 12px;
    font-weight: 700;
    color: #4f46e5;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  .expiry-pill {
    display: inline-block;
    background: #fff4e5;
    color: #b45309;
    font-size: 12.5px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 999px;
    margin: 4px 0 20px 0;
  }

  .divider { border-top: 1px solid #eef0f6; margin: 24px 0; }

  .footer {
    text-align: center;
    color: #9aa0b4;
    font-size: 12px;
    line-height: 1.7;
    padding: 20px 24px 28px 24px;
  }
  .footer a { color: #9aa0b4; }

  @media only screen and (max-width: 600px) {
    .container { width: 100% !important; border-radius: 0 !important; }
    .p-32 { padding: 28px 22px !important; }
    .otp { font-size: 26px !important; letter-spacing: 7px !important; padding: 14px 18px !important; }
    .title { font-size: 21px !important; }
  }
</style>
</head>
<body>
<table role="presentation" class="wrapper" width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td align="center" class="p-24">
      <table role="presentation" class="container" width="600" border="0" cellspacing="0" cellpadding="0">
        <!-- Header -->
        <tr>
          <td class="header">
            <span class="brand">${appName}</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td class="p-32">
            <p class="eyebrow">Verification code</p>
            <h1 class="title">Confirm it's you</h1>
            <p class="text">
              Use the code below to verify <strong>${email}</strong> and complete your sign-in to ${appName}.
            </p>

            <table role="presentation" class="otp-wrap" width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center">
                  <div class="otp">${otp}</div>
                </td>
              </tr>
            </table>

            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center">
                  <span class="expiry-pill">⏱ Expires in 5 minutes</span>
                </td>
              </tr>
            </table>

            <div class="divider"></div>

            <p class="muted">
              Didn't request this code? No action is needed — you can safely ignore this email.
              Someone may have typed your email address by mistake.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td class="footer">
            © ${new Date().getFullYear()} ${appName}. All rights reserved.<br />
            This is an automated message, please don't reply directly to this email.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
  return html;
};

export const getVerifyEmailHtml = ({ email, token }) => {
  const appName = process.env.APP_NAME || "Authentication App";
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:6014";
  const verifyUrl = `${baseUrl.replace(/\/+$/, "")}/token/${encodeURIComponent(token)}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${appName} Verify Your Account</title>
<style>
  html, body { margin: 0; padding: 0; }
  body {
    background: #eef0f6;
    color: #0f1222;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
      'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol', sans-serif;
  }
  table { border-collapse: collapse; }
  img { border: 0; line-height: 100%; outline: none; text-decoration: none; display: block; max-width: 100%; height: auto; }

  .wrapper { width: 100%; background: #eef0f6; }
  .container {
    width: 600px;
    max-width: 600px;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e6e8f0;
    box-shadow: 0 10px 30px rgba(20, 20, 43, 0.06);
  }
  .p-24 { padding: 24px; }
  .p-32 { padding: 40px 36px; }

  .header {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    padding: 28px 24px;
    text-align: center;
  }
  .brand {
    display: inline-block;
    color: #ffffff;
    font-weight: 700;
    font-size: 17px;
    letter-spacing: 0.4px;
    text-decoration: none;
  }

  .eyebrow {
    margin: 0 0 8px 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #7c3aed;
  }
  .title {
    margin: 0 0 14px 0;
    font-size: 24px;
    line-height: 1.3;
    color: #0f1222;
    font-weight: 700;
  }
  .text {
    margin: 0 0 24px 0;
    font-size: 15px;
    line-height: 1.65;
    color: #4b5065;
  }
  .muted {
    color: #6b7086;
    font-size: 13.5px;
    line-height: 1.6;
    margin: 0 0 12px 0;
  }

  /* Button */
  .btn-wrap { margin: 4px 0 28px 0; }
  .btn {
    display: inline-block;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: #ffffff !important;
    text-decoration: none;
    padding: 14px 32px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.2px;
  }

  .divider { border-top: 1px solid #eef0f6; margin: 8px 0 20px 0; }

  .link-box {
    background: #f8f9fc;
    border: 1px solid #eef0f6;
    border-radius: 10px;
    padding: 12px 14px;
    margin: 0 0 20px 0;
  }
  .link {
    color: #4f46e5;
    text-decoration: none;
    word-break: break-all;
    font-size: 13px;
  }

  .footer {
    text-align: center;
    color: #9aa0b4;
    font-size: 12px;
    line-height: 1.7;
    padding: 20px 24px 28px 24px;
  }
  .footer a { color: #9aa0b4; }

  @media only screen and (max-width: 600px) {
    .container { width: 100% !important; border-radius: 0 !important; }
    .p-32 { padding: 28px 22px !important; }
    .title { font-size: 21px !important; }
    .btn { display: block !important; text-align: center; }
  }
</style>
</head>
<body>
<table role="presentation" class="wrapper" width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td align="center" class="p-24">
      <table role="presentation" class="container" width="600" border="0" cellspacing="0" cellpadding="0">
        <!-- Header -->
        <tr>
          <td class="header">
            <span class="brand">${appName}</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td class="p-32">
            <p class="eyebrow">Account verification</p>
            <h1 class="title">Welcome to ${appName} 👋</h1>
            <p class="text">
              Thanks for signing up with <strong>${email}</strong>. Click the button below to verify your account and get started.
            </p>

            <table role="presentation" class="btn-wrap" width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center">
                  <a class="btn" href="${verifyUrl}" target="_blank" rel="noopener">Verify my account</a>
                </td>
              </tr>
            </table>

            <div class="divider"></div>

            <p class="muted">If the button doesn't work, copy and paste this link into your browser:</p>
            <div class="link-box">
              <a class="link" href="${verifyUrl}" target="_blank" rel="noopener">${verifyUrl}</a>
            </div>

            <p class="muted">
              Didn't create an account? No action is needed — you can safely ignore this email.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td class="footer">
            © ${new Date().getFullYear()} ${appName}. All rights reserved.<br />
            This is an automated message, please don't reply directly to this email.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
  return html;
};
