import AdminHome from "./AdminHome.js"
import UserHome from "./UserHome.js"
import Sections from "./Sections.js"

export default {
    template: `<div>
    <AdminHome v-if="userRole=='admin'" />
    <UserHome v-if="userRole=='user'" />
    <!-- <Sections v-for="resource in resources" :resource = "resource"/> -->
    </div>
    `,

    data(){
        return{
            userRole: localStorage.getItem('role'),
            resources: [],            
            token: localStorage.getItem('auth-token'),
        }
    },
    components: {
        AdminHome,
        UserHome,
        Sections,
    },
    async mounted(){
        const res = await fetch('/api/book',{
            headers: {
                "Authentication-Token": this.token,
            }
        })
        const data = await res.json().catch((e)=>{
            this.error = e
        })
        if(res.ok){
            this.resources=data[0]            
        }else{
            this.error = "Error"
        }
    },
}
