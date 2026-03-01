import jwt from "jsonwebtoken";

const isLogin = async (req, res, next) => {
    try {

        const token = req.cookies?.user;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided",
                success: false
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized: Invalid token",
                    success: false
                });
            }
            req.user = decoded;

            next();
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server Error while verifying authentication",
            success: false,
            error: error.message
        })
    }

}

export default isLogin