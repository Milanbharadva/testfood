import { FaSearch } from "react-icons/fa";

const CategoryNavbar = ({
  categories,
  activecategory,
  oncategorychange,
  onkeywordchange,
  keyword,
  onnumberchange,
}) => {
  return (
    <div className="mt-5 w-[80vw] md:w-[50vw] mx-auto sticky top-2 bg-white z-10">
      <div className="border-b-2  mx-auto items-center  bg-white border-[#28bcab] gap-5 flex">
        <FaSearch className="text-[#28bcab]" />
        <input
          type="search"
          className="w-[100%] outline-none text-xl font-bold h-10 flex"
          placeholder="Search..."
          onChange={(e) => {
            onkeywordchange(e.target.value);
          }}
          value={keyword}
        />
      </div>
      <ul className="mt-1 flex py-2  items-center overflow-x-auto  bg-[#28bcab] text-white px-4 ">
        {categories.map((category) => {
          return (
            <li
              key={category}
              className={`list-none py-3 cursor-pointer ${
                category === activecategory ? "bg-[#00000033] " : ""
              }px-3 py-3 transition-all duration-300 text-[14px] md:text-[16px] whitespace-nowrap`}
              onClick={() => {
                onnumberchange();
                oncategorychange(category);
              }}
            >
              {category}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default CategoryNavbar;
