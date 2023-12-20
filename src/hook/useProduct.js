import { useEffect, useState } from "react";
import { BUSINESS_NAME } from "../global";
import axios from "axios";
const useProduct = ({ category, keyword, pageNumber }) => {
  const ALL_CATEGORY = "All";
  const TODAY_SPECIAL_CATEGORY = "Today's Special";
  const EXCLUDE_CATEGORIES = [ALL_CATEGORY, TODAY_SPECIAL_CATEGORY];

  const [loadingproduct, setloadingproduct] = useState(false);
  const [hasmore, sethasmore] = useState(false);
  const [products, setproducts] = useState(undefined);
  useEffect(() => {
    setproducts([]);
  }, [category, keyword]);
  const getUrl = () => {
    const params = [`page=${encodeURIComponent(pageNumber)}`];
    if (category && !EXCLUDE_CATEGORIES.includes(category)) {
      params.push(`category=${encodeURIComponent(category)}`);
    } else if (category === TODAY_SPECIAL_CATEGORY) {
      params.push("today_special=1");
    }
    if (keyword) {
      params.push(`search=${keyword}`);
    }
    return `/api/${BUSINESS_NAME}/product?${params.join("&")}`;
  };
  useEffect(() => {
    setloadingproduct(true);
    let cancelToken;
    axios({
      method: "GET",
      url: getUrl(),
      cancelToken: new axios.CancelToken((c) => (cancelToken = c)),
    })
      .then((res) => {
        if (res.status === 200) return res.data;
        else throw Error;
      })
      .then((res) => {
        const paginationInfo = res.pagination;
        const prods = res.products;
        const more =
          ((paginationInfo?.cur_page || 0) + 1) *
            (paginationInfo?.per_page || 0) <=
            paginationInfo.total_pro || 0;
        setproducts((prevProducts) => {
          if (prevProducts) return [...prevProducts, ...Object.values(prods)];
          else return Object.values(prods);
        });
        sethasmore(Boolean(more));
        setloadingproduct(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setloadingproduct(false);
      });
    // return () => cancelToken?.();
  }, [pageNumber, keyword, category]);
  return { loadingproduct, hasmore, products };
};
export default useProduct;
