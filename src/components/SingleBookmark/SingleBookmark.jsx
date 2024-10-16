import { useNavigate, useParams } from "react-router-dom";
import { useBookmark } from "../context/BookmarkListContext";
import { useEffect } from "react";
import Loader from "../Loader/Loader";
import ReactCountryFlag from "react-country-flag";

function SingleBookmark() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookmark, currentBookmark, isLoading } = useBookmark();

  useEffect(() => {
    getBookmark(id);
  }, [id]);

  if (isLoading || !currentBookmark) return <Loader />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn--back">
        Back
      </button>
      <h2>{currentBookmark.cityName}</h2>
      <div className="bookmarkItem">
        <div>
          <ReactCountryFlag svg countryCode={currentBookmark.countryCode} />
          &nbsp;
          <strong>{currentBookmark.cityName}</strong> &nbsp;
        </div>
        <span>{currentBookmark.country}</span>
      </div>
    </div>
  );
}

export default SingleBookmark;
