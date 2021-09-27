/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios'
import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
// import config from '../../config.json';
import config from './config.json';
import userJson from './users.json';
import paymentsJson from './payment.json';
import graphJson from './graph.json';
import { connect } from 'react-redux'
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';

// import './style.css'
// import Joyride, { CallBackProps, STATUS, Step, StoreHelpers } from 'react-joyride';
import { withRouter } from "react-router-dom";
import {
    Card,
    CardActions,
    CardContent, Button, Input,
    // Checkbox,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TablePagination, FormControl, InputLabel
} from '@material-ui/core';
import { ExportToCsv } from 'export-to-csv';
// import './Session.css'
import { Checkbox, MenuItem, Select, Chip, TextField } from '@material-ui/core';
class Account extends Component {
    constructor(props) {
        super(props)
        this.state = { new: false,category:'all', 
		year:0,
        run: false, 
        steps: [
          {
            content: <h4>Get a detailed analysis of each customer transaction in your app. You’ll get customer contacts and the customer’s user flow.</h4>,
            locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
            placement: 'center',
            target: 'body',
          },
      
          {
            content: 'Get to view session data by the following categories:- ALL,USSD and Whatapp categories',
            placement: 'bottom',
            styles: {
              options: {
                width: 300,
              },
            },
            target: '.demo__projects89',
            title: 'Categories ',
          },
          {
            content: (
              <div>
          Click here to view the customer journey, steps that the customer took while interacting with your business.
              </div>
            ),
            placement: 'top',
            target: '.demo__projects892',
            title: 'View ',
          },
        
        ],
        id_index: null, update: false, users: [], selected: 0, newAccount: '', modal: false, sessions: [], loading: false, page: 1 }
    }
    componentDidMount() {
        this.getCodes(1);
        var name= localStorage.getItem('nickname');
        var board_892=localStorage.getItem('board_892'); 
       
            if(name!=board_892){
        this.setState({
             run: true,
           });
        // localStorage.setItem('board_892',name);
            }
     
    }

    getCodes = async (page) => {

        // this.setState({ loading: true })
        var token = localStorage.getItem("token");
        this.setState({ loading: true })
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Authorization", 'Bearer ' + token)
   
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        var addurl = '';
        if (this.state.id_index != null) {
            addurl = '?pagesize=1&direction=next&index=' + this.state.id_index
        }
        var obj=[]
        const url = config.baseUrl+'/user_data.json';
		console.log(url)
        await fetch(url, requestOptions)
            .then(response => {
              
                if (response.status == '403' || response.status == '401') {
                  
                }
                // if (response.status === 500) {
                //     if (token == "null" || token == null) {
                //         this.props.history.push('/login')
                //     }
                // }
                return response.json();
            })
            .then(result => {
                this.setState({ loading: false })
                // // if()
                // let c = result.data;
                // c.map((item, i) => {
                //   console.log(this.getMonthFromString(item.dateCreated))
                //   c[i].order= this.getMonthFromString(item.dateCreated);

                // })
              
                // this.setState({ id_index: result.index})

         console.log(result)
		this.setState({
			users: result
			
		})
                // this.setState({
                //     users: [
                //         ...this.state.users,
                //         ...result.sessions
                //     ]
                // })
           
            })
            .catch(error => {
                this.setState({ loading: false })
                // if (JSON.error(error) === "{}") {
                console.log(error)
                //   this.setState({ errorMsg: 'Flow does not exist' })
                //   this.setState({ showError: true })
                // }else{
                //  this.setState({ loading: false })
                // this.setState({ errorMsg:'Network Error' })
                // this.setState({ showError: true })
                // }

            });



    }


   
    count = () => {
        let b = {};
        this.state.users.forEach(el => {
            b[el.phoneNumber] = (b[el.phoneNumber] || 0) + 1;
        })

        return Object.keys(b).length;
    }
    countType = (type) => {
        const countTypes = this.state.users.filter(movie => movie.Status === type);
        return countTypes.length;
    }

    getMonthFromString = (b) => {
 
        let year = b.substring(b.length - 4, b.length);
        let month = b.substring(4, 7);
        let d = b.substring(11, 13);
        let u = b.substring(14, 16);
        let p = b.substring(17, 19);
        let day = b.substring(8, 10);
        let month1 = month.toLowerCase();
        var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        month1 = months.indexOf(month1) + 1;
     
        let n = year + month1 + day + d + u + p
        return n;
    }
     export_csv_tickets = () => {
        //  console.log(receipts)
        try{

      
        var data = this.state.users

        data.forEach((element, index) => {
            // if (typeof element.Event != "undefined") {
            //     element.abbreviation = element.Event.abbreviation
            //     element.description = element.Event.description
            //     element.location = element.Event.location
            //     element.date = element.Event.date
            //     element.time = element.Event.time
            //     element.Event = element.Event.name
            // } else {
            //     element.Event = ""
            // }
            delete element.Sessions;
            // delete element.__v;
        });
        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: true,
            title: 'User Data',
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
            // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
        };

        const csvExporter = new ExportToCsv(options);

        csvExporter.generateCsv(data);
        } catch (e) {
            console.log(e)
        }
    }
    
      
   
    render() {
		const data = {
            labels: graphJson.data[0]['Label'],
            datasets: [
                {
                    label: "Total Clients",
                    fill: true,
                    lineTension: 0.5,
                    backgroundColor: "rgba(85, 110, 230, 0.2)",
                    borderColor: "#556ee6",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "#556ee6",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "#556ee6",
                    pointHoverBorderColor: "#fff",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: graphJson.data[this.state.year]['Total Clients']
                },
                {
                    label: "Active Clients",
                    fill: true,
                    lineTension: 0.5,
                    backgroundColor: "rgba(235, 239, 242, 0.2)",
                    borderColor: "#ebeff2",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "#ebeff2",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "#ebeff2",
                    pointHoverBorderColor: "#eef0f2",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
					data: graphJson.data[this.state.year]['Active Clients']
                }
            ]
        };
        var option = {
            scales: {
                yAxes: [{
                    ticks: {
                        max: 100,
                        min: 20,
                        stepSize: 10
                    }
                }]
            }
        }
        // Array.prototype.unique = function () {

        //   return this.filter(function (value, index, self) {
        //     return self.indexOf(value) === index;
        //   });
        // };

        // var arr = []
        // const filt = () => {

        //   this.state.users.forEach(receipt => {
        //     // if (receipt.total_amount_received === receipt.total_amount) {
        //       arr.push(receipt)
        //   //   }
        //   // });
        //   // return arr

        // })} 
        // { this.getMonthFromString()}
        // let result = this.state.users.map(x => x.phoneNumber);
        return (
            <div style={{ padding: 20, minHeight: '70vh', position: 'relative' }}>
              <div style={{height:50,background:'#D81B60',width:'100vw',left:0,top:0,position:'fixed'}}>

			  <Typography style={{ fontWeight: 'bold',paddingLeft:10, fontSize: '22px',lineHeight:'50px',color:"white" }}>Users and Payments</Typography> 
			  </div>
                
                <br />
                <div style={{ width: '100%', }}>

                    {/* {this.state.users.length > 0 && <Button onClick={() => { this.setState({ new: true }) }} style={{ backgroundColor: '#673AB7', float: 'right', color: 'white', marginBottom: 15 }}> Create User</Button>} */}

                    {/* <h2><Typography style={{ fontWeight: 'bold', fontSize: '28px' }}>Sessions</Typography> </h2> */}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-start", flexDirection: 'row', flexWrap: 'wrap' }}

                >
                  
                    <Card
                        // {...rest}
                        // className={clsx(classes.root, className)
                        // }
                        style={{ minWidth: 200, margin: 20 }}
                    >
                        <CardContent style={{ background:'#963CC1'}}>
                            <Grid
                                container
                                justify="space-between"
                            >
                                <Grid item>
                                    <Typography
                                        // className={classes.title}
                                        color="textSecondary"
                                        gutterBottom
                                        variant="body2"
                                        style={{ color: "white" }}
                                    >
                                        Total Users
            </Typography>
                                    <Typography variant="h3" style={{ color: "white" }}>{userJson.data.length}</Typography>
                                </Grid>
                                <Grid item>
                                    {/* <Avatar
                  // className={classes.avatar}
                  >
                    <PeopleIcon
                    // className={classes.icon}
                    />
                  </Avatar> */}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                  
                
<div style={{flex:1,display:'flex',justifyContent:'flex-end',padding:20,alignItems:'flex-end'}}>
                <TextField
          id="outlined-password-input"
          label="Search..."
          type="text"
          autoComplete="current-password"
		  style={{marginRight:20}}
        />
		<Button color='primary'  style={{marginRight:20}}>Search</Button>
		</div>

                </div>
				
               
                <div style={{ width: '100%',boxShadow: "0 2px 5px 0 rgba(0,0,0,.16), 0 2px 5px 0 rgba(0,0,0,.23)", minWidth: 320, overflowX: 'scroll', minHeight: '70vh' }}>
                <div className="demo__projects89" style={{display:'flex',flexDirection:'row',width:'100%',background:'white'}}>
                        <div onClick={() => { this.setState({ category: 'all' }) }} style={{ width: 100, textAlign: 'center', cursor: 'pointer', color: this.state.category == 'all' ? '#303669' : '', borderTop: this.state.category == 'all' ? '5px solid #303669' :'5px solid white'}}
                            className='menuTab' 
                        >
                            <Typography style={{ fontWeight: 'bold', fontSize: '16px',lineHeight:'60px' }}>USERS</Typography> 
                </div>
                        <div className='menuTab' onClick={() => { this.setState({ category: 'ussd' }) }} style={{ width: 100, textAlign: 'center', color: this.state.category == 'ussd' ? '#303669' : '', cursor: 'pointer', borderTop: this.state.category == 'ussd' ? '5px solid #303669' : '5px solid white'}}>
                            <Typography style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '60px' }}>PAYMENTS</Typography>
                        </div>
                        <div className='menuTab' onClick={() => { this.setState({ category: 'whatsapp' }) }} style={{ width: 100, textAlign: 'center', color: this.state.category == 'whatsapp' ? '#303669' : '', cursor: 'pointer', borderTop: this.state.category == 'whatsapp' ? '5px solid #303669' : '5px solid white' }}>
                            <Typography style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '60px' }}>GRAPHS</Typography>
                        </div>
                        <div style={{flex:1}}></div>
<div style={{alignSelf:'flex-end'}}> </div>
                       
                </div>
                    <Table style={{ backgroundColor: 'white', boxShadow: '0 2px 5px 0 rgba(0,0,0,.16), 0 2px 5px 0 rgba(0,0,0,.23)' ,marginBottom:20}}>
                        {/* {this.state.loading &&
          <TableBody style={{width:'100%',display:'flex',flexDirection:'row',justifyContent:"center" }}>
            <CircularProgress color='#1E88E5' />
            </TableBody>

          } */}
                   <TableHead>
                  { this.state.category=='all' &&  <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell>Last Seen</TableCell>
                                <TableCell>Total visits</TableCell>
                                <TableCell>Live</TableCell>
                             <TableCell>Developed Flows</TableCell> 
                             <TableCell>Complete Flows</TableCell>
                         <TableCell>Incomplete Flows</TableCell>
                                <TableCell>Mpesa Payment</TableCell>

                                <TableCell>Card Payment</TableCell>
                                <TableCell>sms Payment</TableCell>
                            </TableRow>}
							{ this.state.category=='ussd' &&  <TableRow>
								 <TableCell>No</TableCell>
                                <TableCell>Organization</TableCell>
                                <TableCell>Payment_Mode</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Total Credits</TableCell>
                             <TableCell>Used Credits</TableCell> 
                             <TableCell>Payments Date</TableCell>
                         </TableRow>}
                        </TableHead>
                        <TableBody>

                           
                           
                              
                                  {this.state.category=='ussd' && paymentsJson.data.map((user, i) => {
                                         return (
                                        <TableRow

                                            // className={classes.tableRow}
                                            hover
                                            key={i}

                                        >
                                            <TableCell>
                                                {i + 1}
                                            </TableCell>
                                            <TableCell>
                                                {user['Organization']}
                                            </TableCell>
                                            <TableCell>
											{user['Payment_Mode']}
                                            </TableCell>
                                            <TableCell>
											{user['Amount']}
                                            </TableCell>
                                         
                                            <TableCell>
											{user['Total_Credits']}
                                            </TableCell>
											<TableCell>
											{user['Used Credits']}
                                            </TableCell>
                                            <TableCell>
											{user['Payments Date']}
                                            </TableCell>
                                          
                                        </TableRow>
                                    )
                                    
										 })
                                    }

                           
                            
                                    
                             
									     {this.state.category == 'all' && userJson.data.map((user, i) => {  
                                    return (
                                        <TableRow

                                            // className={classes.tableRow}
                                            hover
                                            key={i}

                                        >
                                            <TableCell>
                                                {i + 1}
                                            </TableCell>
                                            <TableCell>
                                                {user['last visit']}
                                            </TableCell>
                                            <TableCell>
											{user['No of visits']}
                                            </TableCell>
											<TableCell>
											{user['live'].toString()}
                                            </TableCell>
											<TableCell>
											{user['flows'].developed}
                                            </TableCell>
											<TableCell>
											{user['flows'].complete}
                                            </TableCell>
											<TableCell>
											{user['flows'].incomplete}
                                            </TableCell>
											<TableCell>
											{user['payments']['Mpesa'].toString()}
                                            </TableCell>
											 <TableCell>
											{user['payments']['Card'].toString()}
                                            </TableCell>
											<TableCell>
											{user['payments']['Sms'].toString()}
                                            </TableCell> 
                                        </TableRow>
                                    )

									})
									
                                }
                                
                        










                        </TableBody>
                    </Table>

					{this.state.category == 'whatsapp' && <div>
					<TextField
          id="filled-select-currency"
          select
          label="Select"
          value={this.state.year}
          onChange={(e)=>{
			  console.log(e.target.value)
this.setState({year:e.target.value})
console.log(this.state.year)
console.log("-----------------")
		  }}
		style={{margin:20}}
          helperText="Please select the year"
          variant="filled"
        >
          {graphJson.data.map((option,i) => (
            <MenuItem key={i} value={i}>
              {option['Year']}
            </MenuItem>
          ))}
        </TextField>
								<Line  data={data} options={option} />
					</div>}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', }}>
                        {/* <Button style={{ backgroundColor: '#1565C0', color: 'white', margin: 20, width: 100 }} onClick={() => {
                            var t = this.state.page;
                            t = t - 1;
                            if (t != 0) {
                                this.setState({ page: t })
                                this.getCodes(t)
                            }


                        }}>Previous</Button>

                        <div style={{ alignText: 'center', lineHeight: '50px', margin: 20 }}>
                            {this.state.page}

                        </div> */}
                        <br/>
                        <Button className="button_f" style={{color: 'white', margin: 20, width: 150 }} onClick={() => {
                            // var t = this.state.page;
                            // if (this.state.users.length != 0) {
                            //     t = t + 1;
                            //     this.setState({ page: t })
                            //     this.getCodes(t)
                            // }
                            this.getCodes();
                        }} >Load more</Button>



                    </div>
                </div>


                {this.state.new &&
                    <div style={{ position: 'fixed', color: 'white', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, overflow: 'hidden', display: "flex", justifyContent: 'center', flexDirection: 'row', alignItems: 'center', fontSize: 16 }}>
                        <div onClick={() => { this.setState({ new: false }) }} style={{ position: 'absolute', height: '100vh', width: '100vw', top: 0, left: 0, }}></div>
                        <div style={{ zIndex: 10, width: 350, borderRadius: 3, color: 'black', padding: 15, backgroundColor: 'white', boxShadow: '0 1px 1.5px 0 rgba(0,0,0,.12), 0 1px 1px 0 rgba(0,0,0,.24)' }}>
                            <h3>  <Typography>Create New Account</Typography></h3><br />
                            <TextField value={this.state.newAccount} onChange={(e) => { this.setState({ newAccount: e.target.value }) }} label='Email' type='text' placeholder='Email' style={{ width: '100%' }} /><br /><br />

                            <Typography>
                                The default password is 'user1234'
          </Typography><br /><br />
                            <Button onClick={
                                () => {
                                    if (this.state.newAccount.trim() === '') {
                                        alert('Enter email')
                                    } else {
                                        // this.sendForms()
                                    }
                                }
                            } fullWidth style={{ backgroundColor: '#1565C0', color: 'white' }} className="button_f">Submit</Button>
                        </div>
                    </div>

                }

                {this.state.update &&
                    <div style={{ position: 'fixed', color: 'white', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, overflow: 'hidden', display: "flex", justifyContent: 'center', flexDirection: 'row', alignItems: 'center', fontSize: 16 }}>
                        <div onClick={() => { this.setState({ update: false }) }} style={{ position: 'absolute', height: '100vh', width: '100vw', top: 0, left: 0, }}></div>
                        <div style={{ zIndex: 10, width: 350, borderRadius: 3, color: 'black', padding: 15, backgroundColor: 'white', boxShadow: '0 1px 1.5px 0 rgba(0,0,0,.12), 0 1px 1px 0 rgba(0,0,0,.24)' }}>
                            <h3>  <Typography>Update Account</Typography></h3><br />
                            <TextField label='Email' type='text' value={this.state.users[this.state.selected].username} placeholder='Email' style={{ width: '100%' }} /><br /><br />
                            <TextField label='Organization' type='text' value={this.state.users[this.state.selected].organization} placeholder='Organization' style={{ width: '100%' }} /><br /><br />
                            {/* <strong>Active</strong><br /> */}
                            <FormControl >
                                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                    Active status
        </InputLabel>
                                <Select label='Active status' value={this.state.users[this.state.selected].enabled} style={{ width: 100 }}>

                                    <MenuItem value='true'>True</MenuItem>
                                    <MenuItem value='False' >False</MenuItem>

                                </Select></FormControl><br /><br />
                            <TextField label='Password' type='password' value={this.state.users[this.state.selected].username} placeholder='Password' style={{ width: '100%' }} /><br /><br />
                            <TextField label='Confirm Password' type='password' value='*******' placeholder='Confirm Password' style={{ width: '100%' }} /><br /><br />
                        <Button fullWidth style={{ backgroundColor: '#1565C0', color: 'white' }} className="button_f">Submit</Button>
                        </div>
                    </div>

                }


                {this.state.modal &&
                    <div style={{ position: 'fixed', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.5)', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', zIndex: 1000 }}>
                        <div style={{ width: '100vw', height: '100%', background: 'transparent', position: 'absolute', zIndex: -10 }} onClick={() => { this.setState({ modal: false }) }}></div>

                        <div>
                            <div style={{ margin: 10, textAlign: 'center', borderRadius: 5, overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minWidth: 360, width: '35vw', marginTop: 100, backgroundColor: 'white' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingRight: 10, justifyContent: 'space-between', background: '#f8f8f8', width: '100%', height: 40 }}>
                                    <h3><Typography style={{ fontWeight: 'bold', fontSize: 18 }}>User steps</Typography></h3>
                                    <div style={{ width: 30, height: 30 }} onClick={() => { this.setState({ modal: false }) }}>
                                        <CloseIcon size={30} />
                                        {/* {this.state.sessions[this.state.selected].journey.input} */}

                                    </div>

                                </div>
                                {/* <br /> display: 'flex', flexDirection: 'row', justifyContent: 'space-between',  */}
                                <div style={{ padding: 10, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                <h4><Typography style={{ fontWeight: 'bold' }}>Step: {this.state.selected + 1} / {this.state.sessions.length} - {this.state.state_session=== 'COMPLETE' ? <font style={{ color: 'green', fontWeight: 'bold' }}>Complete</font> : <font style={{ color: '#D32F2F', fontWeight: 'bold' }}>Incomplete</font>}
                                           </Typography> </h4>

                                    <h4><Typography style={{ fontWeight: 'bold' }}>{this.state.sessions[0].journey.input} </Typography> </h4>

                                </div>
                                <div style={{ border: '0.5px solid #e5e5e5', display: 'flex', flexDirection: 'column', justifyContent: 'start', textAlign: 'left', padding: 10, width: 300, borderRadius: 10, boxShadow: '0 2px 5px 0 rgba(0,0,0,.16), 0 2px 5px 0 rgba(0,0,0,.23)' }}>
                                    <h4><Typography style={{ fontWeight: 'bold', lineHeight: '20px' }}>{this.state.sessions[this.state.selected].screen.nodeName} </Typography> </h4>
                                    {/* <br/> */}
                                    {/* <div><p><Typography style={{fontWeight:'bold'}}>Response</Typography></p></div> */}
                                    <div style={{ minHeight: 100 }}>
                                        {this.state.sessions[this.state.selected].screen.Text.substring(0, this.state.sessions[this.state.selected].screen.Text.length).split('\n').map((item, i) => {

                                            // if (item.substring(0, 4) == 'CON ' || item.substring(0, 4) == 'END '){
                                            //     return (<div> <Typography>{item.substring(4, item.length)}</Typography> </div>)
                                            // }else{
                                                return (<div> <Typography>{item}</Typography> </div>)
                                            // }
                                            

                                        })}</div>
                                    <br />
                                    <div style={{ height: 20 }}>  {this.state.selected !== this.state.sessions.length - 1 && <h4><Typography style={{ fontWeight: 'bold' }}>Input: {this.state.sessions[this.state.selected + 1].journey.input} </Typography> </h4>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: 80 }}>
                                 
                                    {this.state.selected !== 0 ? <button onClick={() => { this.setState({ selected: this.state.selected - 1 }) }} style={{ margin: 15, marginRight: 0, width: 80, height: 40, color: 'white', border: 0, backgroundColor: '#1565C0' }}>Previous</button> : <button style={{ margin: 15, marginRight: 0, width: 80, height: 40, color: 'white', border: 0, backgroundColor: '#1565C0' }}>Previous</button>}
                                {this.state.selected !== this.state.sessions.length - 1 ? <button onClick={() => { this.setState({ selected: this.state.selected + 1 }) }} style={{ margin: 15, float: 'right', width: 80, height: 40, color: 'white', border: 0, backgroundColor: '#1565C0' }} >Next</button> : <button style={{ margin: 15, float: 'right', width: 80, height: 40, color: 'white', border: 0, backgroundColor: '#1565C0' }}>Next</button>}
                                    {/* {this.state.sessions.length === 1 && <button onClick={() => { this.setState({ modal: false }) }} style={{ margin: 15, float: 'right', width: 80, height: 40, color: 'white', border: 0, backgroundColor: '#B71C1C' }}>Cancel</button>} */}



                                </div>
                            </div>
                        </div>

                    </div>}

                {this.state.loading &&
                    <div style={{ position: 'fixed', color: 'white', top: -50, left: 0, width: '100%', height: '130vh', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, overflow: 'hidden', display: "flex", justifyContent: 'center', flexDirection: 'row', alignItems: 'center', fontSize: 16 }}>
                        <CircularProgress color='white' />
                    </div>

                }
                 {/* {this.state.loading &&
                    <div style={{ position: 'absolute', color: 'white', top: -50, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(0,0,0,0.0)', zIndex: 100, overflow: 'hidden', display: "flex", justifyContent: 'center', flexDirection: 'row', alignItems: 'center', fontSize: 16 }}>
                        <CircularProgress color='white' />
                    </div>

                } */}
            </div>
        );
    };
}


// export default withRouter(SignIn);
// 
export default Account;