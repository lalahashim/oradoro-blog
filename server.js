import express from "express";
import bodyParser from "body-parser";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const POSTS_FILE = path.join(__dirname, 'allposts.json');

let posts = [];
if (fs.existsSync(POSTS_FILE)) {
    posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
}

app.set('view engine', 'ejs');

app.use(express.static('files'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get('/create', (req, res) => {
    res.render('create.ejs');
});

app.get('/posts', (req, res) => {
    res.render('posts.ejs', { posts });
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/about.html');
});

app.post('/add-post', (req, res) => {
    const { name, title, description, content } = req.body;
    const date = new Date();
    const day = date.getDate(); // день
    const month = date.getMonth(); // месяц
    const year = date.getFullYear(); // год

    let currentDate = `${day}-${month}-${year}`;

    const newPost = { 
        id: Date.now(),
        dateCreated: currentDate,
        name: name, 
        title: title, 
        description: description, 
        content: content,
    };

    posts.push(newPost);
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    res.redirect('/posts');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});