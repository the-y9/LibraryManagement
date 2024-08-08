export default {
    template: `<nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Library</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link class="nav-link" v-if='is_login' aria-current="page" to="/">Home</router-link>
          <router-link class="nav-link" v-if='is_login' aria-current="page" to="/books">Books</router-link>
          <router-link class="nav-link" v-if="role=='admin'" to="/users">Users</router-link>
          <router-link class="nav-link" v-if="role=='admin'" to="/issues">Issues</router-link>
          <router-link class="nav-link" v-if="role=='admin'" to="/add-book">Add Books</router-link>

        

          <div class="dropdown" v-if='is_login'>
            <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{role}}
            </a>

            <ul class="dropdown-menu ">
              <li><a class="dropdown-item text-muted" > {{ email }} </a></li>
              <li><button class="dropdown-item bg-danger text-light" @click='logout'> Log Out </button> </li>
            </ul>
          </div>
          <button class="btn btn-outline-danger " v-if='is_login' @click='logout' style="float: right">Log Out</button>
        </div>
      </div>
      
    </div>
  </nav>`,
  data() {
    return{
      role: localStorage.getItem('role'),
      is_login: localStorage.getItem('auth-token'),
      email: localStorage.getItem('email'),

    }
  },
  methods: {
    logout(){
      localStorage.removeItem('auth-token');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      this.$router.push('/login');
    }
  }
}