export default{
    template: `
    <div>
    <h3>Books to Read</h3>
    
    <div class="card" style="width: 18rem;" v-for="i in allissues" :key='returns'>
        <div class="card-body">
            <h5 class="card-title">{{i.book_title}}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">-by {{i.book_author}}</h6>
            <p class="card-text"> {{i.action}} on {{fdt(i.a_datetime)}} </p>
            <sup>{{i.book_section}}</sup><br>
            <a href="#" class="card-link">Read</a>
            <a href="#" class="card-link" @click="ret(i.id,'Returned')">Return</a>
            
        </div>
    </div>
    </div>
    `,
    data(){
        return{
            allissues:[],
            token: localStorage.getItem('auth-token'),
            returns:0,
        }
    }
    ,
    methods: {
        fdt(dt){
            if (dt == null){ return null}
            else{
                const format = {year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}
                const date = new Date(dt)
                return date.toLocaleDateString('en-IN', format)
            }
        },
        async ret(issue_id,a){
            const res = await fetch(`/ret/${issue_id}/${a}`,{
                headers:{
                    'Authentication-Token': this.token,
                }
            })
            const data = await res.json()
            if (res.ok){
                alert(data.message)
                const updatedRes = await fetch('/api/allowedIssue',{
                    headers:{
                        "Authentication-Token": this.token,
                    }
                })
                const newdata = await updatedRes.json().catch((e)=>{
                    this.error = e
                })
                if(updatedRes.ok){ this.allissues=newdata}
                else{ this.error = "Error in Return Update"}
            }else{alert(data.message)}
        },
    }
    ,
    async mounted(){
        const res = await fetch('/api/allowedIssue',{
            headers: {
                "Authentication-Token": this.token,
            }
        })
        const data = await res.json().catch((e)=>{
            this.error = e
        })
        if(res.ok){ this.allissues=data; } 
        else{ this.error = "Error" }
    },
}