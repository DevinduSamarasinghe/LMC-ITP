import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Header } from '../../components';
import TableData from '../../components/Table/TableData';
import TableHeader from '../../components/Table/TableHeader';

const DriverReport = () => {
  const [transport, setTransport] = useState([]);

  const getTransport = async () => {
    axios
      .get('http://localhost:8070/driver/')
      .then((res) => {
        setTransport(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    getTransport();
  }, []);

  const createPDF = () => {
    const date = new Date(Date.now()).toISOString().split.T[0];
    const pdf = new jsPDF('landscape', 'px', 'a1', false);
    const data = document.querySelector('#tableContainer');
    pdf.html(data).then(() => {
      pdf.save(`Drivers Report-${date}.pdf`);
    });
  };

  return (
    <div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg dark:text-white">
        <Header category="Report" title="Drivers" />

        <div className=" flex items-center mb-5 ">
          <div className="mr-0 ml-auto">
            <button
              onClick={createPDF}
              type="button"
              className="py-1 px-4 rounded-lg text-white hover:bg-slate-700 bg-slate-500"
            >
              Generate Report
            </button>
          </div>
        </div>

        <div
          className="block w-full overflow-x-auto rounded-lg"
          id="tableContainer"
        >
          <table className="w-full rounded-lg">
            <thead>
              <tr className="bg-slate-200 text-md h-12 dark:bg-slate-800">
                <TableHeader value="NIC" />
                <TableHeader value="Full Name" />
                <TableHeader value="Driving License No" />
                <TableHeader value="Contact No" />
                <TableHeader value="Vehicle Number" />
                <TableHeader value="Vehicle Model" />
                <TableHeader value="Status" />
              </tr>
            </thead>

            <tbody>
              {transport.map((data, key) => (
                <tr
                  className="text-sm h-10 border dark:border-slate-600"
                  key={key}
                >
                  <TableData value={data.nic} />
                  <TableData value={data.fullName} />
                  <TableData value={data.drivingLicenseNo} />
                  <TableData value={data.contactNo} />
                  <TableData value={data.vehicleNo} />
                  <TableData value={data.vehicleModel} />
                  <TableData value={data.status} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverReport;
