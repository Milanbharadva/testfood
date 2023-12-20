import { resolveimg } from "../global";

const Header = ({ store_info }) => {
  return (
    <header>
      <div
        style={{
          backgroundColor: store_info.store_bgcolor,
          color: store_info.store_color,
        }}
        className="py-4 flex flex-col justify-center items-center gap-2"
      >
        <div>
          <img
            src={resolveimg(store_info.store_logo)}
            alt="store logo"
            style={{ height: "120px" }}
          />
        </div>
        <div>
          <p className="text-3xl font-bold">{store_info.store_name}</p>
        </div>
      </div>
      {store_info.store_about && (
        <p className="flex justify-center">{store_info.store_about}</p>
      )}
    </header>
  );
};
export default Header;
