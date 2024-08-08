export default {
    template: `<div>
        <div v-if='error'>{{error}}</div>
        
        <div v-if='updation' class="alert alert-success" role="alert">
        <i class="bi bi-info-circle"></i> {{updation}} 
        <span v-if='times>1'>{{times}} times.</span>
        </div>

        <input type="text" placeholder="Id" v-model=book.id disabled readonly/>
        <input type="text" placeholder="Title" v-model=book.title />
        <input type="text" placeholder="Author" v-model=book.author />
        <input type="text" placeholder="Section" v-model=book.section />
        <button class='btn btn-primary' @click="edit_book(book.id)">Edit</button>
    </div>`,

    data(){
        return {
            book:{
                id:null,
                title:null,
                author:null,
                section:null,
            },
            error:null,
            token: localStorage.getItem('auth-token'),
            updation:null,
            times:0,
        }
    },
    created() {
        this.book.id = this.$route.query.id;
      },
    methods: {
        async edit_book(id){
            try{
                const res = await fetch(`/api/editBook/${id}`,{
                    method: "POST",
                    headers:{
                        "Authentication-Token":this.token,
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify(this.book)
                })
                const data = await res.json()
                if(res.ok){
                    this.updation = "Book Edited Successfully"
                    this.times += 1
                    this.renderData()                   
                }else{
                    console.error(`Error: ${res.status} - ${JSON.stringify(data)}`);
                }
            }catch(error){
                console.error(error);
            }
        },
        async renderData(){
            const id = this.book.id
            const res = await fetch(`/api/editBook/${id}`,{
                headers:{
                    'Authentication-Token': this.token
                }
            })
            const book = await res.json().catch((e)=>{this.error = e})
            
            if (res.ok){
                this.book.title = book.title
                this.book.author = book.author
                this.book.section = book.section
    
            }else{ this.error = "res not ok" }

        }
    },
    async mounted(){
        this.renderData()
    },
}