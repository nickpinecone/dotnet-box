"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
function validateForm(req, res, next) {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        throw new Error("provided form data is incorrect");
    }
    next();
}
exports.default = { validateForm };
//# sourceMappingURL=validate.middleware.js.map