import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import bcrypt from 'bcryptjs';
import passport from "passport";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        }, async (email: string, password: string, done) => {
            try {
                const isUserExist = await User.findOne({ email })
                if (!isUserExist) {
                    return done(null, false, { message: "Email does not exist!!" })
                }
                const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider === "Google")
                if (isGoogleAuthenticated && !isUserExist.password) {
                    return done(null, false, { message: "This email is registered using Google. Please log in with Google instead.Then you can set password" })
                }
                const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)
                if (!isPasswordMatched) {
                    return done(null, false, { message: "Password Incorrect!!" })
                }
                return done(null, isUserExist)
            } catch (error) {
                done(error)
            }
        })
)

passport.use(
    new GoogleStrategy({
        clientID: envVars.google_Client_Id,
        clientSecret: envVars.google_Client_Secret,
        callbackURL: envVars.google_Callback_Url,
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const email = profile.emails?.[0].value
            if (!email) {
                return done(null, false, { message: "Not found email!" })
            }
            let user = await User.findOne({ email })
            if (!user) {
                user = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    isVerified: true,
                    auths: [
                        {
                            provider: "Google",
                            providerId: profile?.id
                        }
                    ]
                })
            }
            return done(null, user)
        }
        catch (error) {
            console.log("GoogleStrategy Error", error)
            return done(error)
        }
    })
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
    // Save only the user ID in the session
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id); // Find user from DB
        done(null, user); // Attach user to req.user
    } catch (err) {
        done(err);
    }
});