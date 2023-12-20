import { useCallback, useEffect, useRef, useState } from "react";
import { BUSINESS_NAME, getBusinessData, resolveimg } from "../global";
import Header from "./Header";
import CategoryNavbar from "./CategoryNavbar";
import ProductList from "./ProductList";
import useProduct from "../hook/useProduct";
import Cart from "./Cart";
import Loader from "./Loader";

const ProductDashboard = () => {
  const [changecount, setchangecount] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [storeInfo, setStoreInfo] = useState({});
  const [cartOptions, setCartOptions] = useState({});
  const [categories, setCategories] = useState([]);
  const [activecategory, setactiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [keyword, setkeyword] = useState("");
  useEffect(() => {
    if (sessionStorage.getItem("clearcart")) {
      removecart();
      sessionStorage.removeItem("clearcart");
    }
    setLoading(true);
    document.title = window.location.pathname.replace("/", "");
    getBusinessData()
      .then((res) => {
        if (res.status === 200) return res.json();
        else throw Error;
      })
      .then((data) => {
        if (data) {
          const store_info = data.store_info;
          setStoreInfo(store_info);
          setCartOptions(data.cart_options);
          const cats = data.categories;
          if (Object.values(cats).length > 0) {
            const d = Object.values(cats);
            d.unshift("All");
            setCategories(d);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
        setNotFound(true);
      });
  }, []);
  const [pageNumber, setPageNumber] = useState(0);
  const removecart = () => {
    Object.keys(sessionStorage)
      .filter((item) => item.includes(BUSINESS_NAME))
      .map((items) => {
        sessionStorage.removeItem(items);
      });
  };
  const cartchangehandler = () => {
    setchangecount(!changecount);
  };
  const addproductcart = (product, variation) => {
    if (variation) {
      let elem = JSON.parse(
        sessionStorage.getItem(
          `${BUSINESS_NAME}-${product.id}_${variation.name}`
        )
      );
      if (elem) {
        sessionStorage.setItem(
          `${BUSINESS_NAME}-${product.id}_${variation.name}`,
          JSON.stringify({ count: parseInt(elem.count) + 1, product: product })
        );
      } else {
        sessionStorage.setItem(
          `${BUSINESS_NAME}-${product.id}_${variation.name}`,
          JSON.stringify({ count: 1, product: product })
        );
      }
    } else {
      let elem = JSON.parse(
        sessionStorage.getItem(`${BUSINESS_NAME}-${product.id}`)
      );
      if (elem) {
        sessionStorage.setItem(
          `${BUSINESS_NAME}-${product.id}`,
          JSON.stringify({ count: parseInt(elem.count) + 1, product: product })
        );
      } else {
        sessionStorage.setItem(
          `${BUSINESS_NAME}-${product.id}`,
          JSON.stringify({ count: 1, product: product })
        );
      }
    }
  };

  const rendernotFound = () => {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <h1 className="text-2xl font-bold">404 | Business Not Found</h1>
      </div>
    );
  };
  const { loadingproduct, hasmore, products } = useProduct({
    category: activecategory,
    keyword,
    pageNumber,
  });
  const observer = useRef();
  const lastProductElementRef = useCallback(
    (node) => {
      if (loadingproduct) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasmore) {
          setPageNumber(pageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingproduct, hasmore]
  );
  if (loading)
    return (
      <Loader styleforloader="text-center h-[100vh] flex justify-center items-center" />
    );

  return notFound ? (
    rendernotFound()
  ) : (
    <>
      <Header store_info={storeInfo} />
      <CategoryNavbar
        keyword={keyword}
        categories={categories}
        activecategory={activecategory}
        oncategorychange={(category) => {
          setactiveCategory(category);
        }}
        onnumberchange={() => setPageNumber(0)}
        onkeywordchange={(key) => {
          if (activecategory !== "All") {
            setactiveCategory("All");
          }
          setkeyword(key);
        }}
      />
      <ProductList
        onAddToCart={addproductcart}
        products={products}
        storeInfo={storeInfo}
        lastProductElementRef={lastProductElementRef}
        onchangecount={cartchangehandler}
      />
      {loadingproduct && (
        <Loader styleforloader="text-center h-[20vh] flex justify-center items-center" />
      )}
      <Cart
        storeInfo={storeInfo}
        cartOptions={cartOptions}
        fromWhatsAppNo={storeInfo.store_whatsapp}
        clearcart={removecart}
      />
    </>
  );
};
export default ProductDashboard;
