import { useState } from "react";
import { BUSINESS_NAME, resolveimg } from "../../global";
import { FaCartPlus } from "react-icons/fa";

const Default = ({
  products,
  lastProductElementRef,
  onAddToCart,
  onchangecount,
  storeInfo,
}) => {
  const variationdata = products.variation_data
    ? JSON.parse(products.variation_data)
    : undefined;
  const [selectedoption, setselectedoption] = useState(
    variationdata ? variationdata.variations[0] : undefined
  );
  const onclickcarthandler = (products) => {
    onAddToCart(products, selectedoption);
  };
  var elem;
  if (variationdata) {
    elem = JSON.parse(
      sessionStorage.getItem(
        `${BUSINESS_NAME}-${products.id}_${selectedoption.name}`
      )
    );
  } else {
    elem = JSON.parse(
      sessionStorage.getItem(`${BUSINESS_NAME}-${products.id}`)
    );
  }
  if (elem) {
    var count = elem.count;
  }
  return (
    <div
      className="md:w-[50vw] w-[80vw] mx-auto border  p-2"
      ref={lastProductElementRef}
    >
      <div className="flex items-center md:gap-5 gap-2 flex-col md:flex-row">
        <div className="md:w-1/5 relative">
          <img
            src={resolveimg(products.product_image)}
            style={{ height: "120px" }}
            alt={products.name}
            className="m-auto select-none"
          />
          {count && (
            <p className="absolute right-0 -top-2 bg-[#28bcab] text-white h-7 w-7 text-center rounded-[50%]">
              {count}
            </p>
          )}
        </div>
        <div className="md:w-2/5 select-none">
          <p className="text-lg font-bold">{products.name}</p>
          <p className="text-sm font-light">{products.description}</p>
        </div>
        <div className="md:w-1/5 text-center">
          {!variationdata && (
            <p>
              {storeInfo.store_currency} {products.price}
            </p>
          )}
          {variationdata && (
            <p>
              {storeInfo.store_currency} {selectedoption.price}
            </p>
          )}
          {variationdata && (
            <div className="flex  justify-center">
              <p>{variationdata.variation_title} : </p>
              <select
                name="variations_select"
                defaultValue={selectedoption.name}
                onChange={(e) => {
                  e.preventDefault();
                  const val = e.target.value;
                  setselectedoption(
                    variationdata.variations.filter(
                      (variation) => variation.name === val
                    )[0]
                  );
                }}
              >
                {variationdata.variations.map((variation) => {
                  return (
                    <option
                      key={`${variation.name}_${variation.price}`}
                      value={variation.name}
                    >
                      {variation.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
        <div
          className="border text-white cursor-pointer bg-[#28bcab] p-2 rounded-[50%]  "
          onClick={() => {
            onchangecount();
            onclickcarthandler(products);
          }}
        >
          <FaCartPlus className="text-xl " />
        </div>
      </div>
    </div>
  );
};
export default Default;
