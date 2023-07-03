const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
console.log(COURSES)

const adminAuth = (req,res,next) =>{
   const {username, password} = req.headers;
   const admin = ADMINS.find((adm)=>{
    return adm.username === username && adm.password === password;
   })
   if(admin){
    next();
   }else{
    res.status(403).json({message: `Admin Authentication Failed`});
   }
};

const userAuth = (req,res, next) =>{
   const {username, password} = req.headers;
   const user = USERS.find((usr)=>{
    return usr.username === username && usr.password === password;
   })
   if(user){
    req.user = user;
    next();
   }else{
    res.status(403).json({message: `User Authentication Failed`});
   }
};


// Admin routes
app.post('/admin/signup', (req, res) => {
  //logic to sign up admin
  const admin = req.body;
  const adminAlreadyExist = ADMINS.find((adm)=>{
    return adm.username === admin.username;
   });
  if (adminAlreadyExist) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    res.json({ message: 'Admin created successfully' });
  }
});

app.post('/admin/login', adminAuth, (req, res) => {
  // logic to log in admin
  res.json({ message: 'Logged in successfully' });
});

app.post('/admin/courses',adminAuth, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = uuidv4();
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', adminAuth, (req, res) => {
  // logic to edit a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find((c)=>{
    return c.id === courseId;
  })
  if(course){
    Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses',adminAuth, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});



// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
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
    res.json({ message: 'User created successfully' });
  }
});

app.post('/users/login',userAuth, (req, res) => {
  // logic to log in user
  res.json({ message: 'Logged in successfully' });
});

app.get('/users/courses',userAuth, (req, res) => {
  // logic to list all courses
  const filteredCourses = COURSES.filter((course)=>{
    return course.published;
  })
   res.json({ courses: filteredCourses }); 
});

app.post('/users/courses/:courseId',userAuth, (req, res) => {
  // logic to purchase a course
  const cId = Number(req.params.courseId)
  const courseToBuy = COURSES.find((course)=>{
    return course.id === cId && course.published
  });
  if(courseToBuy){
    req.user.purchasedCourses.push(courseToBuy);
    res.json({ message: 'Course purchased successfully' });
  } else{
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses',userAuth, (req, res) => {
  // logic to view purchased courses
  const purchasedCourseIds = req.user.purchasedCourses;
  const purchasedCourses = COURSES.filter(course => purchasedCourseIds.includes(course.id));  
  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
