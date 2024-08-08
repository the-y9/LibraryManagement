export default{
    template: `
    <div>
        <h1>Books</h1>
        <div v-if="error"> {{ error }}</div>
        <div class = 'row'>
        <div class='col-2'></div>
        <div  class='col-6'>
        <div>
        <form>
            <input class="form-control" type="search" v-model="searchQuery" placeholder="Search" title="Search">
        </form><br>
        </div>
            <table id='table' class='table table-hover text-center'>
                <thead><tr><th>Id<th>Title<th>Author<th>Section<th>Action</th></tr></thead>
        <tbody><tr v-for="(book,index) in filteredBooks">
            <td>{{book.id}}<td>{{book.title}}<td>{{book.author}}<td>{{book.section}}
            <td v-if="role=='user'">
            <button class="btn btn-primary m-2" @click="() => request(book.id)">Request</button>
            </td>
            <td v-if="role=='admin'">
            <router-link class="btn btn-primary m-2" :to="{ path: '/edit-book', query: { id: book.id }}">Edit Book</router-link>
            <button class='btn btn-danger m-2' @click="() => del(book.id)">Delete</button>
            </td>
        </tr></tbody>
            </table>           
        </div>
        </div>

        <!--
        <h2>Authors</h2>
        <div id='card' class='card-group'>
            <div class="card text-center mr-3" style="width: 18rem;" v-for="(a,index) in allAuthors">
            <div class="card-body">
                <h5 class="card-title">{{a.author}}</h5>
                <p class="card-text">{{a.author}}</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
            </div>
        </div>
        <h2>Sections</h2>
        <div id='cardCarousel'>
            <li v-for="(a,index) in allSections">{{index}}-{{a.section}}
            <hr v-if="(index + 1) % 3 === 0 && index !== allSections.length - 1">
            </li>
            
                <div id="carouselExampleIndicators" class="carousel slide">
                <div class="carousel-inner">
                <div class="carousel-item active">
                    <div class="card" >
                    <div class="card-body">
                    <h5 class="card-title text-center">Active</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" class="card-link">Card link</a>
                    </div>
                    </div>                    
                </div>
                <div v-for="(a,index) in allSections">
                <div v-if="index%3==0" class="carousel-item ">
                    <div class="card " style="width: 18rem;">
                    <div class="card-body">
                    <h5 class="card-title">Card {{index+1}}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">{{a.section}}</h6>
                    <p class="card-text">{{a.section}}</p>
                    <a href="#" class="card-link">Card link</a>
                    </div>
                    </div>
                </div>
                </div>
                <div class="carousel-item">
                    <div class="card" >
                    <div class="card-body">
                    <h5 class="card-title">Last</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" class="card-link">Card link</a>
                    </div>
                    </div> 
                </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
                </button>
            </div>

        </div>
        
        <style>
        @media screen and (min-width:576px) {
            .carousel-inner{
                display: flex;
            }
            .carousel-item{
                display: block;
                margin-right: 0;
                flex: 0 0 calc(100%/3);
            }
        }
        .carousel-inner{
            padding: 1em;
        }
        .card{
            margin: 0;
        }
        </style>
                -->
    </div>
    `,
    data(){
        return{
            allBooks: [],
            allSections: [],
            allAuthors: [],
            searchQuery:'',
            role: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            issue:{
                user_id:localStorage.getItem('email'),
                book_id:null,
                action: null,
            },
            error: null,
        }
    },
    computed: {
        filteredBooks() {
            return this.allBooks.filter(book => {
                const id = book.id.toString();
                const titl = book.title.toUpperCase();
                const author = book.author.toUpperCase();
                const section = book.section.toUpperCase();
                const query = this.searchQuery.toUpperCase();
                return id.includes(query) || titl.includes(query) || author.includes(query) || section.includes(query);
            });
        }
    },
    methods : {
        async rendering(){
            const resb = await fetch('/api/book',{
                headers: { "Authentication-Token": this.token, }
            })
            const bdata = await resb.json().catch((e)=>{ this.error = e })
            if(resb.ok){
                this.allBooks=bdata[0]
                this.allSections=bdata[1]
                this.allAuthors=bdata[2]
            }
            else{ this.error = "Error" }
        },
        async del(bookid){
            try{
                const res = await fetch(`/api/delBook/${bookid}`,{
                    method: "POST",
                    headers:{
                        'Authentication-token': this.token
                    }
                })
                const data = await res.json()
                if (res.ok){
                    console.log(data)
                    alert(data.message)
                    this.rendering()
                }
            }catch(error){
                alert(error);
            }
        },
        async request(bookid){
            try{
                this.issue.book_id = bookid
                this.issue.action = this.role === 'user' ? 'Requested' : null;
                const res = await fetch('/api/issue',{
                    method: "POST",
                    headers:{
                        "Authentication-Token":this.token,
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify(this.issue)
                })
                const data = await res.json()
                if(res.ok){
                    alert(data.message)                    
                }else{
                    alert(`Error: ${res.status} - ${JSON.stringify(data)}`);
                }                
            }catch(error){
                alert(error);
            }
        },
    },
    async mounted(){
        this.rendering()
    },
}