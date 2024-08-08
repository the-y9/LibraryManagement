export default{
    template:`
    <div>
    <div class='row'>
        <ul v-for='act in issuesData'>
            <li>{{act}}</li>
        </ul>
            <div class='col-1'><h3 class="pr-4">Admin Activity</h3></div>
            <div class='col-1'></div>
            <div class='col-9'>
                <canvas id="scatterChart" width="800" height="400"></canvas>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            token:localStorage.getItem('auth-token'),  
            issuesData:null,         
        }
    }
    ,
    methods: {
        renderChart(data) {
            // Extracting date and time from data
            const dates = data.map(item => new Date(item.a_datetime.split(' ')[0])); // Extracting date part
            const times = data.map(item => item.a_datetime.split(' ')[1]);          // Extracting time part
            const actions = data.map(item => item.action);
        
            // Prepare datasets for Chart.js
            const datasets = [];
            actions.forEach(action => {
                const filteredData = data.filter(item => item.action === action);
                const formattedData = filteredData.map(item => ({
                    x: new Date(item.a_datetime.split(' ')[0]),  // Date part
                    y: item.a_datetime.split(' ')[1]            // Time part
                }));
                
                datasets.push({
                    label: action,
                    data: formattedData,
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false
                });
            });
        
            // Create Chart.js instance
            const ctx = document.getElementById('scatterChart').getContext('2d');
            new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: datasets
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                parser: 'DD/MM/YYYY',
                                tooltipFormat: 'DD/MM/YYYY',
                                unit: 'day',
                                displayFormats: {
                                    day: 'DD/MM/YYYY'
                                },
                                min: new Date('2024-04-01'),
                                max: new Date('2024-04-30'),
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            }
                        },
                        y: {
                            type: 'time',
                            time: {
                                parser: 'HH:mm',
                                tooltipFormat: 'HH:mm',
                                unit: 'hour',
                                displayFormats: {
                                    hour: 'HH:mm'
                                }
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Time'
                            }
                        }
                    }
                }
            });
        }
        
    },
    async mounted(){
        try{
            const response = await fetch('/api/adminActivity',{
                headers:{
                    'Authentication-Token':this.token
                }
            })
            const data = await response.json()
            if (response.ok){
                this.issuesData = data
                this.renderChart(data)
            }else{
                alert(data.error)
            }
        }catch (error) {
                console.error('Error fetching book data:', error);
            }
    }
}