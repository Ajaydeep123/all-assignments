const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "mysecretkey";

const generateJwt = (user) =>{
  const payload = {username:user.username};
  return jwt.sign(payload,secretKey,
  {
    expiresIn:'1h',
  })
};

const authenticateJwt = (req,res,next)=>{
  const token =
    req.cookies.token ||
    req.body.token ||
    req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(403).send('token is missing');
  }

  jwt.verify(token,secretKey,(err,user)=>{
    if(err){
      return res.sendStatus(403);
    }
    req.user=user;
    next();
  })
}


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    const token = generateJwt(admin);
    res.json({ message: 'Admin created successfully', token });
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);

  if (admin) {
    const token = generateJwt(admin);
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
});

app.post('/admin/courses',authenticateJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id= uuidv4();
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id });
});


app.put('/admin/courses/:courseId',authenticateJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((c)=>{
    return c.id== courseId;
  })
    if(course){
    Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses',authenticateJwt, (req, res) => {
  // logic to get all courses
    res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user'
    const user = {
    username : req.body.username,
    password : req.body.username,
    purchasedCourses: []
  }
    const userAlreadyExists = USERS.find((usr)=>{
    return usr.username === user.username;
   });

  if (userAlreadyExists) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    USERS.push(user);
    const token = generateJwt(user);
    res.json({ message: 'User created successfully', token });  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = generateJwt(user);
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
});

app.get('/users/courses',authenticateJwt, (req, res) => {
  // logic to list all courses
    res.json({ courses: COURSES });
});

app.post('/users/courses/:courseId',authenticateJwt, (req, res) => {
  // logic to purchase a course
  const cId = parseInt(req.params.courseId)
  const courseToBuy = COURSES.find((course)=>{
    return course.id == cId && course.published
  });
  if(courseToBuy){
    req.user.purchasedCourses.push(courseToBuy);
    res.json({ message: 'Course purchased successfully' });
  } else{
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses',authenticateJwt, (req, res) => {
  // logic to view purchased courses
  const purchasedCourseIds = req.user.purchasedCourses;
  const purchasedCourses = COURSES.filter(course => purchasedCourseIds.includes(course.id));  
  res.json({ purchasedCourses });
});
// app.get('/users/purchasedCourses', authenticateJwt, (req, res) => {
//   const purchasedCourses = req.user.purchasedCourses;
//   if (purchasedCourses && purchasedCourses.length > 0) {
//     res.json({ purchasedCourses });
//   } else {
//     res.status(404).json({ message: 'No courses purchased' });
//   }
// });

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
