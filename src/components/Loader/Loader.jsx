import { LoaderIcon } from "react-hot-toast";

function Loader() {
  return (
    <div style={{ display: "flex", color: "var(--slate-300)" }}>
      <p>Data is Loading &nbsp;</p>
      <button>
        <LoaderIcon />
      </button>
    </div>
  );
}

export default Loader;
