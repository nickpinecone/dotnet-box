import jwt from "jsonwebtoken";
import express from "express";

function verifyToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers["x-access-token"];

    if (!token) {
        throw new Error("did not recieve access token");
    }

    jwt.verify(
        token as string,
        process.env.LOGIN_SECRET as string,
        (err, decoded) => {
            if (err) {
                throw new Error("can not access with token: " + token);
            }
            // req.locals.userId = (decoded as jwt.JwtPayload).id;
            res.locals.userId = (decoded as jwt.JwtPayload).id;
            next();
        }
    );
}

export default { verifyToken };