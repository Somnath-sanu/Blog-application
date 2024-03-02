import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  // console.log(token);
  if (!token) {
    return res.status(403).json({ msg: "User is Unauthorised" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ msg: "User is Unauthorised" });
      }

      req.userId = user.userId;
      req.isAdmin = user.isAdmin;
      next();
    });

    // console.log(decoded)
    //console.log(user) //! same output
    //!{ userId: '65d377708fd1464faad1cf03', iat: 1708611611 }
    // req.userId = decoded.userId;
    // next();
  } catch (error) {
    return res.status(403).json({ msg: "Error at verifying token" });
  }
};

//! used cookie-parser to get token from cookie
