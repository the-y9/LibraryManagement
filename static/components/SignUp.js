export default{
    template: `
    <div class="d-flex justify-content-center">
    <div class="mb-3 p-5 m-5 bg-light">
    <h3>Sign Up</h3>
        <form>
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="email" autocomplete="email"
                placeholder="name@example.com"
                v-model="cred.email">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" autocomplete="current-password"
                v-model="cred.password"><br>
        </form>
        <div class="alert alert-danger" role="alert" v-if='error'>
            <i class="bi bi-info-circle"></i>
            <span class="form-text text-danger">
              {{error}}
            </span>
        </div>
        <button class="btn btn-primary m-2" @click='signup'>Sign Up</button>
        <router-link class="btn btn-primary m-2" to="/login">Login</router-link>
    </div>
    </div>
    `,
    data(){
        return {
            cred:{
                email:null,
                password: null,
            },
            error: null,
        }
    },
    methods:{
        async signup(){
            try{
                    const res = await fetch("/user-signup", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify(this.cred),
                })
                const data = await res.json()
                if(res.ok){
                    
                    console.log(data)
                } else{this.error = data.message}
            }catch(error){ this.error = error }
        },
    },
}