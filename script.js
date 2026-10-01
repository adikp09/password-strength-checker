const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

const lengthCheck = document.getElementById("length");
const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const numberCheck = document.getElementById("number");
const specialCheck = document.getElementById("special");

// Common passwords
const commonPasswords = [
    "password",
    "123456",
    "12345678",
    "123456789",
    "qwerty",
    "qwerty123",
    "admin",
    "welcome",
    "password123",
    "letmein",
    "iloveyou",
    "abc123"
];


// ===============================
// CREATE SECURITY INFORMATION
// ===============================

const securityInfo = document.createElement("div");

securityInfo.style.marginTop = "15px";
securityInfo.style.paddingTop = "12px";
securityInfo.style.borderTop = "1px solid #334155";

securityInfo.innerHTML = `
    <p style="margin: 8px 0; color: #94a3b8;">
        Entropy:
        <span id="entropy" style="color: white; font-weight: bold;">
            0 bits
        </span>
    </p>

    <p style="margin: 8px 0; color: #94a3b8;">
        Estimated Crack Time:
        <span id="crackTime" style="color: white; font-weight: bold;">
            —
        </span>
    </p>
`;

document.querySelector(".strength-section").appendChild(securityInfo);

const entropyText = document.getElementById("entropy");
const crackTimeText = document.getElementById("crackTime");


// ===============================
// SHOW / HIDE PASSWORD
// ===============================

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁️";
    }
});


// ===============================
// PASSWORD CHECKER
// ===============================

passwordInput.addEventListener("input", () => {

    const password = passwordInput.value;
    const lowerPassword = password.toLowerCase();


    // Password requirements

    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);


    // Update requirements

    updateRequirement(
        lengthCheck,
        hasLength,
        "At least 8 characters"
    );

    updateRequirement(
        uppercaseCheck,
        hasUppercase,
        "At least one uppercase letter"
    );

    updateRequirement(
        lowercaseCheck,
        hasLowercase,
        "At least one lowercase letter"
    );

    updateRequirement(
        numberCheck,
        hasNumber,
        "At least one number"
    );

    updateRequirement(
        specialCheck,
        hasSpecial,
        "At least one special character"
    );


    // Empty password

    if (password.length === 0) {

        strengthFill.style.width = "0%";
        strengthText.textContent = "Enter password";

        entropyText.textContent = "0 bits";
        crackTimeText.textContent = "—";

        return;
    }


    // ===============================
    // ENTROPY
    // ===============================

    const entropy = calculateEntropy(password);

    entropyText.textContent =
        entropy.toFixed(1) + " bits";

    crackTimeText.textContent =
        estimateCrackTime(entropy);


    // ===============================
    // COMMON PASSWORD CHECK
    // ===============================

    if (commonPasswords.includes(lowerPassword)) {

        strengthFill.style.width = "15%";
        strengthText.textContent =
            "Very Weak - Common Password";

        return;
    }


    // ===============================
    // STRENGTH SCORE
    // ===============================

    let score = 0;

    if (hasLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;


    // Extra points for long passwords

    if (password.length >= 12) {
        score++;
    }

    if (password.length >= 16) {
        score++;
    }


    // Repeated characters

    const repeatedCharacters =
        /(.)\1{2,}/.test(password);

    if (repeatedCharacters) {
        score--;
    }


    // Simple number sequences

    const simpleSequence =
        /1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321/
        .test(password);

    if (simpleSequence) {
        score--;
    }


    // ===============================
    // FINAL STRENGTH
    // ===============================

    if (score <= 2) {

        strengthFill.style.width = "25%";
        strengthText.textContent = "Weak";

    }

    else if (score === 3) {

        strengthFill.style.width = "50%";
        strengthText.textContent = "Medium";

    }

    else if (score === 4 || score === 5) {

        strengthFill.style.width = "75%";
        strengthText.textContent = "Strong";

    }

    else {

        strengthFill.style.width = "100%";
        strengthText.textContent = "Very Strong";
    }
});


// ===============================
// REQUIREMENT UPDATE
// ===============================

function updateRequirement(element, condition, text) {

    if (condition) {

        element.textContent = "✓ " + text;
        element.classList.add("valid");

    } else {

        element.textContent = "✗ " + text;
        element.classList.remove("valid");
    }
}


// ===============================
// ENTROPY CALCULATION
// ===============================

function calculateEntropy(password) {

    if (password.length === 0) {
        return 0;
    }

    let poolSize = 0;

    if (/[a-z]/.test(password)) {
        poolSize += 26;
    }

    if (/[A-Z]/.test(password)) {
        poolSize += 26;
    }

    if (/[0-9]/.test(password)) {
        poolSize += 10;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        poolSize += 32;
    }

    if (poolSize === 0) {
        return 0;
    }

    return password.length * Math.log2(poolSize);
}


// ===============================
// CRACK TIME ESTIMATION
// ===============================

function estimateCrackTime(entropy) {

    if (entropy <= 0) {
        return "—";
    }

    // Educational estimate only
    const guessesPerSecond = 1e9;

    const possiblePasswords =
        Math.pow(2, entropy);

    const seconds =
        possiblePasswords /
        (2 * guessesPerSecond);

    return formatTime(seconds);
}


// ===============================
// FORMAT TIME
// ===============================

function formatTime(seconds) {

    if (seconds < 1) {
        return "Less than a second";
    }

    if (seconds < 60) {
        return Math.round(seconds) + " seconds";
    }

    if (seconds < 3600) {
        return Math.round(seconds / 60) + " minutes";
    }

    if (seconds < 86400) {
        return Math.round(seconds / 3600) + " hours";
    }

    if (seconds < 31536000) {
        return Math.round(seconds / 86400) + " days";
    }

    if (seconds < 31536000 * 1000) {
        return Math.round(seconds / 31536000) + " years";
    }

    if (seconds < 31536000 * 1000000) {
        return Math.round(seconds / 31536000 / 1000) + " thousand years";
    }

    return Math.round(seconds / 31536000 / 1000000)
        + " million years";
}