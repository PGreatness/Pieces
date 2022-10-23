const config = require("config");

const generatePasswordResetEmailHTML = (email, id, token) => {
    const htmlTemplate = `
        <h1>Hello There!</h1>
        <p>We recieved a request to reset the password for the Pieces account associated with ${email}.</p>
        <p>You can reset your password by clicking on the link below:</p>
        <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td>
                <table cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="border-radius: 2px;" bgcolor="blue">
                            <a href="${config.get(
                                "client_origin"
                            )}/reset-password/${id}/${token}" target="_blank" 
                                style="
                                    padding: 8px 12px; 
                                    border: 1px solid black;
                                    border-radius: 2px;
                                    color: white;
                                    text-decoration: none;
                                    font-weight:bold;
                                    display: inline-block;
                            ">
                                Reset Your Password            
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        </table>
        <p>Sincerely, <br>The Pieces Team</p>
    `;
    return htmlTemplate;
};

const generatePasswordResetEmailText = (email, id, token) => {
    const textTemplate = `
        Hello There!\n\n
        We recieved a request to reset the password for the Pieces account associated with ${email}.\n
        You can reset your password by clicking on the following link:\n\n
        ${config.get("client_origin")}/reset-password/${id}/${token}\n\n
        Sincerely,\n
        The Pieces Team
    `;
    return textTemplate;
};

module.exports = { generatePasswordResetEmailHTML, generatePasswordResetEmailText };