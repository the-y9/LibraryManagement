import Home from "./components/Home.js"
import Login from "./components/Login.js"
import Users from "./components/Users.js"
import AddBook from "./components/AddBook.js"
import Books from "./components/Books.js"
import Issues from "./components/Issues.js"
import EditBook from "./components/EditBook.js"
import SignUp from "./components/signup.js"

const routes = [    
    {path:'/',component: Home, name: 'Home'},
    {path:'/login', component: Login, name: 'Login'},
    {path:'/users', component: Users, name: 'Users'},
    {path:'/add-book', component: AddBook, name: 'AddBook'},
    {path:'/books', component: Books, name: 'Books'},
    {path:'/issues', component: Issues, name: 'Issues'},
    {path:'/edit-book', component: EditBook, name: 'EditBook'},
    {path:'/signup', component: SignUp, name: 'SignUp'},
]



export default new VueRouter({
    routes,
})
