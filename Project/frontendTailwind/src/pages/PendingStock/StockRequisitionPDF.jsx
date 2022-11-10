import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link ,useNavigate} from "react-router-dom";
import {jsPDF} from "jspdf";
import TableHeader from "../../components/Table/TableHeader";
import TableData from '../../components/Table/TableData';
import Header from "../../components/Header";
import { useStateContext } from '../../contexts/ContextProvider';

import { FiSettings } from 'react-icons/fi';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../../components';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

export default function PendingStockRequisition(){
    const navigate = useNavigate();
    const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings,  } = useStateContext();
    const [Order,setOrder] = useState([])
    const [searchTerm, setSearchTerm] = useState(""); 

        async function getOrders(){
            await axios.get("http://localhost:8070/production/order/allOrders").then((res)=>{
                setOrder(res.data);
            }).catch((err)=>{
                alert(err.message);
            })
        }

        useEffect(()=>{
            getOrders();
            const currentThemeColor = localStorage.getItem('colorMode'); // KEEP THESE LINES
            const currentThemeMode = localStorage.getItem('themeMode');
            if (currentThemeColor && currentThemeMode) {
              setCurrentColor(currentThemeColor);
              setCurrentMode(currentThemeMode);
            }
        },[]);

        const createPDF = async () => {
            const date = new Date().toISOString().split('T')[0];
            const pdf = new jsPDF("landscape", "px", "a1", false);
            const data = await document.querySelector("#tableContainer");
            pdf.html(data).then(() => {
                pdf.save("stocks_" + date + ".pdf");
            });
        };


        return(
            <div>

      {/* DON'T CHANGE ANYTHING HERE */}

        <div className={currentMode === 'Dark' ? 'dark' : ''}>

            <div className="flex relative dark:bg-main-dark-bg">

                <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}> {/* THEME SETTINGS BUTTON */}
                    <TooltipComponent content="Settings" position="Top">
                    <button
                        type="button"
                        onClick={() => setThemeSettings(true)}
                        style={{ background: currentColor, borderRadius: '50%' }}
                        className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                    >
                        <FiSettings />
                    </button>
                    </TooltipComponent>
                </div>


                {activeMenu ? ( // SIDEBAR IMPLEMENTATION
                    <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                    <Sidebar />
                    </div>
                ) : (
                    <div className="w-0 dark:bg-secondary-dark-bg">
                    <Sidebar />
                    </div>
                )}

                <div
                    className={ // MAIN BACKGROUND IMPLEMENTATION
                    activeMenu
                        ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                        : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
                    }
                >
                    
                    {/* NAVBAR IMPLEMENTATION */}
                    <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                        <Navbar />
                    </div>

                    <div>
                        {themeSettings && <ThemeSettings />}
                        <div>
                             <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg dark:text-white">
                                    <Header category="Table" title="Stock Requisitions Report Preview" />
                                    
                               
                                    <div className=" flex items-center mb-5 ">
                                        <div className="mr-0 ml-auto">
                                            <button onClick={createPDF} type="button" className="py-1 px-4 rounded-lg text-white hover:bg-slate-700 bg-slate-500" >Download</button>
                                        </div>
                                    </div>

                               
                                    <div className="block w-full overflow-x-auto rounded-lg" id="tableContainer">
                                    <table className="w-full rounded-lg">
                                        <thead>
                                            <tr className="bg-slate-200 text-md h-12 dark:bg-slate-800">
                                            <TableHeader value ="Invoice No"></TableHeader>
                                            <TableHeader value ="Product"></TableHeader>
                                            <TableHeader value ="Quantity"></TableHeader>
                                            <TableHeader value ="Requested Date"></TableHeader>
                                            <TableHeader value ="Supervisor"></TableHeader>
                                            <TableHeader value ="Team Lead"></TableHeader>
                                            <TableHeader value ="Status"></TableHeader>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Order.map((data,key)=>{
                                                if(data.status == "Stock Requested"){
                                                    return ( 
                                                        <tr className="text-sm h-10 border dark:border-slate-600" key={key}>
                                                            <TableData value={data.invoiceNo}/>
                                                            <TableData value={data.product}/>
                                                            <TableData value={data.unitQty}/>
                                                            <TableData value={new Date(data.requestDate).toISOString().split('T')[0]}/>
                                                            <TableData value={data.supervisor}/>
                                                            <TableData value={data.teamLead}/>
                                                            <TableData value={data.status}/>
                                                     </tr>
                                                    )
                                                }

                                            })}
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                             </div>
                        <Footer />
                    </div>  
                </div>
            </div>
        </div>
    </div>
  );
};
