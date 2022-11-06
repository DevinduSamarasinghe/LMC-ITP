import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import {
  Header,
  Navbar,
  Footer,
  Sidebar,
  ThemeSettings,
} from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';
import TableData from '../../components/Table/TableData';
import TableHeader from '../../components/Table/TableHeader';

const DriverViewViewAll = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  const [driver, setDriver] = useState([]); // useState is a hook that is used to create a state variable and a function to update it
  const [value, setValue] = useState('');
  const [tableFilter, setTableFilter] = useState([]);

  const filterData = (e) => {
    console.log(driver);
    if (e.target.value !== '') {
      setValue(e.target.value);
      const filterTable = driver.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
      setTableFilter([...filterTable]);
    } else {
      setValue(e.target.value);
    }
  };

  const getDriver = async () => {
    axios
      .get('http://localhost:8070/driver/')
      .then((res) => {
        setDriver(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    getDriver();
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []); // [] is used to call the function only once

  const deleteDriver = async (id) => {
    await axios
      .delete(`http://localhost:8070/driver/delete/${id}`)
      .then((res) => {
        if (window.confirm('Do you want to delete?')) {
          alert('Driver Details Deleted');
          getDriver();
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div>
      <div className={currentMode === 'Dark' ? 'dark' : ''}>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            {' '}
            {/* THEME SETTINGS BUTTON */}
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
            className={
              // MAIN BACKGROUND IMPLEMENTATION
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
                <div>
                  <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg dark:text-white">
                    <Header category="Table" title="Drivers" />

                    <div className="flex items-center mb-5 ">
                      <div>
                        <input
                          type="text"
                          className=" block w-400 rounded-md bg-gray-100 focus:bg-white dark:text-black"
                          placeholder="Search Here"
                          value={value}
                          onChange={filterData}
                        />
                      </div>
                      <div className="mr-0 ml-auto">
                        <Link to="/DriverReport">
                          {/* change this link your preview page */}
                          <button
                            type="button"
                            className="py-1 px-4 rounded-lg text-white hover:bg-slate-700 bg-slate-500"
                          >
                            Generate Report
                          </button>
                        </Link>
                      </div>
                    </div>

                    <div className="block w-full overflow-x-auto rounded-lg">
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
                            <TableHeader value="Manage" />
                          </tr>
                        </thead>
                        <tbody>
                          {value.length > 0
                            ? tableFilter.map((data) => (
                                // map is used to iterate through the transport details
                                <tr
                                  className="text-sm h-10 border dark:border-slate-600"
                                  key={data._id}
                                >
                                  <TableData
                                    value={data.driverDetails.map(
                                      (driverData) => (
                                        <div>
                                          <TableData
                                            value={driverData.employeeNIC}
                                          />
                                        </div>
                                      )
                                    )}
                                  />

                                  <TableData value={data.fullName} />
                                  <TableData value={data.drivingLicenseNo} />
                                  <TableData
                                    value={data.driverDetails.map(
                                      (driverData) => (
                                        <div>
                                          <TableData
                                            value={
                                              driverData.employeeContactNumber
                                            }
                                          />
                                        </div>
                                      )
                                    )}
                                  />
                                  <TableData value={data.vehicleNo} />
                                  <TableData value={data.vehicleModel} />
                                  <TableData value={data.status} />

                                  <td className="text-center px-3 align-middle border-l-0 border-r-0 text-m whitespace-nowrap p-3">
                                    <Link to={`/driverUpdate/${data._id}`}>
                                      <button
                                        type="button"
                                        className="font-bold py-1 px-4 rounded-full mx-3 text-white"
                                        style={{ background: currentColor }}
                                      >
                                        <i className="fas fa-edit" />
                                      </button>
                                    </Link>
                                    <button
                                      type="button"
                                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 ml-2 rounded-full"
                                      onClick={() => {
                                        deleteDriver(data._id);
                                      }}
                                    >
                                      <i className="fas fa-trash" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            : driver.map((data) => (
                                <tr
                                  className="text-sm h-10 border dark:border-slate-600"
                                  key={data._id}
                                >
                                  <TableData
                                    value={data.driverDetails.map(
                                      (driverData) => (
                                        <div>
                                          <TableData
                                            value={driverData.employeeNIC}
                                          />
                                        </div>
                                      )
                                    )}
                                  />

                                  <TableData value={data.fullName} />
                                  <TableData value={data.drivingLicenseNo} />
                                  <TableData
                                    value={data.driverDetails.map(
                                      (driverData) => (
                                        <div>
                                          <TableData
                                            value={
                                              driverData.employeeContactNumber
                                            }
                                          />
                                        </div>
                                      )
                                    )}
                                  />
                                  <TableData value={data.vehicleNo} />
                                  <TableData value={data.vehicleModel} />
                                  <TableData value={data.status} />

                                  <td className="text-center px-3 align-middle border-l-0 border-r-0 text-m whitespace-nowrap p-3">
                                    <Link to={`/driverUpdate/${data._id}`}>
                                      <button
                                        type="button"
                                        className="font-bold py-1 px-4 rounded-full mx-3 text-white"
                                        style={{ background: currentColor }}
                                      >
                                        <i className="fas fa-edit" />
                                      </button>
                                    </Link>
                                    <button
                                      type="button"
                                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 ml-2 rounded-full"
                                      onClick={() => {
                                        deleteDriver(data._id);
                                      }}
                                    >
                                      <i className="fas fa-trash" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
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

export default DriverViewViewAll;
