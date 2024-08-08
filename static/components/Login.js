export default{
    template: `
    <div class="d-flex justify-content-center">
    <div class="mb-3 p-5 m-5 bg-light">
    <h3>Login</h3>
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
        <router-link class="btn btn-primary m-2" to="/signup">Sign Up</router-link>
        <button class="btn btn-primary m-2" @click='login'>Login</button>
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
        async login(){
            const res = await fetch("/user-login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(this.cred),
            })
            const data = await res.json()
            if(res.ok){
                
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('role', data.role)
                localStorage.setItem('email', data.email)
                this.$router.push({ path: '/'})
            } else{this.error = data.message}
        },
    },
}