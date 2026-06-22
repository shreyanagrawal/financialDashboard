const refreshCookieConfig = {
    httpOnly:true,
    secure:true,
    sameSite:"none",
    maxAge: 30 * 24 * 60 * 60 * 1000
}

const plaidCookieConfig = {
    httpOnly:true,
    secure:true,
    sameSite:"none",
    maxAge: 30 * 60 * 1000
}

module.exports = {refreshCookieConfig,plaidCookieConfig};