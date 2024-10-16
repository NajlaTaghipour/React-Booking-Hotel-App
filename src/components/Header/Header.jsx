import { MdLocationOn, MdLogout } from "react-icons/md";
import { HiCalendar, HiMinus, HiPlus } from "react-icons/hi";
import { HiSearch } from "react-icons/hi";
import { useRef, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import {
  createSearchParams,
  NavLink,
  useNavigate,
  // useSearchParams,
} from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Header() {
  const [destination, setDestination] = useState("");
  const [openOptions, setOpenOptions] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);
  const [option, setOption] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const handleOption = (name, operation) => {
    setOption((prev) => {
      return {
        ...prev,
        [name]: operation === "inc" ? option[name] + 1 : option[name] - 1,
      };
    });
  };
  const navigate = useNavigate();
  // const [searchParams, setSearcgParams] = useSearchParams();

  const handleSearch = () => {
    const encodedeParams = createSearchParams({
      date: JSON.stringify(date),
      destination,
      option: JSON.stringify(option),
    });
    // setSearcgParams(encodedeParams);
    navigate({
      pathname: "/hotels",
      search: encodedeParams.toString(),
    });
  };
  return (
    <div>
      <div className="header">
        <NavLink to="/bookmarks">Bookmarks </NavLink>
        <div className="headerSearch">
          <div className="headerSearchItem">
            <MdLocationOn className="headerIcon locationIcon" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              type="text"
              placeholder="where to go?"
              className="headerSearchItem"
              name="destination"
            />
            <span className="seperator"></span>
          </div>
          <div className="headerSearchItem">
            <HiCalendar className="headerIcon dateIcon" />
            <div
              onClick={() => setOpenDate(!openDate)}
              className="dateDropDown"
              id="dateDropDown"
            >
              {`${format(date[0].startDate, "MM/dd/yyyy")}  to ${format(
                date[0].endDate,
                "MM/dd/yyyy"
              )} `}
            </div>
            {openDate && (
              // <DateRange
              //   className="date"
              //   ranges={date}
              //   onChange={(item) => setDate([item.selection])}
              //   minDate={new Date()}
              //   moveRangeOnFirstSelection={true}
              // />
              <DateOutsideClick
                setOpenDate={setOpenDate}
                setDate={setDate}
                date={date}
              />
            )}
            <span className="seperator"></span>
          </div>
          <div className="headerSearchItem">
            <div
              id="optionDropDown"
              onClick={() => setOpenOptions(!openOptions)}
            >
              {option.adult} &bull; adult &nbsp;&nbsp; {option.children} &bull;
              children &nbsp;&nbsp;
              {option.room} &bull; room
            </div>
            {openOptions && (
              <GuestOptionLists
                setOpenOptions={setOpenOptions}
                option={option}
                handleOption={handleOption}
              />
            )}
            <span className="seperator"></span>
          </div>
          <div className="headerSearchItem">
            <div className="headerSearchBtn" onClick={handleSearch}>
              <HiSearch className="hearderIcon" />
            </div>
          </div>
        </div>
        <User />
      </div>
    </div>
  );
}

export default Header;

function DateOutsideClick({ setOpenDate, setDate, date }) {
  const dateRef = useRef();
  useOutsideClick(dateRef, "dateDropDown", () => setOpenDate(false));

  return (
    <div ref={dateRef}>
      <DateRange
        className="date"
        ranges={date}
        onChange={(item) => setDate([item.selection])}
        minDate={new Date()}
        moveRangeOnFirstSelection={true}
      />
    </div>
  );
}

function GuestOptionLists({ option, handleOption, setOpenOptions }) {
  const optionRef = useRef();
  useOutsideClick(optionRef, "optionDropDown", () => setOpenOptions(false));
  return (
    <div className="guestOptions" ref={optionRef}>
      <OptionItem
        handleOption={handleOption}
        type="adult"
        option={option}
        minLimit={1}
      />
      <OptionItem
        handleOption={handleOption}
        type="children"
        option={option}
        minLimit={0}
      />
      <OptionItem
        handleOption={handleOption}
        type="room"
        option={option}
        minLimit={1}
      />
    </div>
  );
}

function OptionItem({ type, option, minLimit, handleOption }) {
  return (
    <div className="guestOptionItem">
      <span className="optionText">{type}</span>
      <div className="optionCounter">
        <button
          className="optionCounterBtn"
          disabled={option[type] <= minLimit}
          onClick={() => handleOption(type, "dec")}
        >
          <HiMinus />
        </button>
        <span className="optionCounterNumber">{option[type]}</span>
        <button
          className="optionCounterBtn"
          onClick={() => handleOption(type, "inc")}
        >
          <HiPlus />
        </button>
      </div>
    </div>
  );
}

function User() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <span>
            Hi {user.name}! <Greetings /> &nbsp;
          </span>
          <button>
            <MdLogout onClick={handleLogout} className="icon logout" />
          </button>
        </div>
      ) : (
        <NavLink to="/login">login</NavLink>
      )}
    </div>
  );
}

const Greetings = () => {
  let myDate = new Date();
  let hours = myDate.getHours();
  let greet;

  if (hours < 12) greet = "morning";
  else if (hours >= 12 && hours <= 17) greet = "afternoon";
  else if (hours >= 17 && hours <= 24) greet = "evening";

  return <span>good {greet}</span>;
};
