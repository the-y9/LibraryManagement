export default {
    template: `<div>
        <input type="text" placeholder="Title" v-model=book.title />
        <input type="text" placeholder="Author" v-model=book.author />
        <input type="text" placeholder="Section" v-model=book.section />
        <button class='btn btn-primary' @click="createbook">ADD</button>
    </div>`,

    data(){
        return {
            book:{
                title:null,
                author:null,
                section:null,
            },
            token: localStorage.getItem('auth-token')
        }
    },

    methods: {
        async createbook(){
            try{
                const res = await fetch('/api/book',{
                    method: "POST",
                    headers:{
                        "Authentication-Token":this.token,
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify(this.book)
                })
                const data = await res.json()
                console.log(data)
                if(res.ok){
                    alert(data.message)
                    this.book.title = null;
                    this.book.author = null;
                    this.book.section = null;                    
                }else{
                    console.error(`Error: ${res.status} - ${JSON.stringify(data)}`);
                }
            }catch(error){
                console.error(error);
            }
        }
    },
}