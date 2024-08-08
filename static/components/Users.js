export default{
    template: `
    <div>
        <h1>Users</h1>
        <div v-if="error"> {{ error }}</div>
        <div v-for="(user,index) in allUsers">
            {{user.email}}
            <span class="badge rounded-pill text-bg-success" v-if='user.active' >Active</span>
            <button class="badge rounded-pill text-bg-danger" v-if='!user.active' @click='activate(user.id)'>Inactive</button>
        </div>
    </div>
    `,
    data(){
        return{
            allUsers: [],
            token: localStorage.getItem('auth-token'),
            showInactiveUsers: false,
            error: null,
            
        }
    },
    computed: {
      filteredUsers() {
        if (this.showInactiveUsers) {
          return this.allUsers.filter(user => !user.active);
        } else {
          return this.allUsers;
        }
      }
    },
    methods: {
        async activate(userId){
            const res = await fetch(`/activate/user/${userId}`,{
                headers:{
                    'Authentication-Token': this.token,
                }
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
            }else{}
        },

    }, 
    async mounted(){
        const res = await fetch('/users',{
            headers: {
                "Authentication-Token": this.token,
            }
        })
        const data = await res.json().catch((e)=>{
            this.error = e
        })
        if(res.ok){
            this.allUsers=data
        }else{
            this.error = "Error"
        }
    },

}