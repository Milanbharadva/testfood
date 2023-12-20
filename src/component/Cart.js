import { FaShoppingCart } from "react-icons/fa";
import { BUSINESS_NAME, resolveimg } from "../global";
import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { ImBin } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Cart = ({ storeInfo, cartOptions, fromWhatsAppNo }) => {
  if (cartOptions.delivery_options) {
    var itemcart = Object.values(cartOptions.delivery_options)[0];
  }
  const notifyadress = () => toast("please enter address");
  const notifymobile = () => toast("please enter mobile number");

  const [showModal, setShowModal] = useState(false);
  const [number, setnumber] = useState(0);
  const [address, setaddress] = useState("");
  const [selectedoption, setselectedoption] = useState(itemcart);
  var total = 0;
  let itemcount = Object.keys(sessionStorage).filter((key) =>
    key.includes(`${BUSINESS_NAME}-`)
  );
  const [reload, setreload] = useState(true);
  let cartarray = [];
  Object.keys(sessionStorage)
    .filter((key) => {
      return key.includes(`${BUSINESS_NAME}-`);
    })
    .forEach((item) => {
      cartarray.push({
        item,
        product: JSON.parse(sessionStorage.getItem(item)),
      });
    });

  cartarray.map((cartitem) => {
    cartitem.product.product.variation_data === ""
      ? (total += parseFloat(cartitem.product.product.price))
      : (total += parseFloat(
          JSON.parse(cartitem.product.product.variation_data).variations.filter(
            (item) => item.name == cartitem.item.split("_")[1]
          )[0].price
        ));
  });
  const order = () => {
    let str;
    if (address == "") {
      notifyadress();
    } else if (number == 0) {
      notifymobile();
    } else if (number != 0 && address != "") {
      str = `New Order :${Math.round(
        Math.random() * 1000
      )} * * (_${selectedoption}_) • `;
      cartarray.map((item) => {
        str += `${item.product.product.name} x ${item.product.count} `;
      });
      str += `total payable amount: ${storeInfo.store_currency} ${totalswithquantity} * * Address: ${address} * * Number : ${number}`;
      sessionStorage.setItem("clearcart", true);
      window.location.href = `https://api.whatsapp.com/send?phone=${fromWhatsAppNo}&text=${encodeURIComponent(
        str
      )}`;
    }
  };
  var a,
    totalswithquantity = 0;
  return (
    <>
      {" "}
      <ToastContainer />
      {showModal ? (
        <>
          <div className="justify-center items-center  flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 max-h-[80vh] overflow-auto w-[85vw] lg:w-[60vw] rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex flex-col items-start justify-between md:p-5 p-3 border-b border-solid border-blueGray-200 rounded-t">
                  <div className="flex w-full justify-between relative">
                    <p>Checkout</p>
                    <div
                      className="absolute top-5 right-5 cursor-pointer"
                      onClick={() => {
                        setShowModal(false);
                      }}
                    >
                      <IoCloseSharp className="text-2xl" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">
                    {storeInfo.store_name}
                  </h3>
                </div>
                <div className="relative md:p-6 p-3 flex-auto">
                  {itemcount.length === 0 ? (
                    <div>
                      <p>Cart is empty</p>
                      <p>Choose your products</p>
                    </div>
                  ) : (
                    <div>
                      {cartarray != null && (
                        <div>
                          {cartarray.map((cartitem) => {
                            return (
                              <div
                                className="border  p-3"
                                key={cartitem.item + Math.random()}
                              >
                                <div className="flex justify-between">
                                  <img
                                    src={resolveimg(
                                      cartitem.product.product.product_image
                                    )}
                                    height="60px"
                                    width="60px"
                                    alt=""
                                  />
                                  <ImBin
                                    onClick={() => {
                                      sessionStorage.removeItem(cartitem.item);
                                      setreload(!reload);
                                    }}
                                  />
                                </div>
                                <p>
                                  {cartitem.product.product.name}{" "}
                                  {cartitem.item.split("_")[1] != null &&
                                    `( ${cartitem.item.split("_")[1]} )`}
                                </p>
                                <div className="flex justify-between flex-col gap-2  md:flex-row md:gap-0">
                                  <input
                                    type="text"
                                    placeholder="Add note..."
                                    className="border"
                                  />
                                  <div className="flex gap-2">
                                    <p>
                                      {storeInfo.store_currency}{" "}
                                      {
                                        (a =
                                          cartitem.product.product
                                            .variation_data == ""
                                            ? parseFloat(
                                                cartitem.product.product.price
                                              )
                                            : parseFloat(
                                                JSON.parse(
                                                  cartitem.product.product
                                                    .variation_data
                                                ).variations.filter(
                                                  (item) =>
                                                    item.name ==
                                                    cartitem.item.split("_")[1]
                                                )[0].price
                                              ))
                                      }
                                    </p>
                                    <span>x</span>
                                    <input
                                      type="number"
                                      min="1"
                                      max="1000"
                                      value={parseInt(cartitem.product.count)}
                                      onChange={(e) => {
                                        sessionStorage.setItem(
                                          cartitem.item,
                                          JSON.stringify({
                                            count: e.target.value,
                                            product: cartitem.product.product,
                                          })
                                        );
                                        setreload(!reload);
                                      }}
                                      className="border  w-16 pl-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    =
                                    <p>
                                      {storeInfo.store_currency}{" "}
                                      {parseFloat(a) *
                                      parseInt(cartitem.product.count)
                                        ? (
                                            parseFloat(a) *
                                            parseInt(cartitem.product.count)
                                          ).toFixed(2)
                                        : "0"}
                                    </p>
                                  </div>
                                </div>
                                <p className="hidden">
                                  {parseFloat(a) *
                                  parseInt(cartitem.product.count)
                                    ? (totalswithquantity +=
                                        parseFloat(a) *
                                        parseInt(cartitem.product.count))
                                    : "0"}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div className="mt-3  ">
                        <p className="text-xl font-bold text-right">
                          Total : {""}
                          {storeInfo.store_currency}{" "}
                          {totalswithquantity.toFixed(2)}
                        </p>
                        <div
                          className="text-right mt-3"
                          onClick={() => {
                            Object.keys(sessionStorage)
                              .filter((item) => item.includes(BUSINESS_NAME))
                              .map((items) => {
                                sessionStorage.removeItem(items);
                              });
                            setreload(!reload);
                          }}
                        >
                          <button className="border text-red-600 border-red-600 py-1 px-2 ">
                            Clear Cart
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center sm:flex-row gap-2 justify-center mt-5 ">
                        {Object.values(cartOptions.delivery_options).map(
                          (item) => {
                            return (
                              <div
                                key={item}
                                className={`${
                                  item === selectedoption
                                    ? "text-white bg-[#28bcab]"
                                    : "bg-white text-[#28bcab]"
                                } border border-[#28bcab] h-16 w-24 flex justify-center text-center items-center cursor-pointer `}
                                onClick={() => setselectedoption(item)}
                              >
                                {item}
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="mt-10">
                        <form action="" className="flex flex-col gap-2">
                          <label
                            htmlFor="number"
                            className="text-lg font-semibold"
                          >
                            Mobile No.
                          </label>
                          <input
                            type="number"
                            value={number == 0 ? "" : number}
                            onChange={(e) => {
                              setnumber(e.target.value);
                            }}
                            name="number"
                            className="border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus::border-blue-800 pl-2 h-10"
                            placeholder="Enter your mobile number"
                          />

                          <label
                            htmlFor="address"
                            className="text-lg font-semibold"
                          >
                            Address
                          </label>
                          <textarea
                            placeholder="Enter your address"
                            value={address}
                            onChange={(e) => {
                              setaddress(e.target.value);
                            }}
                            name="address"
                            className="border h-24 pl-2 pt-1"
                          />
                        </form>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-5 justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 border-red-500 border h-12 px-2 "
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className={`${
                      itemcount == 0 ? "pointer-events-none opacity-50 " : " "
                    }bg-[#28bcab] border-[#28bcab] h-12 px-3  text-white`}
                    onClick={order}
                  >
                    Order on Whatsapp
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <div className="fixed bottom-8 right-8">
        <div
          className="text-white bg-[#28bcab]  border p-3 rounded-[50%] relative cursor-pointer"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <FaShoppingCart className="text-3xl" />
          <span className="absolute top-0 right-0 bg-red-500 text-center rounded-[50%] h-[25px] w-[25px]">
            {itemcount.length}
          </span>
        </div>
      </div>
    </>
  );
};
export default Cart;
