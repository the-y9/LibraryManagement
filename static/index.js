import router from "./router.js"
import Navbar from "./components/Navbar.js"

router.beforeEach((to,from,next) => {
    if ((to.name !== 'Login' && to.name!== 'SignUp') && !localStorage.getItem('auth-token') ? true :false) next({ name: 'Login'})
    else next()
})


new Vue({
    el:"#app",
    template:`<div>
        <Navbar :key='navr'/>
    <router-view class="m-3" /></div>`,
    router,
    components:{
        Navbar,
    },
    data:{
        navr:0,
    },
    watch:{
        $route(){
            this.navr = this.navr +1
        }
    },
})
