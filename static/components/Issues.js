export default{
    template: `
    <div>
        <h1>Issues</h1>
        <div class='row'>
        <div class='col-1'></div>
        <div class='col-10 alert alert-danger' v-if="error"> {{ error }}</div>
        
        <div class='col-10'>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <form>
                    <input class="form-control me-2" type="search" v-model="searchQuery" placeholder="Search" title="Search">
                </form>
                <div>
                <span v-if="isWaiting"><i class="bi bi-file-earmark-arrow-down text-primary"></i></span>
                <button @click='downloadCsv' class='btn btn-primary'>
                Download Csv</button>
                </div>
            </div>
            <table id='table' class="table table-hover text-center">
                <thead>
                    <tr>
                    <th>Issue Id<th>User Id<th>Requested Book Id<th>Request Date
                    <th>Action<th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(issue,index) in filteredIssues">
                    <td>{{issue.id}}<td>{{issue.user_id}}<td>{{issue.book_id}}<td>{{ formatDate(issue.r_datetime) }}
                    <td><button v-if="issue.action=='Requested'" class="btn btn-success m-2" @click="act(issue.id,'Allowed')">Allow</button>
                    <button v-if="issue.action=='Requested'" class="btn btn-danger m-2" @click="act(issue.id,'Denied')">Deny</button>
                    <button v-if="issue.action=='Allowed'" class="btn btn-danger m-2" @click="act(issue.id,'Revoked')">Revoke</button>
                    <td><span v-if="issue.action!='Requested'"
                    class="input-group-text" id="basic-addon2">
                    {{issue.action}} on {{formatDate(issue.a_datetime)}}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
    </div>
    `,
    data(){
        return{
            allIssues: [],
            token: localStorage.getItem('auth-token'),
            error: null,
            isChecked: false,
            searchQuery: '',
            isWaiting: false,
            
        }
    },
    computed:{
        filteredIssues(){
            return this.allIssues.filter(issue => {
                const id = issue.id.toString() || '';
                const user_id = issue.user_id.toUpperCase() || '';
                const book_id = issue.book_id.toString() || '';
                // const r_datetime = issue.r_datetime?.toUpperCase() || '';
                // const a_datetime = issue.a_datetime?.toUpperCase() || '';
                const query = this.searchQuery.toUpperCase() || '';
                return id.includes(query) || user_id.includes(query) || book_id.includes(query) ;//|| r_datetime.includes(query) || a_datetime.includes(query); 
            })
        },
    },
    methods: {
        formatDate(datetime) {
            if (datetime == null){ return null}
            const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const date = new Date(datetime);
            return date.toLocaleDateString('en-IN', options);
        },
        async downloadCsv(){
            this.isWaiting = true
            const res = await fetch('/download-csv')
            const data = await res.json()
            if (res.ok){
                const taskId = data['Task-id']
                const intv = setInterval(async ()=>{
                    const csv_res = await fetch(`/get-csv/${taskId}`)
                    if (csv_res.ok){
                        this.isWaiting = false
                        clearInterval(intv)
                        window.location.href = `/get-csv/${taskId}`
                    }
                },1000)
            }
        }
        ,
        async act(issue_id,a){
            const res = await fetch(`/action/${issue_id}/${a}`,{
                headers:{
                    'Authentication-Token': this.token,
                }
            })
            const data = await res.json()
            if (res.ok){
                alert(data.message);
                const updatedRes = await fetch('/issues', {
                    headers: {
                        "Authentication-Token": this.token,
                    }
                });
                const newData = await updatedRes.json();
                if (updatedRes.ok) {
                    this.allIssues = newData;
                } else {
                    this.error = "Error";
                }
            }else{alert(data.message)}
        },
    },
    async mounted(){
        const res = await fetch('/issues',{
            headers: {
                "Authentication-Token": this.token,
            }
        })
        const data = await res.json().catch((e)=>{ this.error = e })
        if(res.ok){
            if (data.length === 0) {
                this.error = "No issues happened";
            } else {
                this.allIssues = data;
            }
        }else{ this.error = data.message }
    },

}