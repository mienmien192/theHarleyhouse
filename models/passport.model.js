const localStrategy = require('passport-local').Strategy
const userModel = require('./user.model')
const googleStrategy = require('passport-google-oauth20').Strategy
const githubStrategy = require('passport-github').Strategy
const facebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcrypt')
module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        try {
            const user = await userModel.findById(id) //truy van ngc lai va tim dung id cua no.
            return done(null, user)
        } catch (e) {
            return done(e)
        }
    })
    passport.use(new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async function(email, password, done) {
            const user = await userModel.findOne({ 'email': email }) //findone: moi email chi duoc dang ky 1 lan
            console.log(user)
            if (!user) {

                return done(null, false, { message: "No user with that mail" })
            }
            try {
                if (await bcrypt.compare(password, user.password)) { //tham so thu nhat la chuoi chua dc ma hoa, tham so thu 2 dai hon
                    return done(null, user) //user la du lieu thong bao da dang nhap (user luu tru du lieu)
                }
                return done(null, false, { message: 'password incorrect' })
            } catch (e) {
                return done(e)
            }
        }
    ))

    passport.use(new githubStrategy({
            clientID: "5e23fb50d9a03d3f938d",
            clientSecret: "69391c92d4c8a7d54c3f4451cb8dfb9fe18ff961",
            callbackURL: "http://theharleyhouse.herokuapp.com/user/github/callback"
        },
        async function(accessToken, refreshToken, profile, done) {
            console.log(profile) //trong profile kbg có email
            try {
                const user = await userModel.findOne({ email: profile._json.email })
                if (user) return done(null, user)
                const newUser = new userModel({
                    name: profile._json.login,
                    email: profile._json.url,
                    password: ""
                })
                await newUser.save()
                return done(null, newUser)
            } catch (e) {
                console.log(e)
                return done(e)
            }
        }
    ))
    passport.use(new googleStrategy({
                clientID: "328172550981-me71cl6324vi10ce4p866jlkd1521ag9.apps.googleusercontent.com",
                clientSecret: "W5Fxq5Zj16MUlgF_lWSI-fkM",
                callbackURL: "http://theharleyhouse.herokuapp.com/user/google/callback"
            },
            async function(accessToken, refreshToken, profile, done) {
                console.log(profile)
                try {
                    const user = await userModel.findOne({ email: profile._json.email })
                    if (user) return done(null, user)
                    const newUser = new userModel({

                        name: profile._json.name,
                        email: profile._json.email,
                        password: ""
                    })
                    await newUser.save()
                    return done(null, newUser)
                } catch (e) {
                    console.log(e)
                    return done(e)
                }
            }
        ))
        //login facebook
    passport.use(new facebookStrategy({
            clientID: "529246084960554",
            clientSecret: "05583470c3137b3874987202acb755cf",
            callbackURL: "http://theharleyhouse.herokuapp.com/user/facebook/callback"
        },
        async function(accessToken, refreshToken, profile, done) {
            console.log(profile)
            try {
                const user = await userModel.findOne({ email: profile._json.email })
                if (user) return done(null, user)
                const newUser = new userModel({

                    name: profile._json.name,
                    email: profile._json.email,
                    password: ""
                })
                await newUser.save()
                return done(null, newUser)
            } catch (e) {
                console.log(e)
                return done(e)
            }
        }
    ))

}




// cách dùng bất đồng bộ trong nodejs