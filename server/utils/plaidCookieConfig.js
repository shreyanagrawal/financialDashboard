const plaidCookieConfig = {
    httpOnly:true,
    secure:false,
    sameSite:"Lax",
    maxAge: 30 * 60 * 1000
}

module.exports = plaidCookieConfig;