import React, {useEffect, useState} from "react";
import axios from "axios";
import { useParams,useNavigate} from "react-router-dom";
import Header from "../../components/Header";
import { useStateContext } from '../../contexts/ContextProvider';

export default function UpdateOrder(){
    const navigate = useNavigate();

    const [invoiceNo, setInvoice] = useState("");
    const [orderName,setOrderName] = useState("");
    const [costDate, setDate] = useState("");
    const [materialCost,setMatCost] = useState("");
    const [unitQty,setQty] = useState("");
    //const [totalMatCost,setTotalMatCost] = useState("");
    const [overHeadCost, setOverhead] = useState("");
    const parseOverhead = parseFloat(overHeadCost);
    const parseUnitQty = parseFloat(unitQty);
    const parseMaterialCost = parseFloat(materialCost);
    const totalMatCost =  parseMaterialCost * unitQty;
    const totalCost = totalMatCost + parseOverhead;
    

    const {id} = useParams();   // gets the id from the url
    
     const getOrder =()=>{

        axios.get(`http://localhost:8070/production/order/${id}`).then((res)=>{
            setInvoice(res.data.invoiceNo);
            setOrderName(res.data.orderName);
            setDate(res.data.costDate);
            setMatCost(res.data.materialCost);
            setQty(res.data.unitQty);
            setOverhead(res.data.overHeadCost);

        }).catch((err)=>{
            alert(err);
        })
    }
    const [employee,setEmployee] = useState([]);
    const getEmployees = async () => {
        axios
          .get('http://localhost:8070/employee/viewEmployee')
          .then((res) => {
            setEmployee(res.data);
          })
          .catch((err) => {
            alert(err.message);
          });
      };
      
        useEffect(()=>{ //This will run the page when loaded
        getOrder();
        getEmployees();
    },[]);

    return (
        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  dark:bg-secondary-dark-bg dark:text-white '>
         <Header category="Form" title="Update Production Voucher" />
         <div className=" flex items-center justify-center">
            <form onSubmit={async(e)=>{
                        e.preventDefault();
        
                        const newOrder = {
                            invoiceNo,
                            orderName,
                            costDate,
                            materialCost,
                            unitQty,
                            totalMatCost,
                            overHeadCost,
                            totalCost,

                        }
                        console.log(newOrder);
                        axios.put("http://localhost:8070/production/order/update/"+id,newOrder).then((res)=>{
                            alert("Cost voucher updated successfully");
                            navigate('/viewOrders');
                        }).catch((error)=>{
                            console.log(error);
                            alert(error);
                        })
            }}>
                <div className="mb-3">
                    <label for="name" className="text-md">Enter Invoice Number</label>
                    <input type="text" className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black" id="name" placeholder={invoiceNo} onChange={(e)=>{
                        setInvoice(e.target.value);    //event has to be created in any onclick. event has to be passed down to get the values
                    }}/>
                </div>

                <div className="mb-3">
                        <label for="category" className="form-label">Select the Product</label>
                            < select placeholder={orderName}  class="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black"  id="category" required onChange={(e) => {
                            setOrderName(e.target.value);  
                        }}>
                            {/* <option selected value={orderName}>{orderName}</option>
                            <option value="T-Shirts">T-Shirts</option>
                            <option value="Collars">Collars</option>
                            <option value="Trousers">Trousers</option>
                            <option value="Shirts">Shirts</option> */}
                            {employee.map((data)=>{
                                return(
                                        <option value={data.employeeFullName} label={data.employeeFullName}>{data.employeeFullName} </option>
                                    )
                             })}

                        </select>
                    </div>


                <div className="mb-3">
                    <label for="date" className="text-md" >Enter the date</label>
                    <input type="date"className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black" id="address" placeholder="" onChange={(e)=>{
                        setDate(e.target.value);
                    }}/>
                </div>

                <div className="mb-3">
                    <label for="address" className="text-md">Enter the Material Cost</label>
                    <input type="Number" className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black" id="" value={parseMaterialCost} onChange={(e)=>{
                        setMatCost(e.target.value);
                    }}/>
                </div>
                
                <div className="mb-3">
                    <label for="address" className="text-md">Enter the Quantity</label>
                    <input type="Number" className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black" id="address" placeholder={parseUnitQty} onChange={(e)=>{
                        setQty(e.target.value);
                    }}/>
                </div>
                                
                <div className="mb-3">
                    <label for="address" className="text-md">Total Material Cost</label>
                    <input type="Number" className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black" id="address" placeholder={totalMatCost} onChange={(e)=>{ 
                       // setMatCost(e.target.value);
                    }} readOnly/>
                </div>

                <div className="mb-3">
                    <label for="address" className="text-md">Total overhead Cost</label>
                    <input type="Number" className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black" id="address" placeholder={parseOverhead}  onChange={(e)=>{
                        setOverhead(e.target.value); 
                    }} />
                </div>

                <div className="mb-3">
                    <label for="address" className="text-md">Total Production Cost</label>
                    <input type="Number" className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black" id="address" placeholder={totalCost}  onChange={(e)=>{
 
                    }} readOnly/>
                </div>

                <div>
                <button type="submit" className="bg-red-800 text-lg text-white left-10 p-3 my-4 rounded-lg hover:bg-red-600">Update Cost Voucher</button>
                </div>
            </form>
            </div>
    </div>
    );
};