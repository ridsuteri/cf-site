const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const passport = require('./config/passport');
const Post = require('./models/Post');

const app = express();
const port = 8000;


app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
        // res.redirect('/')
    }
}
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


// for google auth 
app.get('/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
    }),
    function (req, res) {
        // console.log(req.user);
        res.redirect('/home')

    }
);

// normal routing 
app.get('/', (req, res) => {
    res.render('login')
})

app.get('/home', isLoggedIn, (req, res) => {
    Post.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render('home', { posts: result, user: req.user });
        }
    })
})

app.get('/add', isLoggedIn, (req, res) => {
    res.render('create-post', { user: req.user })
});

app.post('/addStories', isLoggedIn, (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        author: req.user.email
    })

    newPost.save((err) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/home');
        }
    })
});


app.get('/delete/:id', isLoggedIn, (req, res) => {
    const id = req.params.id;
    console.log(id);

    Post.findByIdAndDelete(id, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/home');
        }
    })
})

app.get('/posts/:id', (req, res) => {
    const id = req.params.id;
    Post.findById(id, (err, result) => {
        if (err) {
            res.send(err);
        }
        else {
            res.render('post', { post: result, user: req.user });
        }
    })
})

app.get('/update/:id', isLoggedIn, (req, res) => {
    const id = req.params.id;
    Post.findById(id, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.render('edit-post', { post: result, user: req.user });
        }
    })
})


app.post('/updateStory/:id', isLoggedIn, (req, res) => {
    const id = req.params.id;
    const updatedPost = {
        title: req.body.title,
        description: req.body.description
    }

    Post.findByIdAndUpdate(id, updatedPost, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/home');
        }
    })
})

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})