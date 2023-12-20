import Default from "./productcard/Default";

const ProductList = ({
  products,
  onAddToCart,
  onchangecount,
  loadingproduct,
  lastProductElementRef,
  storeInfo,
}) => {
  return (
    <div className="mt-5">
      {products &&
        products.map((item, index) => (
          <Default
            products={item}
            key={item.id + item.id + Math.random()}
            lastProductElementRef={
              index === products.length - 1 ? lastProductElementRef : undefined
            }
            onAddToCart={onAddToCart}
            onchangecount={onchangecount}
            loadingproduct={loadingproduct}
            storeInfo={storeInfo}
          />
        ))}
    </div>
  );
};
export default ProductList;
