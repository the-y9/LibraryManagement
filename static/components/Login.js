export default{
    template: `
    <div class="container">
        <div class="row justify-content-center">

            <div class="col-sm-12 col-md-6 bg-light p-4 m-3 rounded shadow">
                <h3>Login</h3>
                <form @submit.prevent="login">
                    <label for="email" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="email" autocomplete="email"
                        placeholder="name@example.com" v-model="cred.email" />

                    <label for="password" class="form-label mt-3">Password</label>
                    <input type="password" class="form-control" id="password" autocomplete="current-password"
                        v-model="cred.password" />

                    <div class="alert alert-danger mt-3" role="alert" v-if="error">
                    <i class="bi bi-info-circle"></i>
                    <span class="form-text text-danger">{{ error }}</span>
                    </div>

                    <div class="d-flex justify-content-between mt-4">
                    <router-link class="btn btn-outline-primary" to="/signup">Sign Up</router-link>
                    <button type="submit" class="btn btn-primary">Login</button>
                    </div>
                </form>
            </div>

            <div class="col-sm-12 col-md-6 p-3 m-3 rounded shadow" id="inform" style="overflow-y: auto; background-color: #f8f9fa;">
                <div v-html="workflow"></div>
            </div>
        </div>
    </div>

    `,
    data(){
        return {
             workflow: '',
            cred:{
                email:null,
                password: null,
            },
            error: null,
        }
    },
  mounted() {
    fetch('static/workflow.md')
      .then(res => res.text())
      .then(text => {
        this.workflow = marked.parse(text);
      });
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