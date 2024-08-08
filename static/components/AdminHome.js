import AdminActivity from "./AdminActivity.js";

export default{
    template: `
    <div>
        <h1>Librarian</h1>
        
        <div class='row'>
            <div class='col-1'><h3 class="pr-4">Books Requested</h3></div>
            <div class='col-1'></div>
            <div class='col-9'>
                <canvas id="bookChart" width="6" height="1"></canvas>
            </div>
        </div>
        <!-- <AdminActivity /> -->
    </div>
    `,
    components:{
        AdminActivity,
    },
    data(){
        return{
            token:localStorage.getItem('auth-token'),
            counts: null,
           
        }
    }
    ,
    methods: {
        renderChart(data) {
            const labels = data.map(item => `${item.book_id} (${item.book_title})`);
            const counts = data.map(item => item.book_counts);

            const ctx = document.getElementById('bookChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Book Counts',
                        data: counts,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    
    },
    async mounted(){
        try{
            const response = await fetch('/api/bookCounts',{
                headers:{
                    'Authentication-Token':this.token
                }
            })
            const data = await response.json()
            if (response.ok){
                this.counts = data
                this.renderChart(data)
            }else{
                alert(data.error)
            }
        }catch (error) {
                console.error('Error fetching book data:', error);
            }
    }
}