// Seting up the libraries:
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const session= require('express-session');
const bcrypt= require('bcrypt-nodejs');

//Name of the database in postgressql, process.env.POSTGRES_DB did not get recognized
const databaseName = 'quba_app'

// Setting up the link to the database.
const sequelize = new Sequelize(databaseName, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres',
	define: {
		timestamps: true
	}
})

// const sequelize = new Sequelize('postgres://YoussefOuirini:18061992@localhost/quba_app');

app.use('/', bodyParser());

app.set('views', './');
app.set('view engine', 'pug');
app.use(express.static("public"));

// Setting up the tables
var Student = sequelize.define('student', {
	firstname: Sequelize.STRING,
	lastname: Sequelize.STRING,
	birthdate: Sequelize.STRING,
	gender: Sequelize.STRING,
	parentEmail: Sequelize.STRING
});

var Teacher = sequelize.define('teacher', {
	firstname: Sequelize.STRING,
	lastname: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING
});

var Group = sequelize.define('group', {
	groupName: Sequelize.STRING
})

var Lesson = sequelize.define('lesson', {
	homework: Sequelize.STRING,
	attendance: Sequelize.STRING,
	date: Sequelize.DATEONLY,
	behaviour: Sequelize.STRING,
	nextHomework: Sequelize.STRING
})

// Setting up the model by linking the tables to each other
Student.belongsTo(Group);
Student.hasMany(Lesson);
Student.belongsTo(Teacher);
Group.hasMany(Student);
Group.hasMany(Lesson);
Group.hasOne(Teacher);
Teacher.belongsTo(Group);
Teacher.hasMany(Lesson);
Teacher.hasMany(Student);
Lesson.belongsTo(Group);
Lesson.belongsTo(Teacher);
Lesson.belongsTo(Student)

//Initiliaze sequelize database
sequelize.sync({force:false})
	.then(()=>{
		Teacher.findOne({
			where: {
				email: "youssef@ouirini.com"
			}
		}).then((teacher)=>{
			if (teacher === null) {
				bcrypt.hash("pizza", null, null, (err,hash)=>{
					if (err) {
						throw err
					}
					return Teacher.create({
						firstname: "Youssef",
						lastname: "Ouirini",
						email: "youssef@ouirini.com",
						password: hash
					})
				});
			}
			return
		}).then().catch(error=>{console.log(error)})
	})

// Creates session when user logs in
app.use(session({
	secret: `${process.env.SECRET_SESSION}`,
	resave: true,
	saveUninitialized: false
}));

// Goes to the index page, which is the homepage
app.get('/',  (req,res)=>{
	res.render('public/views/index', {
		// You can also use req.session.message so message won't show in the browser
		messsage: req.session.message,
		// message: req.query.message,
		user: req.session.user
	});
});

app.post('/', (req,res)=>{
	Teacher.findOne({
		where: {
			email: req.body.email
		}
	}).then((teacher)=>{
		if ((teacher!==null)) {
			bcrypt.compare(req.body.password, teacher.password, (err, data)=>{
				if (err) {
					throw err;
				} else {
					if(teacher !== null && data== true) {
						req.session.teacher = teacher;
						res.redirect('/teacher');
					} else {
						res.render("public/views/index", {message: "Verkeerde email of wachtwoord!"});
					}
				}
			})
		} else {
				res.render("public/views/index", {message: "Verkeerde email of wachtwoord!"});
				return;
			}
	})
})

var server = app.listen(3000, function() {
  console.log('The server is running at http//:localhost:' + server.address().port)
});
